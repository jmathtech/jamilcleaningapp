/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 12/02/2024

  /components/AdminLogin.tsx
*/

"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "./AdminNavbar"; // Import Navbar component
import Footer from "./Footer"; // Import Footer component
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../pages/context/AuthContext"; // Adjust path if needed


const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setFirstName, setLastName, setToken } =
    useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/login-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {

      if (setToken) setToken(data.token);
      if (setFirstName) setFirstName(data.first_name);
      if (setLastName) setLastName(data.last_name);

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("first_name");
      sessionStorage.removeItem("last_name");

      // Save token and user info in sessionStorage
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("first_name", data.first_name);
      sessionStorage.setItem("last_name", data.last_name);
      sessionStorage.setItem("role", data.role);

      console.log("Redirecting to /admin/dashboard...");
      router.push("/admin/dashboard").catch((err) => {
        console.error("Router push error:", err);
      });
    } else {
      setError(data.message);
      console.error("Login failed:", data.message);
    }
  };


  return (
    <>
      <Navbar /> {/* Navbar component */}
      <div className="bg-gray-800 flex justify-center items-center min-h-screen mt">
        <form
          onSubmit={handleLogin}
          className="bg-white p-4 pt-10 rounded-lg shadow border-[#8ab13c] border w-full max-w-lg"
          style={{ transform: "translateY(-60px)" }}
        >
          <div className="flex justify-center items-center p-10">
            <Image // Image component from next/image
              src="/img/majestik_magik_cleaning_01.png"
              alt="Majestik Magik Cleaning"
              width={250}
              height={150}
              priority={true} // Load image immediately
              style={{ minWidth: "150px", maxWidth: "250px" }}
            />
          </div>
          <h2 className="text-2xl text-[#545454] font-semibold mb-4">
            Admin Login
          </h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <div className="mb-4">
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-10 py-2 bg-[#8ab13c] text-white rounded-lg hover:bg-[#C5D89D] transition-colors duration-1000 ease-in-out`"
            >
              Login
            </button>
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-yellow-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
      <Footer /> {/* Footer component */}
    </>
  );
};

export default AdminLogin;
