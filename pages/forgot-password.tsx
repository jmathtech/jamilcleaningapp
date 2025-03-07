// pages/forgot-password.tsx

import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/forgot-password', { email });
      if (response.status === 200) {
        setMessage('A password reset link has been sent to your email.');
        setError('');
      }
    } catch (err: any) {
      setError(err.response.data.message || 'Something went wrong.');
      setMessage('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen bg-gray">
        <form onSubmit={handleForgotPassword} className="bg-white p-10 rounded-lg shadow-xl w-96">
          <h2 className="text-2xl text-[#545454] font-semibold mb-4">Forgot Password</h2>
          {message && <p className="text-green-600 mb-4">{message}</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Enter your email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-[#8ab13c] text-white p-2 rounded hover:bg-[#C5D89D]">Send Reset Link</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
