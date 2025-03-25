import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Image from "next/image";
import { useAuth } from "../pages/context/AuthContext"; // Adjust path if needed


const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setFirstName, setLastName, setPhone, setAddress, setToken } =
    useAuth();

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "email") setEmail(value);
  };

  // Handle login function
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(""); // Reset error message

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Includes cookies in the request
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Login successful:", data);

        // Set session data (token and first_name)
        if (setToken) setToken(data.token);
        if (setFirstName) setFirstName(data.first_name);
        if (setLastName) setLastName(data.last_name);
        if (setEmail) setEmail(data.email);
        if (setPhone) setPhone(data.phone);
        if (setAddress) setAddress(data.address);

        // Clear old cookies before setting new ones
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("first_name");
        sessionStorage.removeItem("last_name");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("phone");
        sessionStorage.removeItem("address");

        // Set new cookies for session persistence
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("first_name", data.first_name);
        sessionStorage.setItem("last_name", data.last_name);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("phone", data.phone);
        sessionStorage.setItem("address", data.address);

        // Redirect to the dashboard after successful login
        await router.replace("/dashboard");
      } else {
        const errorData = await res.json();
        console.error("Login failed:", errorData);
        setError(
          errorData.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.error("Error during login request:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false); // Stop loading state
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
            <Image // Image component from next/image
              src="/img/majestik_magik_cleaning_01.png"
              alt="Majestik Magik Cleaning"
              width={250}
              height={150}
              priority={true} // Load image immediately
              style={{ width: "auto", height: "auto", minWidth: "150px", maxWidth: "250px" }}
            />
          </div>
          <h2 className="text-2xl text-[#545454] font-semibold mb-4">Log In</h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
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
                  ? "bg-gray-400 cursor-not-allowed flex items-center justify-center gap-2" // Added flex classes
                  : "bg-[#8ab13c] hover:bg-[#C5D89D]"
                } text-white text-lg font-bold rounded-lg transition-colors duration-1000 ease-in-out`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  Logging In...
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>{" "}
                  {/* Spinner */}
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
