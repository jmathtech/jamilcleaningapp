/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 12/02/2024

  /components/AdminSignUpConfirmation.tsx
*/

import Navbar from "./Navbar";
import Footer from "./Footer";
import { useRouter } from "next/router";
import { useEffect } from "react";

const AdminSignUpConfirmation = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/admin/login");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/admin/login");
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar /> {/* Navbar component */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-10">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
          <img
            src="/img/majestik_magik_cleaning_01.png"
            alt="Majestik Magik Cleaning"
            style={{ width: "80%", height: "auto" }}
          />
          <h1 className="text-2xl font-bold text-[#545454] mb-4">
            Welcome to Majestik Magik Cleaning Admin Dashboard!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for signing up as an admin! Your account has been created successfully. You can now log in to explore your admin dashboard.
          </p>
          <button
            onClick={handleLoginRedirect}
            className="px-8 py-3 bg-[#8ab13c] text-white rounded-lg hover:bg-[#C5D89D] focus:outline-none focus:ring-2 focus:ring-[#8ab13c] focus:ring-offset-2"
          >
            Go to Login
          </button>
        </div>
        <a href="/" className="text-[#8ab13c] underline hover:text-[#C5D89D]">
          Continue Exploring
        </a>
      </div>
      <Footer /> {/* Footer component */}
    </>
  );
};

export default AdminSignUpConfirmation;
