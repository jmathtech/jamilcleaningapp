// components/AdminNavbar.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const AdminNavbar = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Use useEffect to access localStorage only after the component is mounted
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFirstName = localStorage.getItem("admin_name");
      console.log("Store First Name: ", storedFirstName);
      setFirstName(storedFirstName);
    }
  }, []); // Empty dependency array means this will only run on mount

  const handleLogout = () => {
    // Clear the token and first name from localStorage
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    router.push("/admin/login"); // Redirect to login page after logout
  };

  const handleMenuToggle = () => {
    setMenuOpen((prevState) => !prevState); // Toggle menu state
  };

  return (
    <nav className="bg-[#8ab13c] text-white text-sm p-4">
      <div className="flex justify-between items-center">
        <div className="space-x-6 hidden md:flex">
          <Link href="/" className="hover:text-[#C5D89D] block">
            Home
          </Link>
          <Link href="/admin/dashboard" className="hover:text-[#C5D89D] block">
            Admin Dashboard
          </Link>
          <Link href="/admin/signup" className="hover:text-[#C5D89D] block">
            Sign Up
          </Link>
          <Link href="/admin/login" className="hover:text-[#C5D89D] block">
            Login
          </Link>
        </div>

        <button
          onClick={handleMenuToggle}
          className="md:hidden flex flex-col items-center justify-center space-y-1 w-8 h-8"
        >
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-300 transform ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-300 transform ${
              menuOpen ? "-rotate-45 -translate-y-1" : ""
            }`}
          ></div>
        </button>

        <div className="text-sm font-semibold">
        {firstName ? (
            <>
              Welcome, {firstName} <button onClick={handleLogout} className="ml-4 hover:underline">Sign Out</button>
            </>
          ) : (
            'Welcome, Guest'
          )}
        </div>
      </div>

      <div
        className={`md:hidden ${
          menuOpen ? "block" : "hidden"
        } absolute left-0 top-16 w-full bg-[#8ab13c] p-4 space-y-4`}
      >
        <Link href="/" className="hover:text-[#C5D89D] block">
          Home
        </Link>
        <Link href="/admin/dashboard" className="hover:text-[#C5D89D] block">
          Admin Dashboard
        </Link>
        <Link href="/admin/signup" className="hover:text-[#C5D89D] block">
          Sign Up
        </Link>
        <Link href="/admin/login" className="hover:text-[#C5D89D] block">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;
