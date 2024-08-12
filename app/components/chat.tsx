

"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;

const AssistantMessage = ({ text, selectedVoice }: { text: string, selectedVoice: SpeechSynthesisVoice | null }) => {
  useEffect(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    synth.speak(utterance);
  }, [text, selectedVoice]);

  return (
    <div className={styles.assistantMessage}>
      <Markdown>{text}</Markdown>
    </div>
  );
};

const CodeMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.codeMessage}>
      {text.split("\n").map((line, index) => (
        <div key={index}>
          <span>{`${index + 1}. `}</span>
          {line}
        </div>
      ))}
    </div>
  );
};

const Message = ({ role, text, selectedVoice }: { role: "user" | "assistant" | "code", text: string, selectedVoice: SpeechSynthesisVoice | null }) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} selectedVoice={selectedVoice} />;
    case "code":
      return <CodeMessage text={text} />;
    default:
      return null;
  }
};

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
};

const Chat = ({
  functionCallHandler = () => Promise.resolve(""), // default to return empty string
}: ChatProps) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, {
        method: "POST",
      });
      const data = await res.json();
      setThreadId(data.threadId);
    };
    createThread();
  }, []);

 useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      const defaultVoice = availableVoices.find(voice => voice.name === "Google UK English Male") || availableVoices[0];
      setSelectedVoice(defaultVoice); // Set default voice to Robert American if available
    };
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        inputRef.current.value = transcript;
        recognition.stop();
        handleSubmit();
      };

      recognition.onend = () => {
        recognition.start();
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error detected: ' + event.error);
        recognition.stop();
        recognition.start();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } else {
      console.error('Speech recognition not supported in this browser.');
    }
  }, []);

  const sendMessage = async (text: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: text },
    ]);
    setUserInput("");
    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: text,
        }),
      }
    );
    if (response.ok) {
      const stream = AssistantStream.fromReadableStream(response.body);
      handleReadableStream(stream);
    } else {
      console.error("Failed to send message:", response.statusText);
    }
  };

  const handleReadableStream = (stream: AssistantStream) => {
    stream.on("textCreated", () => appendMessage("assistant", ""));
    stream.on("textDelta", (delta: any) => {
      if (delta.value != null) {
        appendToLastMessage(delta.value);
      }
    });
    stream.on("imageFileDone", (image: any) => {
      appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
    });
    stream.on("toolCallCreated", (toolCall: any) => {
      if (toolCall.type === "code_interpreter") {
        appendMessage("code", "");
      }
    });
    stream.on("toolCallDelta", (delta: any) => {
      if (delta.type === "code_interpreter" && delta.code_interpreter.input) {
        appendToLastMessage(delta.code_interpreter.input);
      }
    });
    stream.on("event", (event: any) => {
      if (event.event === "thread.run.requires_action") handleRequiresAction(event);
      if (event.event === "thread.run.completed") setInputDisabled(false);
    });
  };

  const handleRequiresAction = async (event: AssistantStreamEvent.ThreadRunRequiresAction) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    await submitActionResult(runId, toolCallOutputs);
  };

  const submitActionResult = async (runId: string, toolCallOutputs: any) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs,
        }),
      }
    );
    if (response.ok) {
      const stream = AssistantStream.fromReadableStream(response.body);
      handleReadableStream(stream);
    } else {
      console.error("Failed to submit action result:", response.statusText);
    }
  };

  const appendToLastMessage = (text: string) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (role: string, text: string) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userInput },
    ]);
    setUserInput("");
    setInputDisabled(true);
    scrollToBottom();
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} selectedVoice={selectedVoice} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className={`${styles.inputForm} ${styles.clearfix}`}
      >
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Begin speaking then press send"
        />
        <button
          type="submit"
          className={styles.button}
          disabled={inputDisabled}
        >
          Send
        </button>
      </form>
      <div className={styles.voiceSelector}>
        <label htmlFor="voice">Choose a voice:</label>
        <select
          id="voice"
          onChange={(e) => {
            const selected = voices.find(voice => voice.name === e.target.value);
            setSelectedVoice(selected || null);
          }}
        >
          {voices.map((voice, index) => (
            <option key={index} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Chat;
