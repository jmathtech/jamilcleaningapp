import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, ChatSession, Content } from '@google/generative-ai';

// Ensure the API key is available
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

// --- START OF NEW SECTION ---

const companyKnowledge = `
You are a friendly, professional, and helpful customer support assistant for "Jamil's Cleaning Services".
Your goal is to answer user questions about our services and help them with their cleaning needs.

**Company Information:**
- **Company Name:** Jamil's Cleaning Services   
- **Website:** https://jamilcleaningapp.vercel.app  
- **Contact Name:** Jamil Matheny
- **Contact Title:** Owner/Operator
- **Contact Address:** 405 E. Laburnum Ave. Suite 3, Richmond, Virginia 23222
- **Contact Email:** jamil.matheny@majestikmagik.com
- **Phone Number:** (804) 362-7561
- **Services Offered:** We specialize in Residential Cleaning, Commercial Office Cleaning, Deep Cleaning, and Move-in/Move-out Cleaning.
- **Service Area:** We proudly serve the greater metropolitan area of Richmond, Virginia.

**Your Rules:**
1.  Always be polite and professional.
2.  Use the information provided above to answer questions accurately.
3.  If a user asks for a price quote, do not invent a price. State that "Detailed pricing and booking are available on our website's booking page" and direct them to the website.
4.  If a user asks about a service not listed (e.g., "Do you clean cars?"), politely state that it's not a service we currently offer and list the services we do provide.
5.  If you do not know the answer to a specific question, say "I don't have that information right now, but you can contact our support team directly at jamil.matheny@majestikmagik.com for more details."
6.  Do not answer questions that are not related to Jamil's Cleaning Services or the cleaning industry.
7.  If a user asks about the AI company or how this AI chatbot works, politely redirect them to the website or say "I am here to assist you with Jamil's Cleaning Services. How can I help you today?"
8.  Always end your responses with a friendly note, such as "Thank you for reaching out! If you have any more questions, feel free to ask." or "We're here to help
`;

const systemInstruction = {
    role: "model",
    parts: [{ text: companyKnowledge }],
};

// --- END OF NEW SECTION ---


interface HistoryItem {
    role: 'user' | 'model';
    content: string;
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemInstruction, // System instruction is added here
});

const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required.' });
        }

        const typedHistory: Content[] = (history || []).map((item: HistoryItem) => ({
            role: item.role,
            parts: [{ text: item.content }],
        }));

        const firstUserIndex = typedHistory.findIndex(item => item.role === 'user');

        const validHistory = firstUserIndex !== -1 ? typedHistory.slice(firstUserIndex) : [];

        const chat: ChatSession = model.startChat({
            generationConfig,
            safetySettings,
            history: validHistory,
        });

        const result = await chat.sendMessage(message);

        // --- CORRECTED LOGIC FLOW ---

        // 1. Get the response object first.
        const response = result.response;

        // 2. Check if the prompt was blocked for safety reasons.
        // This is the most common reason for an empty or problematic response.
        if (response.promptFeedback?.blockReason) {
            console.error('Request blocked by safety settings:', response.promptFeedback);
            return res.status(400).json({
                error: `Your prompt was blocked. Reason: ${response.promptFeedback.blockReason}`,
                details: response.promptFeedback.safetyRatings,
            });
        }

        // 3. Check if the model returned any candidates at all.
        if (!response.candidates || response.candidates.length === 0) {
            console.error('Gemini API returned no candidates:', response);
            return res.status(500).json({
                error: 'The AI model returned no response candidates.',
            });
        }

        // 4. Try to extract the text, catching potential errors.
        // This is a robust way to handle cases where the model finishes early (e.g., due to safety)
        // or returns a non-text response.
        let text: string;
        try {
            text = response.text();
        } catch (textExtractionError) {
            console.error('Error extracting text from Gemini response:', textExtractionError, 'Response parts:', response.candidates[0].content.parts);
            return res.status(500).json({
                error: 'Failed to extract text content from AI response.',
                details: `Finish reason: ${response.candidates[0].finishReason || 'N/A'}.`,
            });
        }

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error('Error in Gemini API call:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        res.status(500).json({ error: 'Failed to get response from AI.', details: errorMessage });
    }
}