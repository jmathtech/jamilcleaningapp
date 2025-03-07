/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 12/02/2024

  /components/PrivacyPolicy.tsx
*/

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  const [userFeedback, setUserFeedback] = useState<string>(''); // Example state
  const router = useRouter();

  const handleFeedbackSubmit = () => {
    // Placeholder for a feature using state and router
    alert(`Feedback submitted: ${userFeedback}`);
    router.push('/thank-you'); // Example of redirecting to another page
  };

  return (
    <>
      <Navbar />
      <div className=" container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">
          Welcome to Jamil Privacy Policy page! Your privacy is critically important to us, and this policy outlines the types of personal information we collect, how we use it, and the measures we take to protect your data.
        </p>

        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          We may collect the following information when you use our services:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Personal Information: First name, email address, phone number, and address.</li>
          <li>Booking Information: Service preferences, dates, and additional notes provided during the booking process.</li>
          <li>Technical Data: IP address, browser type, and operating system.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">
          The information we collect is used for the following purposes:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>To provide and manage our services, including processing bookings and payments.</li>
          <li>To improve your user experience by customizing our offerings.</li>
          <li>To communicate with you regarding your account or bookings.</li>
          <li>To comply with legal obligations and protect against fraud or misuse of our services.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">3. Sharing of Information</h2>
        <p className="mb-4">
          We do not sell, trade, or rent your personal information to third parties. However, we may share your data with:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Service providers who help us deliver our services, such as payment processors or hosting platforms.</li>
          <li>Law enforcement or government agencies when required by law.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
        <p className="mb-4">
          We take reasonable precautions to protect your information from unauthorized access, alteration, or destruction. However, no method of transmission over the Internet is completely secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
        <p className="mb-4">
          You have the right to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Access, update, or delete your personal information by contacting us directly.</li>
          <li>Opt-out of receiving promotional communications by using the unsubscribe link provided in emails.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
        <p className="mb-4">
          We use cookies to enhance your browsing experience. These small data files are stored on your device to improve functionality and analyze usage patterns. You can control or disable cookies through your browser settings.
        </p>

        <h2 className="text-2xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We encourage you to review this page periodically for the latest information.
        </p>

        <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at:
        </p>
        <p className="font-semibold">Email: jamil.matheny@majestikmagik.com</p>
        <p className="font-semibold">Phone: (804) 362-7561</p>

        <h2 className="text-2xl font-semibold mt-8">Submit Your Feedback</h2>
        <textarea
          className="w-full border rounded-md p-2 mt-4"
          placeholder="Leave your feedback here..."
          value={userFeedback}
          onChange={(e) => setUserFeedback(e.target.value)}
        />
        <button
          className="mt-4 bg-[#8ab13c] text-white px-4 py-2 rounded-md hover:bg-[#C5D89D]"
          onClick={handleFeedbackSubmit}
        >
          Submit Feedback
        </button>
      </div>
    </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
