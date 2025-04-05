// pages/contact-support.tsx
/* 
  Created by Jamil Matheny, Majestik Magik
  Website: cleaning.majestikmagik.com

  It is called when the user clicks the contact support button on the navbar.
  It is called from the client side.
*/

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import authGuard from '../utils/authGuard';

const ContactSupport = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null); // Reset submission status

    try {

      // Send message to API
      const response = await fetch('/api/contact-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
      // Handle response
      if (response.ok) {
        setSubmissionStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      
      // Handle errors
      console.error('Error sending message:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray">
      <Navbar />
      <div className="flex container justify-center items-center mx-auto px-4">
        <div className="bg-white p-6 rounded shadow border-[#8ab13c] border max-w-5xl mx-auto">
          <h1 className="text-2xl text-gray-600 font-bold mb-6 mt-10">Contact Support</h1>
          <h3 className="text-lg text-gray-600 font-semibold mb-4">We are here to help!</h3>
          <p className="text-sm text-gray-500 mb-6">
            If you have any questions or need assistance, please fill out the form below, and we’ll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required  
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                rows={4 as number}
                className="w-full px-3 py-2 rounded shadow"
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-[#8ab13c] text-white px-4 py-2 rounded shadow hover:bg-[#b7d190] focus:outline-none focus:ring ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            {submissionStatus === 'success' && (
              <p className="text-green-500 mt-4">Your message is sent successfully!</p>
            )}
            {submissionStatus === 'error' && (
              <p className="text-red-500 mt-4">Error sending message. Please try again later.</p>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default authGuard(ContactSupport);
