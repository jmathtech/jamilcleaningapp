/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 12/02/2024

  /components/AdminLogin.tsx
*/

'use client';

import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "./AdminNavbar"; // Import Navbar component
import Footer from "./Footer"; // Import Footer component
import Image from "next/image";
import { useAuth } from "../pages/context/AuthContext"; // Adjust path if needed


const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setFirstName, setLastName, setToken } =
    useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch("/api/login-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
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
            <Image
              src="/img/majestik_magik_cleaning_01.png"
              alt="Majestik Magik Cleaning"
              width={100}
              height={100}
              priority={true} // Load image immediately
              style={{ minWidth: "100px", maxWidth: "100px" }}
            />
            <p className="text-4xl font-bold font-montserrat text-gray-600 text-center">Majestik Magik</p>
            <p className="text-xl font-semibold font-montserrat text-[#8ab13c] pb-4 text-center">CLEANING</p>
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
          <div className="flex justify-center">
            <button
              type="submit"
              aria-label="Submit"
              className={`px-10 py-2 ${isLoading
                ? "bg-gray-400 cursor-not-allowed flex items-center justify-center gap-2"
                : "bg-[#8ab13c] hover:bg-[#C5D89D]"
                } text-white text-lg font-bold rounded-lg transition-colors duration-1000 ease-in-out`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  Logging In...
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </form>
      </div>
      <Footer /> {/* Footer component */}
    </>
  );
};

export default AdminLogin;
