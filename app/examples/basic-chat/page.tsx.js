import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, voice } = req.body;

    try {
      const response = await axios.post('https://api.openai.com/v1/audio/speech', {
        model: 'tts-1',
        input: text,
        voice: voice,
        response_format: 'mp3'
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      });

      res.setHeader('Content-Type', 'audio/mpeg');
      res.status(200).send(response.data);
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      res.status(500).send('Error synthesizing speech');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
