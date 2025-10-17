import { GoogleGenerativeAI } from '@google/generative-ai';

// Read Gemini/Generative AI key from environment. For CRA use REACT_APP_GEMINI_API_KEY
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.warn('Gemini API key is not set. Set REACT_APP_GEMINI_API_KEY (or GEMINI_API_KEY) in your environment.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateSentence(word) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Generate a simple, clear sentence using the word "${word}". The sentence should be:
    - Easy to understand
    - Appropriate for pronunciation practice
    - Use the word in a natural context
    - Keep it under 15 words
    - Make it suitable for English learners
    
    Return only the sentence, nothing else.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const sentence = response.text().trim();

        return sentence;
    } catch (error) {
        console.error('Error generating sentence with Gemini:', error);
        throw new Error('Failed to generate sentence');
    }
}
