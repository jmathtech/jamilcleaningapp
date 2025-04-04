'use Client';

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Image from "next/image";
import authGuard from "../utils/authGuard";
import convertToSubcurrency from "../lib/convertToSubcurrency";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";

// Load your Stripe instance
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const PaymentForm = () => {
  const token = sessionStorage.getItem("token");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    booking_id: "",
    service_type: "",
    hours: "",
    notes: "",
    date: "",
    time: "",
    has_pets: false,
    status: "",
    total_price: 0,
  });

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        console.log("Booking Token from Context:", token);

        if (!token) {
          console.error("No token available in context");
          return;
        }

        const response = await fetch("/api/bookings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `Failed to fetch booking data: ${response.status} - ${errorText}`
          );
          return;
        }

        const data = await response.json();
        console.log("Data from fetch", data);

        if (data.bookingData) {
          // Ensure keys from bookingData match formData
          setFormData({
            ...formData,
            booking_id: data.bookingData.booking_id || "",
            service_type: data.bookingData.service_type || "",
            date: data.bookingData.date || "",
            time: data.bookingData.time || "",
            hours: data.bookingData.hours || "",
            notes: data.bookingData.notes || "",
            has_pets:
              data.bookingData.has_pets !== undefined
                ? data.bookingData.has_pets
                : false,
            status: data.bookingData.status || "",
            total_price: (() => {
              const parsedPrice = parseFloat(data.bookingData.total_price);
              if (isNaN(parsedPrice)) {
                console.error(
                  "Error: total_price is not a valid number string:",
                  data.bookingData.total_price
                );
                return 0;
              }
              return parsedPrice;
            })(),
          });
        } else {
          console.error("bookingData is missing from the response", data);
        }
      } catch (error) {
        console.error("An error occurred while fetching booking data:", error);
      }
    };

    fetchBookingData();
  }, [token]);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const amountToSend = convertToSubcurrency(formData.total_price);

        console.log("Sending amount:", amountToSend);

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: amountToSend }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Failed to create payment intent: ${response.status} - ${errorData?.error}`
          );
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        alert(error);
      }
    };

    if (formData.total_price > 0) {
      createPaymentIntent();
    } else {
      setClientSecret(null);
    }
  }, [token, formData.total_price]);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    };
    fetchData();
  }, []);

  const formatTime = (time: string) => {
    if (!time) return "Invalid Time"; // Handle empty time

    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return date.toLocaleString("en-US", options);
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen p-4 mt index-container">
        <video autoPlay loop muted playsInline className="video-background">
          <source src="/img/mmcleaning_crew_video_001.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="bg-white p-4 rounded-lg shadow w-full max-w-3xl">
          <div className="flex justify-center items-center">
            <Image // Image component from next/image
              src="/img/majestik_magik_cleaning_01.png"
              alt="Majestik Magik Cleaning"
              width={250}
              height={150}
              priority={true} // Load image immediately
              style={{ minWidth: "150px", maxWidth: "250px" }}
            />
          </div>

          <div className="mb-10 mt-10">
            <h3 className="text-2xl text-center mb-4 font-semibold">
              Booking Details
            </h3>
            <div className="text-md text-center mb-8">
              Your information is secured in your account dashboard. No credit card data will be stored on our servers. Please verify your booking information below.
            </div>
            <table>
              <tbody>
                <tr className="text-lg bg-gray-100">
                  <td>Booking ID:</td>
                  <td className="bg-white px-4">{formData.booking_id}</td>
                </tr>
                <tr className="text-lg bg-gray-100">
                  <td>Service Type:</td>
                  <td className="bg-white px-4">{formData.service_type}</td>
                </tr>
                <tr className="text-lg bg-gray-100">
                  <td>Date:</td>
                  <td className="bg-white px-4">
                    {formData.date
                      ? new Date(formData.date).toLocaleDateString("en-US")
                      : "Invalid Date"}
                  </td>
                </tr>
                <tr className="text-lg bg-gray-100">
                  <td>Time:</td>
                  <td className="bg-white px-4">{formatTime(formData.time)}</td>
                </tr>
                <tr className="text-lg bg-gray-100">
                  <td>Hours:</td>
                  <td className="bg-white px-4">{formData.hours}</td>
                </tr>
                <tr className="text-lg bg-gray-100">
                  <td>Notes:</td>
                  <td className="bg-white px-4">{formData.notes}</td>
                </tr>
                <tr className="text-lg bg-gray-100">
                  <td>Pets:</td>
                  <td className="bg-white px-4">{formData.has_pets ? "Yes" : "No"}</td>
                </tr>
                <tr className="text-lg bg-gray-100">
                  <td>Service Status:</td>
                  <td className="bg-white px-4">{formData.status}</td>
                </tr>
                <tr className="text-lg bg-gray-100">
                  <td>Total Cost:</td>
                  <td className="bg-white px-4">
                    $
                    {formData.total_price !== undefined &&
                      formData.total_price !== null
                      ? Number(formData.total_price).toFixed(2)
                      : "0.00"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
              }}
            >
              <CheckoutForm amount={formData.total_price || 0} />
            </Elements>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default authGuard(PaymentForm);
