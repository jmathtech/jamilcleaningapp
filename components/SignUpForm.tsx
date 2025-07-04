/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com  
  /components/SignUpForm.tsx
*/

'use client';

import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image"; // Import Image component
import Navbar from "./Navbar"; // Import Navbar component
import Footer from "./Footer"; // Import Footer component
import Link from "next/link"; // Import Link component for navigation

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (input.length <= 3) {
      input = input.replace(/(\d{3})(?=\d)/, "$1-");
    } else if (input.length <= 6) {
      input = input.replace(/(\d{3})(\d{3})(?=\d)/, "$1-$2-");
    } else {
      input = input.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
    setPhone(input);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      router.push("/signup-confirmation"); // Redirect after successful sign-up
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.error || "Error signing up, please try again");
    }
  };

  return (
    <>

      <Navbar /> {/* Navbar component */}
      <div className="flex justify-center items-center min-h-screen signup-container px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white mt-10 p-10 rounded-lg shadow border-[#8ab13c] border w-full max-w-lg"
        >
          <div className="flex justify-center items-center p-2">
            <Image
              src="/img/majestik_magik_cleaning_01.png"
              alt="Majestik Magik Cleaning"
              width={100}
              height={100}
              priority={true} // Load image immediately
              style={{ minWidth: "100px", maxWidth: "100px" }}
            />
          </div>
          <p className="text-2xl font-bold font-montserrat text-gray-600 text-center mb-4">Jamil&apos;s Cleaning Services</p>

          <h2 className="text-2xl text-[#545454] font-semibold mb-4">Sign Up</h2>

          <div className="mb-4">
            <input
              id="firstName"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              id="lastName"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              id="email"
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              id="tel"
              type="phone"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Phone: (xxx) xxx-xxxx"
              value={phone}
              onChange={handlePhoneChange}
              required
            />
          </div>

          <div className="mb-4">
            <input
              id="address"
              type="address"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}
          <div className="flex flex-row justify-center items-center mt-6 gap-4">
            <button
              type="submit"
              className="bg-[#8ab13c] transition-opacity duration-1000 text-md hover:opacity-80 hover:bg-[#9bbe56] text-white font-bold py-2 px-8 rounded"
            >
              Sign Up
            </button>
            <Link
              href="/login"
              className="text-[#8ab13c] font-bold hover:text-[#C5D89D]"
            >
              <button className="bg-[#8ab13c] transition-opacity duration-1000 text-md hover:opacity-80 hover:bg-[#9bbe56] text-white font-bold py-2 px-10 rounded" style={{ width: "auto", height: "auto" }}>
                Log In
              </button>
            </Link>
          </div>
        </form>
      </div>
      <Footer /> {/* Footer component */}
    </>
  );
};

export default SignUp;
