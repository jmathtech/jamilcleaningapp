/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 12/02/2024

  /components/TermsOfService.tsx
*/

"use Client";

import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';  // Import Navbar component
import Footer from '../components/Footer';  // Import Footer component

const TermsOfService = () => {
  const router = useRouter();
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = () => {
    setIsAccepted(true);
    localStorage.setItem('terms_accepted', 'true');
    router.push('/'); // Redirect to home or dashboard after accepting terms
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="py-12 px-6">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-semibold mb-6">Terms of Service</h1>

          <p className="text-lg mb-4">
            Welcome to Jamil&apos;s Cleaning Services website! These Terms of Service (&quot;Terms&quot;) govern your access to and use of our services, including
            our website and mobile applications. Please read these Terms carefully before using our services.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By using our services, you agree to these Terms of Service. If you do not agree to these Terms, you are prohibited from using our services.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">2. User Responsibilities</h2>
          <p className="mb-4">
            You are responsible for all activities that occur under your account. You agree to use our services only for lawful purposes and in accordance with applicable laws.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">3. Account Registration</h2>
          <p className="mb-4">
            To access certain features of our website, you may be required to register an account. You agree to provide accurate, current, and complete information during registration and update your account information to maintain its accuracy.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">4. Payment and Billing</h2>
          <p className="mb-4">
            Payments for services may be required. You agree to provide accurate billing information and authorize us to process payments in accordance with our payment terms. Payment information will be securely processed.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">5. Termination</h2>
          <p className="mb-4">
            We reserve the right to suspend or terminate your account at our discretion, without prior notice, if you violate these Terms or for any other reason deemed necessary by us.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">6. Limitation of Liability</h2>
          <p className="mb-4">
            To the fullest extent permitted by law, we are not liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">7. Changes to Terms</h2>
          <p className="mb-4">
            We may update or change these Terms of Service from time to time. You will be notified of any material changes to these Terms, and the updated version will be posted on this page.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">8. Contact Information</h2>
          <p className="mb-4">
            If you have any questions or concerns regarding these Terms of Service, please contact us at jamil.matheny@majestikmagik.com.
          </p>

          {/* Accept Terms Button */}
          <div className="mt-8">
            {!isAccepted ? (
              <button
                onClick={handleAccept}
                className="bg-[#8ab13c] text-white px-6 py-3 rounded-lg hover:bg-[#C5D89D] transition"
              >
                I Accept the Terms
              </button>
            ) : (
              <p className="text-green-600 mt-4">You have accepted the Terms of Service!</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsOfService;
