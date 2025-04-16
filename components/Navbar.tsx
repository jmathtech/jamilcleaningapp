
// Modified by: Jamil Matheny, Majestik Magik LLC

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../pages/context/AuthContext";
import Modal from "react-modal";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Navbar = () => {
  const { firstName, lastName, setFirstName, setLastName } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add isLoggedIn state

  const router = useRouter();
  

  // -- START: Scroll Effect --
  const [isScrolled, setIsScrolled] = useState(false); // State to manage scroll position

  useEffect(() => {
    // Function to handle scroll event
    const handleScroll = () => {
      // Set isScrolled to true if the page is scrolled down more than 50px
      setIsScrolled(window.scrollY > 10);
    };

    // Add event listener for scroll event
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);

    };
  }, []); // Empty dependency array to run only on mount and unmount
  // -- END: Scroll Effect --

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFirstName = sessionStorage.getItem("first_name");
      if (storedFirstName) {
        setFirstName(storedFirstName);
      }
    }

    if (typeof window !== "undefined") {
      const storedLastName = sessionStorage.getItem("last_name");
      if (storedLastName) {
        setLastName(storedLastName);
      }
    }
  }, [setFirstName, setLastName]);

  // Check for token in sessionStorage after component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(sessionStorage.getItem("token") !== null);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("first_name");
    sessionStorage.removeItem("last_name");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("phone");
    sessionStorage.removeItem("address");
    setFirstName(null);
    setLastName(null);
    router.replace("/login");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    handleCloseModal();
  };

  const handleMenuToggle = () => {
    setMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
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
      className={`bg-[#333] shadow text-white text-md p-4 sticky top-0 z-20 transition-all duration-300 ease-in-out ${isScrolled ? 'py-2 px-4' : 'p-2' // Shrink padding when scrolled
        }`}
      ref={navbarRef}
    >
      <div className="flex justify-between items-center">
        <div className="space-x-14 hidden xl:flex">
          <Link href="/" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
            HOME
          </Link>
          <Link href="/pricing" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
            PRICING
          </Link>
          <Link href="/signup" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
            SIGN UP
          </Link>
          <Link href="/login" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
            LOG IN
          </Link>
          
          {isLoggedIn && (
            <>
              <Link href="/booking" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
                BOOK A CLEANING
              </Link>
              <Link href="/dashboard" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
                DASHBOARD
              </Link>
              <Link href="/profile" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
                PROFILE
              </Link>
              <Link href="/contact-support" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
                CONTACT SUPPORT
              </Link>
            </>
          )}
        </div>

        <button
          aria-label="Open Menu"
          onClick={handleMenuToggle}
          className="lg:hidden flex flex-col items-center justify-center space-y-1 w-8 h-8"
        >
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-500 transform ${menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-500 ${menuOpen ? "opacity-0" : ""
              }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-500 transform ${menuOpen ? "-rotate-45 -translate-y-1" : ""
              }`}
          ></div>
        </button>

        <div className="text-sm font-semibold">
          {firstName && lastName ? (
            <>
              Hi, {firstName} {lastName.charAt(0)}.{" "}
              <button onClick={handleOpenModal} className="ml-4 hover:underline">
                Log Out
              </button>
            </>
          ) : (
            <>
              Welcome, Guest
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "350px",
            padding: "20px",
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
              Log Out
            </button>
          </div>
        </motion.div>
      </Modal>

      <div
        className={`lg:hidden absolute left-0 top-full w-full z-10 bg-[#333] shadow p-10 space-y-12 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-all ease-in-out duration-500 `} 
      >
        <Link href="/" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
          HOME
        </Link>
        <Link href="/pricing" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
          PRICING
        </Link>
        <Link href="/signup" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
          SIGN UP
        </Link>
        <Link href="/login" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
          LOG IN
        </Link>
        
        {isLoggedIn && (
          <>
            <hr />
            <Link href="/booking" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
              BOOK A CLEANING
            </Link>
            <Link href="/dashboard" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
              DASHBOARD
            </Link>
            <Link href="/profile" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
              PROFILE
            </Link>
            <Link href="/contact-support" className={`px-4 py-2 rounded text-sm font-semibold hover:duration-500 hover:text-[#C5D89D] hover:bg-gray-400 block transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-md' : 'text-lg'}`}>
              CONTACT SUPPORT
            </Link>

          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


