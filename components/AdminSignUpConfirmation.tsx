/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 12/02/2024

  /components/AdminSignUpConfirmation.tsx
*/

import Navbar from "./Navbar";
import Footer from "./Footer";
import Image from "next/image";
import Link from "next/link";
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
  }, [router]);

  return (
    <>
      <Navbar /> {/* Navbar component */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-10">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
          <Image
            src="/img/majestik_magik_cleaning_01.png"
            alt="Jamil's Cleaning Services"
            width={100}
            height={100}
            priority={true} // Load image immediately
            style={{ minWidth: "100px", maxWidth: "100px" }}
          />
          <p className="text-2xl font-bold font-montserrat text-gray-600 text-center mb-4">Jamil&apos;s Cleaning Services</p>
          <h1 className="text-2xl font-bold text-[#545454] mb-4">
            Welcome to Jamil&apos;s Cleaning Services Admin Dashboard!
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
        <Link href="/" className="text-[#8ab13c] underline hover:text-[#C5D89D]">
          Continue Exploring
        </Link>
      </div>
      <Footer /> {/* Footer component */}
    </>
  );
};

export default AdminSignUpConfirmation;
