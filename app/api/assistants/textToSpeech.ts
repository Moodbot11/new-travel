import { openai } from "@/app/openai";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text } = req.body;
    const response = await openai.audio.create({
      text,
      voice: "en_us_male",
    });
    res.status(200).json({ audioUrl: response.audio_url });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
