// components/ReviewsForm.tsx

'use client';


import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import Image from "next/image";
import authGuard from "utils/authGuard";

interface BookingData {
  booking_id: number | string;
}

interface ReviewsFormProps {
  bookingData: BookingData | null;
}

interface FormData {
  rating: number;
  comment: string;
}

const ReviewsForm: React.FC<ReviewsFormProps> = ({
  bookingData: initialBookingData,
}) => {
  const [bookingData, setBookingData] = useState<BookingData | null>(
    initialBookingData || null
  );
  const [formData, setFormData] = useState<FormData>({
    rating: 0,
    comment: "",
  });

  const router = useRouter();
  const token = sessionStorage.getItem("token");
  const bookingId = router.query.bookingId as string;
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const successReview = "Thanks for your feedback! Your review went through successfully.";

  useEffect(() => {
    if (!token) {
      router.push("/login"); // Redirect to login if no token
      return;
    }
    console.log("bookingId:", bookingId, "token:", token);
    const isValidBookingId = (id: string) => /^[a-zA-Z0-9_-]+$/.test(id); // Fixed security issue with regex to validate bookingId string inputs

    // Check if the bookingId is valid
    if (bookingId && typeof bookingId === "string" && isValidBookingId(bookingId)) {
      const fetchBooking = async () => {
        try {
          if (!bookingId || typeof bookingId !== "string") {
            console.error("Invalid bookingId:", bookingId);
            return; // throw new Error("Invalid bookingId");
          }

          const bookingIdNumber = parseInt(bookingId);
          if (isNaN(bookingIdNumber) || bookingIdNumber <= 0) {
            console.error("Invalid bookingId:", bookingId);
            return; // throw new Error("Invalid bookingId");
          }

          const response = await fetch(`/api/bookings/${bookingId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            console.error("Failed to fetch booking data:", response.statusText);
            setBookingData(null); // Or some fallback value
            return;
          }

          const data: BookingData = await response.json();
          setBookingData(data); // Update bookingData state with fetched data
        } catch (error) {
          console.error("Error fetching booking:", error);
          setBookingData(null); // Set to null on error
        }
      };

      fetchBooking();
    } else {
      console.error("Invalid bookingId:", bookingId);
      setBookingData(null); // Set to null if bookingId is invalid
    }
  }, [bookingId, token, router]);

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData) return; // Guard clause if bookingData is null

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: bookingData.booking_id,
          ...formData,
        }),
      });

      const data = await response.json();
      console.log("Booking ID from URL:", bookingId);
      console.log("Booking Data:", bookingData);

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      console.log("Review submitted successfully", data);
      setReviewSubmitted(true);

    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!bookingData) {
    return <p>Loading booking data...</p>;
  }
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center reviews-container">
        <div className="w-full max-w-2xl px-4 py-12 bg-white rounded-lg shadow">
          <div className="flex justify-center items-center p-4">
            <Image
              src="/img/majestik_magik_cleaning_01.png"
              alt="Majestik Magik Cleaning"
              width={100}
              height={100}
              priority={true} // Load image immediately
              style={{ minWidth: "100px", maxWidth: "100px" }}
            />
            <p className="text-4xl font-bold font-montserrat text-gray-600">Majestik Magik</p>
            <p className="text-xl font-semibold font-montserrat text-[#8ab13c] pb-4">CLEANING</p>
          </div>
          <h1 className="text-3xl font-bold text-[#545454] px-4 mb-4">
            Client Review
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center bg-white p-6"
          >
            <div className="mb-4 w-full">
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Booking ID
              </p>
              {bookingData ? (
                <p className="px-4 py-2 text-gray-700">
                  {typeof bookingData.booking_id === "number" ||
                    typeof bookingData.booking_id === "string"
                    ? bookingData.booking_id
                    : (console.error(
                      "booking_id is not a number or string:",
                      bookingData.booking_id
                    ),
                      "Invalid Booking ID")}
                </p>
              ) : (
                <p className="text-red-500">Booking ID not found</p>
              )}
            </div>

            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex justify-left">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer text-2xl ${formData.rating >= star
                      ? "text-[#ecca2f]"
                      : "text-gray-300"
                      }`}
                    onClick={() => handleRatingChange(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Enter your comment"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-[#8ab13c]"
                rows={4}
              ></textarea>
            </div>

            <div className="flex justify-between w-full">
              <button
                type="submit"
                className="w-1/2 px-4 py-2 bg-[#8ab13c] text-white rounded hover:bg-[#C5D89D] transition duration-300"
              >
                Submit Feedback
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-1/2 px-4 py-2 ml-4 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
              >
                Go Back
              </button>

            </div>
            {reviewSubmitted && (<p className="mt-8 text-[#8ab13c]">{successReview}</p>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default authGuard(ReviewsForm);
