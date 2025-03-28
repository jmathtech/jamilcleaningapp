import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

const VerificationSuccess = () => {
  const router = useRouter();

  useEffect(() => {
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

      try {
        sessionStorage.setItem('token', token);
        console.log('New token stored in sessionStorage:', token);


        // Extract the firstName and lastName from the token and store them in sessionStorage
        const decodedToken = jwt.decode(token);
        if (decodedToken && typeof decodedToken === 'object') {
          const { firstName, lastName } = decodedToken as { firstName: string; lastName: string };
          if (firstName) {
            sessionStorage.setItem('first_name', firstName);
          }
          if (lastName) {
            sessionStorage.setItem('last_name', lastName);
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
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <p>Verifying your account...</p>
        <div className="spinner items-center justify-center mt-4"></div>
      </div>
    </div>
  );
};

export default VerificationSuccess;
