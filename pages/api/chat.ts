import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, ChatSession, Content } from '@google/generative-ai';

// Ensure the API key is available
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  // This will crash the server on startup if the key is missing, which is good for debugging.
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

interface HistoryItem {
    role: 'user' | 'model';
    content: string;
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash', // Using the standard model name for better stability
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

    const chat: ChatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: typedHistory,
    });

    const result = await chat.sendMessage(message);

    // --- START OF FIX ---
    // Add a robust check for the response object
    if (!result.response) {
        throw new Error('Received an empty response from the Gemini API.');
    }
    
    const response = result.response;
    
    if (response.promptFeedback?.blockReason) {
      console.error('Request blocked by safety settings:', response.promptFeedback);
      return res.status(400).json({ 
        error: `Your request was blocked. Reason: ${response.promptFeedback.blockReason}`,
        details: response.promptFeedback?.safetyRatings, 
      });
    }

    const text = response.text();
    // --- END OF FIX ---

    res.status(200).json({ reply: text });

  } catch (error) {
    // This log is crucial and will appear in your terminal, not the browser.
    console.error('Error in Gemini API call:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    res.status(500).json({ error: 'Failed to get response from AI.', details: errorMessage });
  }
}