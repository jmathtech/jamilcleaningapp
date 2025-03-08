/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 12/08/2024
*/

// pages/reset-password.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;  // Get the reset token from the query params
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or expired reset token.');
    }
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

   
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen bg-gray mt-[-100px]">
        <form onSubmit={handleResetPassword} className="bg-white p-10 rounded-lg shadow-xl w-96">
          <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
          {message && <p className="text-green-600 mb-4">{message}</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="new-password" className="block mb-2">New Password</label>
            <input
              type="password"
              id="new-password"
              className="w-full p-2 border border-gray-300 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              className="w-full p-2 border border-gray-300 rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Reset Password</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;
