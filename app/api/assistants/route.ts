import { openai } from "@/app/openai";
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      if (req.url.endsWith('/textToSpeech')) {
        return handleTextToSpeech(req, res);
      } else if (req.url.endsWith('/speechToText')) {
        return handleSpeechToText(req, res);
      } else {
        return createAssistant(req, res);
      }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function createAssistant(req: NextApiRequest, res: NextApiResponse) {
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

async function handleTextToSpeech(req: NextApiRequest, res: NextApiResponse) {
  const { text } = req.body;
  const response = await openai.audio.create({
    text,
    voice: "en_us_male",
  });
  res.status(200).json({ audioUrl: response.audio_url });
}

async function handleSpeechToText(req: NextApiRequest, res: NextApiResponse) {
  const { audioFile } = req.files;
  const formData = new FormData();
  formData.append("file", audioFile);
  const response = await openai.audio.transcribe(formData);
  res.status(200).json({ text: response.text });
}
