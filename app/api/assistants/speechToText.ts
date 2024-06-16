import { openai } from "@/app/openai";
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { audioFile } = req.files;
    const formData = new FormData();
    formData.append("file", audioFile);
    const response = await openai.audio.transcribe(formData);
    res.status(200).json({ text: response.text });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
