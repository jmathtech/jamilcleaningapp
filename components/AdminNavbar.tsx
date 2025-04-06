// components/AdminNavbar.tsx
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../pages/context/AuthContext";
import Modal from "react-modal";
import { motion } from "framer-motion";



const AdminNavbar = () => {
  const { firstName, lastName, setFirstName, setLastName } = useAuth(); // Access context
  const navbarRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use useEffect to access sessionStorage only after the component is mounted
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
  }, [setFirstName, setLastName]); // Empty dependency array means this will only run on mount

  const handleLogout = () => {
    sessionStorage.removeItem("token"); // Remove token cookie
    sessionStorage.removeItem("first_name"); // Remove first name cookie
    sessionStorage.removeItem("last_name"); // Remove last name cookie
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("phone");
    sessionStorage.removeItem("address");
    setFirstName(null); // Clear context
    setLastName(null);
    window.location.href = "/admin/login"; // Redirect to login page after logout
  };
  // Open the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);

  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  // Confirm logout and close modal
  const handleConfirmLogout = () => {
    handleLogout();
    handleCloseModal();
  }

  // Toggle the menu open state
  const handleMenuToggle = () => {
    setMenuOpen((prevState) => !prevState); // Toggle menu state
  };

  // Close the menu when clicking outside
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
      className="bg-[#333] shadow text-white text-md p-6 relative"
      ref={navbarRef}
    >

      {/* Navigation Links - Desktop */}
      <div className="flex justify-between items-center">
        <div className="space-x-14 hidden md:flex">
          <Link href="/" className="hover:duration-500 text-sm font-semibold hover:text-[#C5D89D] block">
            HOME
          </Link>
          <Link href="/admin/dashboard" className="hover:duration-500 text-sm font-semibold hover:text-[#C5D89D] block">
            ADMIN DASHBOARD
          </Link>
          <Link href="/signup" className="hover:duration-500 text-sm font-semibold hover:text-[#C5D89D] block">
            SIGN UP
          </Link>
          <Link href="/login" className="hover:duration-500 text-sm font-semibold hover:text-[#C5D89D] block">
            LOG IN
          </Link>
        </div>

        <button
          onClick={handleMenuToggle}
          className="md:hidden flex flex-col items-center justify-center space-y-1 w-8 h-8"
        >
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-300 transform ${menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""
              }`}
          ></div>
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-300 transform ${menuOpen ? "-rotate-45 -translate-y-1" : ""
              }`}
          ></div>
        </button>

        <div className="text-sm font-semibold">
          {firstName && lastName ? (
            <>
              Welcome, {firstName} {lastName.charAt(0)}.{" "}
              <button onClick={handleOpenModal} className="ml-4 hover:underline">Log Out</button>
            </>
          ) : (
            'Welcome, Admin'
          )}
        </div>
      </div>

      {/* Logout Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
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
        {/* Logout Modal Content */}
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
        className={`md:hidden absolute left-0 top-20 w-full z-10 bg-gray-600 shadow border-gray-300 border p-10 space-y-12 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-all ease-in-out duration-500`}
      >
        <Link href="/" className="hover:duration-500 text-sm font-semibold hover:text-[#C5D89D] block">
          HOME
        </Link>
        <Link href="/admin/dashboard" className="hover:duration-500 text-sm font-semibold hover:text-[#C5D89D] block">
          ADMIN DASHBOARD
        </Link>
        <Link href="/signup" className="hover:duration-500 text-sm font-semibold hover:text-[#C5D89D] block">
          SIGN UP
        </Link>
        <Link href="/login" className="hover:duration-500 text-sm font-semibold hover:text-[#C5D89D] block">
          LOG IN
        </Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;
