import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../pages/context/AuthContext"; // Adjust path as needed
import Modal from "react-modal";
import { motion } from "framer-motion";


const Navbar = () => {
  const { firstName, lastName, setFirstName, setLastName } = useAuth(); // Access context
  const [menuOpen, setMenuOpen] = useState(false); // Track the menu open state
  const navbarRef = useRef<HTMLElement | null>(null); // Navigation element reference
  const [isModalOpen, setIsModalOpen] = useState(false); // the modal opening state

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFirstName = sessionStorage.getItem("first_name"); // Get first name from cookies
      if (storedFirstName) {
        setFirstName(storedFirstName); // Set first name in context from cookie if available
      }
    }
    if (typeof window !== "undefined") {
      const storedLastName = sessionStorage.getItem("last_name"); // Get first name from cookies
      if (storedLastName) {
        setLastName(storedLastName); // Set first name in context from cookie if available
      }
    }
  }, [setFirstName, setLastName]);

  const handleLogout = () => {
    sessionStorage.removeItem("token"); // Remove token cookie
    sessionStorage.removeItem("first_name"); // Remove first name cookie
    sessionStorage.removeItem("last_name"); // Remove last name cookie
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("phone");
    sessionStorage.removeItem("address");
    setFirstName(null); // Clear context
    setLastName(null);
    window.location.href = "/login"; // Redirect to login page after logout
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleConfirmLogout = () => {
    handleLogout();
    handleCloseModal();
  }

  const handleMenuToggle = () => {
    setMenuOpen((prevState) => !prevState); // Toggle menu state
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className="bg-gray-700 shadow border-white border text-white text-sm p-6 relative"
      ref={navbarRef}
    >
        {/* Desktop Menu size */}

      <div className="flex justify-between items-center">
        <div className="space-x-10 hidden md:flex">
          <Link href="/" className="hover:duration-600 hover:text-[#C5D89D] block">
            Home
          </Link>
          <Link href="/signup" className="hover:duration-600 hover:text-[#C5D89D] block">
            Sign Up
          </Link>
          <Link href="/login" className="hover:duration-600 hover:text-[#C5D89D] block">
            Login
          </Link>
          <Link href="/booking" className="hover:duration-600 hover:text-[#C5D89D] block">
            Book A Cleaning
          </Link>
          <Link href="/dashboard" className="hover:duration-600 hover:text-[#C5D89D] block">
            Dashboard
          </Link>
        </div>

        {/* Hamburger Menu */}

        <button
          aria-label="Open Menu"
          onClick={handleMenuToggle}
          className="md:hidden flex flex-col items-center justify-center space-y-1 w-8 h-8"
        >
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-500 transform ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-500 ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-500 transform ${
              menuOpen ? "-rotate-45 -translate-y-1" : ""
            }`}
          ></div>
        </button>

        {/* Logged in greeting & logout button */}

        <div className="text-sm font-semibold">
          {firstName && lastName ? (
            <>
              Hi, {firstName} {lastName.charAt(0)}.{" "}
              <button onClick={handleOpenModal} className="ml-4 hover:underline">
                Log Out
              </button>
            </>
          ) : (
            "Welcome, Guest"
          )}
        </div>
      </div>

      <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                style={{
                    overlay: { backgroundColor: "rgba(0, 0, 0, 0.6)" },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        padding: "30px",
                        borderRadius: "8px",
                    },
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-md font-semibold mb-4">Confirm Logout</h2>
                    <p className="mb-4">Are you sure you want to sign out?</p>
                    <div className="flex justify-end">
                        <button
                            onClick={handleCloseModal}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </motion.div>
            </Modal>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute left-0 top-16 w-full z-10 bg-[#8ab13c] p-10 space-y-4 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-all ease-in-out duration-900`}
      >
        <Link href="/" className="hover:duration-600 hover:text-[#C5D89D] block">
          Home
        </Link>
        <Link href="/signup" className="hover:duration-600 hover:text-[#C5D89D] block">
          Sign Up
        </Link>
        <Link href="/login" className="hover:duration-600 hover:text-[#C5D89D] block">
          Login
        </Link>
        <hr />
        <Link href="/booking" className="hover:duration-600 hover:text-[#C5D89D] block">
          Book A Cleaning
        </Link>
        <Link href="/dashboard" className="hover:duration-600 hover:text-[#C5D89D] block">
          Dashboard
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
