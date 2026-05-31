import express from 'express';
import Groq from 'groq-sdk';
import multer from 'multer';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// ✅ Pass key directly instead of relying on process.env at import time
const client = new Groq({ 
  apiKey: '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' 
});

router.post('/chat', async (req, res) => {
  try {
    const { messages, system } = req.body;
    const response = await client.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  max_tokens: 4000,
      messages: [
        { role: 'system', content: system },
        ...messages
      ]
    });
    res.json({ content: response.choices[0].message.content });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'AI error' });
  }
});
router.post('/extract', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    let text = '';

    if (mimeType === 'application/pdf') {
      const data = await pdfParse(fileBuffer);
      text = data.text;
      return res.json({ text: { totalPages: data.numpages, text: data.text } });
    } else {
      text = fileBuffer.toString('utf-8');
      return res.json({ text: { totalPages: 1, text } });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Extraction failed' });
  }
});


export default router;