import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Create a new assistant
export async function POST(req, res) {
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
  res.status(200).json({ assistantId: assistant.id });
}

// Text-to-Speech endpoint
export async function handleTextToSpeech(req, res) {
  const { text } = req.body;
  const response = await openai.audio.create({
    text,
    voice: "en_us_male",
  });
  res.status(200).json({ audioUrl: response.audio_url });
}

// Speech-to-Text endpoint
export async function handleSpeechToText(req, res) {
  const { audioFile } = req.files;
  const formData = new FormData();
  formData.append("file", audioFile);
  const response = await openai.audio.transcribe(formData);
  res.status(200).json({ text: response.text });
}

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      if (req.url === '/api/assistants/textToSpeech') {
        return handleTextToSpeech(req, res);
      } else if (req.url === '/api/assistants/speechToText') {
        return handleSpeechToText(req, res);
      } else {
        return POST(req, res);
      }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
