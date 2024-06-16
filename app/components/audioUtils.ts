// audioUtils.ts

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append("file", audioBlob);
  formData.append("model", "whisper-1");

  const response = await fetch("/api/openai/transcriptions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.text;
};

export const generateSpeech = async (text: string): Promise<string> => {
  const response = await fetch("/api/openai/speech", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1",
      input: text,
      voice: "alloy",
    }),
  });

  const data = await response.json();
  return data.audioUrl;
};
