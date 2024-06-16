import { openai } from "@/app/openai";
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing the files' });
        return;
      }

      const audioFile = files.audioFile as formidable.File;
      const fileStream = fs.createReadStream(audioFile.path);

      const response = await openai.createTranscription({
        file: fileStream,
        model: "whisper-1",
        language: "en",
      });

      res.status(200).json({ text: response.data.text });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
