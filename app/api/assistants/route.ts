import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Create a new assistant
export async function POST() {
  const assistant = await openai.beta.assistants.create({
    instructions: "You are a helpful assistant.",
    name: "Quickstart Assistant",
    model: "gpt-4o",
    tools: [
      { type: "code_interpreter" },
      {
        type: "function",
        function: {
          name: "get_weather",
          description: "Determine weather in my location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state e.g. San Francisco, CA",
              },
              unit: {
                type: "string",
                enum: ["c", "f"],
              },
            },
            required: ["location"],
          },
        },
      },
      { type: "file_search" },
    ],
  });
  return Response.json({ assistantId: assistant.id });
}

// Text-to-Speech endpoint
export async function textToSpeech(text: string) {
  const response = await openai.audio.create({
    text,
    voice: "en_us_male",
  });
  return response.audio_url;
}

// Speech-to-Text endpoint
export async function speechToText(audioFile: File) {
  const formData = new FormData();
  formData.append("file", audioFile);
  const response = await openai.audio.transcribe(formData);
  return response.text;
}
