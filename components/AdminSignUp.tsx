/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: majesty.com
  Updated: 12/02/2024
  
  /components/AdminSignUp.tsx
*/

"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Navbar from "./AdminNavbar"; // Import Navbar component
import Footer from "./Footer"; // Import Footer component

const AdminSignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("manager");
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

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const response = await fetch("/api/signup-admin", {
      method: "POST",
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
        role,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      router.push("/admin/confirmation"); // Redirect to login page after successful sign-up
    } else {
      console.error("Error signing up");
      setErrorMessage("Error signing up, please try again");
    }
  };

  return (
    <>
      <Navbar /> {/* Navbar component */}
      <div className="bg-gray-800 flex justify-center items-center min-h-screen mt">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-lg shadow-xl w-full max-w-lg"
        >
          <div className="flex justify-center items-center p-10">
            <Image // Image component from next/image
              src="/img/majestik_magik_cleaning_01.png"
              alt="Majestik Magik Cleaning"
              width={200}
              height={100}
              priority={true} // Load image immediately
              style={{ width: "auto", height: "auto", minWidth: "100px", maxWidth: "200px" }}
            />
          </div>

          <h2 className="text-2xl text-[#545454] font-bold mb-4">Admin Sign Up</h2>

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
              id="password"
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              id="confirmPassword"
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <select
              id="role"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="superadmin">Super Admin</option>
              <option value="manager">Manager</option>
              <option value="support">Support</option>
            </select>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-10 py-2 bg-[#8ab13c] text-white rounded-lg hover:bg-[#C5D89D] transition-colors duration-1000 ease-in-out`"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      <Footer /> {/* Footer component */}
    </>
  );
};

export default AdminSignUp;
