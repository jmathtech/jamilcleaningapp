import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, ChatSession, Content } from '@google/generative-ai';
              
// Ensure the API key is available
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

interface HistoryItem {
    role: 'user' | 'model';
    content: string;
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest', // Use a modern, fast model
});

// Configuration for content safety
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

    // Validate history format
    const typedHistory: Content[] = (history || []).map((item: HistoryItem) => ({
        role: item.role,
        parts: [{ text: item.content }],
    }));

    // Start a chat session with the provided history
    const chat: ChatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: typedHistory,
      
    });

    const result = await chat.sendMessage(message);
    const response = result.response;

    if (response.promptFeedback?.blockReason) {
      return res.status(400).json({ 
        error: `Request was blocked. Reason ${response.promptFeedback.blockReason}`,
        details: response.promptFeedback?.safetyRatings, });
    }

    const text = response.text();

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error('Error in Gemini API call:', error);
    res.status(500).json({ error: 'Failed to get response from AI.' });
  }
}