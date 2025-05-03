/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Last Updated: 02/07/2025
  
  /components/BookingForm.tsx
*/

'use Client';

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Navbar from "./Navbar";
import Footer from "./Footer";  // Import Footer component
import authGuard from "../utils/authGuard";


const BookingForm = () => {

  const [service_type, setServiceType] = useState("Standard / Allergy Cleaning");
  const [email, setEmail] = useState("");
  const [hours, setHours] = useState(3);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [hasPets, setHasPets] = useState(false);
  const [serviceDescription, setServiceDescription] = useState(""); // State for service description
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const serviceRates: Record<string, number> = {
    "Standard / Allergy Cleaning": 30,
    "Organizer": 30,
    "Rental Cleaning": 40,
    "Deep Cleaning": 50,
    "Move Out Cleaning": 50,
  };

  // Function to calculate the total based on service type and hours
  const calculateTotal = () => serviceRates[service_type] * hours;

  // Fetch service description when service type changes
  useEffect(() => {
    const fetchServiceDescription = async () => {
      try {
        const response = await fetch(
          `/api/get-service-description?serviceType=${service_type}`
        );
        const data = await response.json();
        console.log("Fetched service description:", data); // Log for debugging
        setServiceDescription(data.description || "No description available.");
      } catch (error) {
        console.error("Error fetching service description:", error);
        setServiceDescription("Failed to load description.");
      }
    };

    fetchServiceDescription();
  }, [service_type]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const totalPrice = calculateTotal(); // This calculates the total price

    const bookingData = {
      service_type: service_type,
      email: email,
      hours: hours,
      notes: notes,
      date: date,
      time: time,
      has_pets: hasPets,
      status: "pending",
      total_price: totalPrice,
    };

    console.log("Request Body (Before Fetch):", bookingData); // Log the data
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch("/api/save-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("token", data.token);
        router.replace("/payment");
      } else {
        alert('Failed to create booking.');
      }
    } catch (error) {
      console.error('Unexpected Error:', error);
      setLoading(false);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen px-2 py-12 booking-container">
        <div className="bg-white p-2 rounded-lg shadow border-[#8ab13c] border w-full max-w-5xl">
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

          <h2 className="flex justify-center text-3xl text-[#545454] font-bold p-6">
            Book a Cleaning
          </h2>
          <form onSubmit={handleBookingSubmit} className="space-y-4 p-4">

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block font-medium">
                Login Email
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full border p-2 rounded"
              />
            </div>


            {/* Service Type */}
            <div className="mb-4">
              <label htmlFor="service_type" className="block font-medium">
                Select Service:
              </label>
              <select
                id="service_type"
                value={service_type}
                onChange={(e) => setServiceType(e.target.value)}
                className="block w-full border p-2 rounded"
              >
                <option>Standard / Allergy Cleaning</option>
                <option>Organizer</option>
                <option>Rental Cleaning</option>
                <option>Deep Cleaning</option>
                <option>Move Out Cleaning</option>
              </select>
            </div>

            {/* Display Service Description */}
            <div className="mb-4">
              <h3 className="text-md font-semibold">Service Description</h3>
              <p className="text-md">{serviceDescription}</p>
            </div>

            {/* Hours */}
            <div className="mb-4">
              <label htmlFor="hours" className="block font-medium">
                Number of Hours:
              </label>
              <input
                type="number"
                id="hours"
                min={2}
                max={8}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="block w-full border p-2 rounded"
              />
            </div>

            {/* Date */}
            <div className="mb-4">
              <label htmlFor="date" className="block font-medium">
                Select Date:
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="block w-full border p-2 rounded"
                required
              />
            </div>

            {/* Time */}
            <div className="mb-4">
              <label htmlFor="time" className="block font-medium">
                Select Time:
              </label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="block w-full border p-2 rounded"
                required
              />
            </div>

            {/* Pets */}
            <div>
              <label className="block font-medium">Do you have pets?</label>
              <div className="flex items-center space-x-6">
                <label>
                  <input
                    type="radio"
                    name="hasPets"
                    value="yes"
                    checked={hasPets === true}
                    onChange={() => setHasPets(true)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="hasPets"
                    value="no"
                    checked={hasPets === false}
                    onChange={() => setHasPets(false)}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label htmlFor="notes" className="block font-medium">
                Cleaning Notes:
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                className="block w-full border p-2 rounded"
              />
            </div>

            {/* Total Cost */}
            <div className="mb-4">
              <p className="text-xl font-bold" aria-live="polite">
                Total Cost: ${calculateTotal()}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              aria-label="Submit"
              className="px-6 py-2 bg-[#8ab13c] text-white text-lg font-bold rounded hover:bg-[#C5D89D]  transition-colors duration-1000 ease-in-out"
              disabled={loading}
            >
              {loading ? "Booking..." : "Book Now"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default authGuard(BookingForm);