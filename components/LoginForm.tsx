'use client';

import { FormEvent, useState } from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import Footer from "./Footer";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error message 
    setLoginSuccess(false);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginSuccess(true);
        setEmail("");
      } else {
        setError(data.message || "Failed to send login link.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Get the Google Client ID from environment variable
    const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    console.log("Google Client ID:", CLIENT_ID);

    // Set the redirect URI based on environment
    const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL;
    console.log("Google Redirect URI:", REDIRECT_URI);

    if (!CLIENT_ID || !REDIRECT_URI) {
      console.error("Google Client ID or Redirect URI is not set.");
      return;
    }

    const encodedRedirectURI = encodeURIComponent(REDIRECT_URI);

    // Construct the Google OAuth URL WITHOUT encoding the redirect URI
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodedRedirectURI}&response_type=code&scope=email profile&access_type=offline`;
    console.log("Google Auth URL:", authUrl);
    // Redirect to Google's authentication page
    window.location.href = authUrl;
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen login-container px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white mt-10 p-10 rounded-lg shadow border-[#8ab13c] border w-full max-w-lg"
          style={{ transform: "translateY(-60px)" }}
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
          <p className="text-4xl font-bold font-montserrat text-gray-600 text-center">Majestik Magik</p>
          <p className="text-xl font-semibold font-montserrat text-[#8ab13c] pb-4 text-center">CLEANING</p>

          <h2 className="text-2xl text-[#545454] font-semibold mb-4">Log In</h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {loginSuccess && (
            <p className="m-4 text-[#8ab13c]">
              Login link sent successfully. Please check your email.
            </p>
          )}
          <div className="mb-4">
            <input
              type="email"
              id="email"
              aria-label="Email"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Email"
              value={email}
              onChange={handleInputChange}
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

          {/* Divider with "or" text */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <div className="px-4 text-gray-500 text-sm">or</div>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          {/* Google Login Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Continue with Google
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default LoginForm;
