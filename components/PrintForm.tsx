import { useState, useEffect } from "react";
import Footer from "./Footer";
import authGuard from "../utils/authGuard";

const BookingPrintForm = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Simulate fetching booking data
    const fetchBookings = async () => {
      const sampleBookings = [
        {
          booking_id: "BKG12345",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          address: "123 Elm Street, Springfield",
          service_type: "Deep Cleaning",
          hours: "4",
          notes: "Focus on the kitchen and bathrooms.",
          date: "2025-02-25",
          time: "10:00 AM",
          has_pets: true,
          status: "Confirmed",
          total_price: 150.0
        },
      ];

      setBookings(sampleBookings);
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
              Booking Details for {booking.firstName} {booking.lastName}
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
                <p>{booking.booking_id}</p>
                <p>{booking.email}</p>
                <p>{booking.address}</p>
                <p>{booking.service_type}</p>
                <p>{booking.hours}</p>
                <p>{booking.date}</p>
                <p>{booking.time}</p>
                <p>{booking.has_pets ? "Yes" : "No"}</p>
                <p>{booking.status}</p>
                <p>${booking.total_price.toFixed(2)}</p>
                <p>{booking.notes || "None"}</p>
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
