
const functions = require('firebase-functions');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Use dotenv for local dev, functions.config() for deployed
let GEMINI_KEY = null;
if (process.env.FUNCTIONS_EMULATOR) {
    // Local emulator: load from .env
    require('dotenv').config();
    GEMINI_KEY = process.env.GEMINI_API_KEY;
} else {
    // Production: load from functions config
    GEMINI_KEY = functions.config().gemini && functions.config().gemini.key;
}

if (!GEMINI_KEY) {
    console.warn('No Gemini API key found. Set GEMINI_API_KEY in .env for local, or use firebase functions:config:set gemini.key="YOUR_KEY" for production.');
}
const genAI = new GoogleGenerativeAI(GEMINI_KEY);

exports.generateSentence = functions.https.onRequest(async (req, res) => {
    try {
        if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
        const { word } = req.body;
        if (!word) return res.status(400).json({ error: 'Missing word' });

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `Generate a simple, clear sentence using the word \"${word}\". The sentence should be easy to understand, appropriate for pronunciation practice, use the word in a natural context, under 15 words, suitable for English learners. Return only the sentence.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const sentence = response.text().trim();
        res.json({ sentence });
    } catch (err) {
        console.error('generateSentence error', err);
        res.status(500).json({ error: 'Generation failed' });
    }
});
