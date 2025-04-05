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
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const router = useRouter();

  // Utility function to fetch the token from sessionStorage
  const getToken = () => sessionStorage.getItem("token") || "";

  // Fetch user profile data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fields = ["first_name", "last_name", "email", "phone", "address"];
      const setters = {
        first_name: setFirstName, last_name: setLastName, email: setEmail, phone: setPhone, address: setAddress
      };

      fields.forEach(field => {
        const storedValue = sessionStorage.getItem(field);
        if (storedValue && setters[field as keyof typeof setters]) {
          setters[field as keyof typeof setters](storedValue); // Set the context state
        }

      });
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
    setIsLoading(true); // Set loading state
    setError(null); // Reset error message
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
      setIsLoading(false); // Reset loading state
      setEditSuccess(true); // Set success message
    }
  };

  return (
    <div className="bg-gray min-h-screen">
      <Navbar />

      <main className="flex-grow container justify-center items-center mx-auto px-8 py-12">
        <div className="bg-white my-10 p-10 rounded shadow border-[#8ab13c] border max-w-2xl w-full">
          <h2 className="text-2xl text-gray-600 font-bold mt-8">Profile Details</h2>
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
                  {isLoading ? 'Saving...' : 'Save Changes'}
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
            {error && <p className="text-red-600 mb-4">{error}</p>}
              {editSuccess && (
                <p className="m-4 text-[#8ab13c]">
                Your profile is now updated successfully!
                </p>
              )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default authGuard(Profile);
