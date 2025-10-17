import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyCA0H4soWr0GEoWdVSCNSXWLZAPaJITYIQ");

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
