import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from '../pages/context/AuthContext'; // Adjust path as needed
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import authGuard from "@/utils/authGuard";

const Profile = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const { firstName, lastName, email, phone, address, setFirstName, setLastName, setEmail, setPhone, setAddress } = useAuth(); // Access context

  const [editing, setEditing] = useState(false);
  const router = useRouter();

  // Utility function to fetch the token from sessionStorage
  const getToken = () => sessionStorage.getItem("token") || "";

  // Fetch user profile data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFirstName = sessionStorage.getItem('first_name'); // Get first name from sessionStorage
      if (storedFirstName) {
        setFirstName(storedFirstName); // Set first name in context from sessionStorage if available
      }
    }
    if (typeof window !== 'undefined') {
      const storedLastName = sessionStorage.getItem('last_name'); // Get last name from sessionStorage
      if (storedLastName) {
        setLastName(storedLastName); // Set last name in context from sessionStorage if available
      }
    }
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('email'); // Get email from sessionStorage
      if (storedEmail) {
        setEmail(storedEmail); // Set email in context from sessionStorage if available
      }
    }
    if (typeof window !== 'undefined') {
      const storedPhone = sessionStorage.getItem('phone'); // Get phone from sessionStorage
      if (storedPhone) {
        setPhone(storedPhone); // Set phone in context from sessionStorage if available
      }
    }
    if (typeof window !== 'undefined') {
      const storedAddress = sessionStorage.getItem('address'); // Get address from sessionStorage
      if (storedAddress) {
        setAddress(storedAddress); // Set address in context from sessionStorage if available
      }
    }
  }, [setFirstName, setLastName, setEmail, setPhone, setAddress]);

  const handleGoBack = () => {
    router.back();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = getToken(); // Assuming you have a getToken function to retrieve the token

      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          // Handle unauthorized access
          console.error("Unauthorized access");
        } else if (response.status === 403) {
          // Handle forbidden access
          console.error("Forbidden access");
        } else {
          console.error(`Failed to update user data. Status: ${response.status}`);
        }
        return; // Exit the function if the request was not successful
      }

      console.log("User data updated successfully.");
      // Optionally, refresh the user data after successful update
      // setUser(await getUserData()); // Assuming you have a getUserData function

    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setEditing(false);
    }
  };

  return (
    <div className="bg-gray min-h-screen">
      <Navbar />

      <main className="container min-h-screen text-md mx-auto px-4 py-6">
        <div className="bg-white p-8 rounded shadow border-[#8ab13c] border my-6">
          <h2 className="text-lg text-gray-600 font-bold mt-8">Profile Details</h2>
          <div className="mt-4">
            {["first_name", "last_name", "email", "phone", "address"].map((field) => (
              <div key={field} className="mb-4">
                <label
                  className="block mb-2 text-gray-600 font-semibold"
                  htmlFor={field}
                >
                  {field.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  id={field}
                  name={field}
                  value={editing ? user[field as keyof typeof user] : (field === "first_name" ? firstName ?? "" : field === "last_name" ? lastName ?? "" : field === "email" ? email ?? "" : field === "phone" ? phone ?? "" : address ?? "")} // Correct binding
                  placeholder={editing ? `Enter your ${field.replace("_", " ")}` : (field === "first_name" ? firstName ?? "" : field === "last_name" ? lastName ?? "" : field === "email" ? email ?? "" : field === "phone" ? phone ?? "" : address ?? "")}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
            ))}

            <div className="flex flex-wrap gap-4 mt-4">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-[#4a90e2] text-white px-4 py-2 rounded hover:bg-[#6baef1]"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="bg-[#3cb1b1] text-white px-4 py-2 rounded hover:bg-[#95d0d0]"
                >
                  Save Changes
                </button>
              )}
              <button
                type="button"
                onClick={handleGoBack}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default authGuard(Profile);
