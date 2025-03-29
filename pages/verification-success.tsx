// pages/verification-success.tsx
/* 
  Verification Success Page
  This page is displayed after a user has successfully verified their account.
  It displays a message to the user and redirects them to the login page after a delay.
  The delay is to ensure that the user has time to read the message before being redirected.
  The user's token is stored in sessionStorage and is used to authenticate the user for future requests.
  
*/


import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

const VerificationSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    // Check to see if the router is ready before accessing query
    if (!router.isReady) {
      return; // Exit early if the router is not ready
    }

    const handleVerification = async () => {
      const { token } = router.query;

      if (typeof token !== 'string') {
        console.error('Invalid token received:', token);
        // Check if the user is already on the login page
        if (router.pathname !== "/login") {
          router.replace('/login');
        }
        return;
      }

      console.log('Token from query:', token); // Debugging log: Checking the token

      try {
        sessionStorage.setItem('token', token);
        console.log('New token stored in sessionStorage:', token);


        // Extract the firstName, lastName, email, phone, and address from the token and store them in sessionStorage
        const decodedToken = jwt.decode(token);
        if (decodedToken && typeof decodedToken === 'object') {
          const { firstName, lastName, email, phone, address } = decodedToken as { firstName: string; lastName: string, email: string, phone: string, address: string };
          if (firstName) {
            sessionStorage.setItem('first_name', firstName);
          }
          if (lastName) {
            sessionStorage.setItem('last_name', lastName);
          }
          if (email) {
            sessionStorage.setItem('email', email);
          }
          if (phone) {
            sessionStorage.setItem('phone', phone);
          }
          if (address) {
            sessionStorage.setItem('address', address);
          }

        }
        router.replace('/dashboard');
      } catch (error) {
        console.error('Error during token verification:', error);
        // Check if the user is already on the login page
        if (router.pathname !== "/login") {
          router.replace('/login');
        }
      }
    };

    handleVerification();
  }, [router.isReady, router]); // Pass router.isReady as a dependency array

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center items-center justify-center">
         <p><div className="spinner"></div> Verifying your account...</p>
        
      </div>
    </div>
  );
};

export default VerificationSuccess;
