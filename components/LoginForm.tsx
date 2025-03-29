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
        credentials: "include",
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

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen mt login-container">
        <form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-lg shadow border-[#8ab13c] border w-full max-w-lg"
          style={{ transform: "translateY(-60px)" }}
        >
          <div className="flex justify-center items-center p-10">
            <Image
              src="/img/majestik_magik_cleaning_01.png"
              alt="Majestik Magik Cleaning"
              width={250}
              height={150}
              priority={true}
              style={{
                minWidth: "150px",
                maxWidth: "250px",
              }}
            />
          </div>
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
        </form>
      </div>
      <Footer />
    </>
  );
};

export default LoginForm;
