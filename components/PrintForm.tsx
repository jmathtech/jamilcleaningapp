import { useState, useEffect } from "react";
import Footer from "./Footer";
import authGuard from "../utils/authGuard";

const BookingPrintForm = () => {
  const [bookings] = useState([]);

  useEffect(() => {
    // Simulate fetching booking data
    const fetchBookings = async () => {
     
     
    };

    fetchBookings();
  }, []);

  return (
    <div>
  
    <div className="container mx-auto my-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Bookings Print Invoice Form</h1>
      <div className="print-area border p-4 bg-white">
        {bookings.map((booking, index) => (
          <div key={index} className="booking-form mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Booking Details for
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-400 p-2">
                <p><strong>Booking ID:</strong></p>
                <p><strong>Email:</strong></p>
                <p><strong>Address:</strong></p>
                <p><strong>Service Type:</strong></p>
                <p><strong>Hours Booked:</strong></p>
                <p><strong>Date:</strong></p>
                <p><strong>Time:</strong></p>
                <p><strong>Has Pets:</strong></p>
                <p><strong>Status:</strong></p>
                <p><strong>Total Price:</strong></p>
                <p><strong>Notes:</strong></p>
              </div>
              <div className="bg-white p-2">
               
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => window.print()}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Print
      </button>
    </div>
    <Footer />
  </div>
  );
};

export default authGuard(BookingPrintForm);
