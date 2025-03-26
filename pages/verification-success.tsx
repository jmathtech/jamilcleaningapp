// pages/verification-success.tsx
/* Created by Jamil Matheny, Majestik Magik

This page is used to verify the user's email address.
It is called when the user clicks the link in the email.
It is called from the server side.
It is called with the token in the query string.

*/

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const VerificationSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    const handleVerification = async () => {
      const { token } = router.query;

      if (typeof token !== 'string') {
        console.error('Invalid token received:', token);
        router.replace('/login');
        return;
      }

      try {
        const response = await fetch(`/api/verify?token=${token}`);
        const data = await response.json();

        if (response.ok && data.success && data.token) {
          sessionStorage.setItem('token', data.token);
          console.log('New token stored in sessionStorage:', data.token);
          router.replace('/dashboard');
        } else {
          console.error('Token verification failed:', data.message || 'Unknown error');
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error during token verification:', error);
        router.replace('/login');
      }
    };

    handleVerification();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <p>Verifying your account...</p>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default VerificationSuccess;
