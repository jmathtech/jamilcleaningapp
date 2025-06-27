/* Created by Jamil Matheny, Majestik Magik
  Website: cleaning.majestikmagik.com

  This page now features a Gemini-powered chatbot for instant user support.
*/

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import authGuard from '../utils/authGuard';

// Define the structure of a chat message
interface Message {
  role: 'user' | 'model';
  content: string;
}

const ContactSupport = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);
  
  // Set initial welcome message from the bot
  useEffect(() => {
    setMessages([
      {
        role: 'model',
        content: "Hello! I'm your virtual assistant powered by MajestikMagik.com for Jamil's Cleaning Services. How can I help you with our cleaning services today?"
      }
    ]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Send message history to the backend API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          // We only send the last few messages to keep the context relevant and payload small
          history: messages.slice(-6) 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get a response from the server.');
      }

      const data = await response.json();
      const botMessage: Message = { role: 'model', content: data.reply };
      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      console.error('Chat API error:', err);
      setError('Sorry, I seem to be having trouble connecting. Please try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="w-full max-w-2xl h-[70vh] flex flex-col bg-white p-4 rounded-lg shadow-xl border-[#8ab13c] border">
          <h1 className="text-xl text-gray-700 font-bold mb-4 text-center border-b pb-3">
            Support AI Chat
          </h1>
          
          {/* Chat Messages Area */}
          <div ref={chatContainerRef} className="flex-grow overflow-y-auto mb-4 p-2 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${
                  msg.role === 'user' 
                    ? 'bg-[#8ab13c] text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-xl rounded-bl-none px-4 py-2">
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex items-center border-t pt-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#8ab13c]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="ml-3 bg-[#8ab13c] text-white px-5 py-2 rounded-full shadow hover:bg-[#b7d190] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8ab13c] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default authGuard(ContactSupport);