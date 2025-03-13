/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 03/12/2024
*/

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar'; // Import Navbar
import Footer from '../components/Footer'; // Import Footer

const PaymentComplete = () => {
  const router = useRouter();

  // Automatically redirect to the homepage after 5 seconds
  useEffect(() => {
    setTimeout(() => {
      router.push('/dashboard'); // Redirect to the homepage
    }, 5000); // Wait for 5 seconds before redirect
  }, [router]);

  return (
    <div className="bg-gray min-h-screen">
      <Navbar /> {/* Add the Navbar */}

      <div className="flex justify-center items-center min-h-screen bg-gray">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-3xl font-semibold text-[#8ab13c] mb-4">Thank you for your payment!</h2>
          <p className="text-lg text-gray-700 mb-4">
            Your payment has been successfully processed. We appreciate your business! You will now be directed to your account dashboard.
          </p>

          {/* Additional content */}
          <div className="mt-4">
            <button
              onClick={() => router.push('/')}
              className="bg-[#8ab13c] text-white px-6 py-3 rounded-md hover:bg-[#b7d190] transition"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>

      <Footer /> {/* Add the Footer */}
    </div>
  );
};

export default PaymentComplete;
