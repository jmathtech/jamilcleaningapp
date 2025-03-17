import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import authGuard from "../utils/authGuard";
import Modal from "react-modal";
import { motion } from "framer-motion";

// Define the booking data type
interface Booking {
  booking_id: string;
  service_type: string;
  hours: string;
  notes: string | null;
  date: string;
  time: string;
  has_pets: boolean;
  status: string;
  total_price: number;
}

// The dashboard functionalities
const Dashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rescheduleTime, setRescheduleTime] = useState("10:00");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [bookingsPerPage] = useState(10); // Updated to 10 bookings per page
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  ); // Add selectedBookingId
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [modalRescheduleIsOpen, setModalRescheduleIsOpen] = useState(false);
  const [successReschedule, setsuccessReschedule] = useState(false);
  const [modalCancelIsOpen, setModalCancelIsOpen] = useState(false);
  Modal.setAppElement("#__next");
  const [expandedNotes, setExpandedNotes] = useState<{
    [key: string]: boolean;
  }>({});

  const router = useRouter();
  const token = sessionStorage.getItem("token") as string;

  // Animation settings
  const bounceVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: [1.1, 0.95, 1], // Bounce effect
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.68, -0.55, 0.27, 1.55], // Custom ease for bounce
      },
    },
  };

  // Fetch booking data from the database using the token authorization and API
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setIsLoading(false);
      setError("You must be logged in to view bookings.");
      return;
    }

    try {
      const response = await fetch(`/api/get-booking`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings. Status: ${response.status}`); // Error logging
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        throw new Error("Invalid or missing data in API response."); // Error logging
      }
    } catch (err) {
      console.error("Error fetching bookings:", err); // Error logging
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const handleReviewClick = (bookingId: string) => {
    // Replace '/reviews' with your actual reviews route
    // If you need to pass the bookingId, use dynamic routing
    router.push(`/reviews?bookingId=${bookingId}`);
  };

  // Modified handleCancelBooking function
  const handleCancelBooking = (bookingId: string) => {
    setCancelBookingId(bookingId); // Store the bookingId
    setModalCancelIsOpen(true);
  };

  // Function to confirm cancellation
  const confirmCancel = async () => {
    if (cancelBookingId) {
      try {
        const response = await fetch(
          `/api/cancel-booking?bookingId=${cancelBookingId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to cancel booking. Status: ${response.status}`
          );
        }

        setBookings((prev) =>
          prev.filter((b) => b.booking_id !== cancelBookingId)
        );
        setModalCancelIsOpen(false);
        setCancelBookingId(null); // Reset bookingId
      } catch (err) {
        console.error("Error canceling booking:", err);
        setError("Failed to cancel booking. Please try again later.");
      }
    }
  };

  // Function to cancel cancellation
  const cancelCancel = () => {
    setModalCancelIsOpen(false);
    setCancelBookingId(null); // Reset bookingId
  };

  // Format the timestamp for viewing purposes
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Read more toggle function
  const onReadMoreToggle = (id: string) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Sort by booking date function
  const handleSortByDate = () => {
    setBookings((prevBookings) =>
      [...prevBookings].sort(
        (b, a) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  };

  // Sort by service status function ASCENDING
  const handleSortByServiceStatus = () => {
    setBookings((prevBookings) =>
      [...prevBookings].sort((a, b) => {
        const statusA = a.status.toLowerCase(); // Convert to lowercase for case-insensitive comparison
        const statusB = b.status.toLowerCase();

        if (statusA < statusB) return -1; // Sort A before B
        if (statusA > statusB) return 1; // Sort B before A
        return 0; // Equal statuses remain in place
      })
    );
  };

  const handleSortByServiceType = () => {
    setBookings((prevBookings) =>
      [...prevBookings].sort((a, b) => {
        const typeA = a.service_type.toLowerCase(); // Convert to lowercase for case-insensitive comparison
        const typeB = b.service_type.toLowerCase();

        if (typeA < typeB) return -1; // Sort A before B
        if (typeA > typeB) return 1; // Sort B before A
        return 0; // Equal service types remain in place
      })
    );
  };

  // Sort by booking id function
  const handleSortByBookingID = () => {
    setBookings((prevBookings) =>
      [...prevBookings].sort((a, b) => {
        // Convert booking_id to number if needed
        const idA = parseInt(a.booking_id, 10);
        const idB = parseInt(b.booking_id, 10);
        return idB - idA; // Descending order
      })
    );
  };

  // Variable for pagination of bookings (the pages goes up to 10 bookings per page)
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  // Get the booking information 
  const handlePrint = () => {
    router.push('/print');
  };

  // Function to open the reschedule modal
  const openRescheduleModal = (bookingId: string) => {
    setSelectedBookingId(bookingId); // Capture bookingId
    setModalRescheduleIsOpen(true);
  };


  const handlesuccessReschedule = "Your booking has been updated! You may now close this window.";

  // Function to submit reschedule
  const submitReschedule = async () => {
    if (selectedBookingId) {
      try {
        const payload = {
          bookingId: selectedBookingId,
          date: rescheduleDate,
          time: rescheduleTime,
        };

        console.log("Reschedule Payload:", payload);

        const response = await fetch("/api/update-booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          fetchBookings(); // Refetch bookings
          setSelectedBookingId(null);
          setRescheduleDate("");
          setRescheduleTime("");
          setsuccessReschedule(true);

        } else {
          console.error("Failed to reschedule booking:", response.status);
          const responseBody = await response.json();
          console.error("Response Body:", responseBody);
          alert("Failed to reschedule booking. Please try again.");
        }
      } catch (error) {
        console.error("Error rescheduling booking:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  // The booking data chart within the dashboard
  const BookingTable = ({
    bookings,
    onCancel,
    formatTime,
    onReadMoreToggle,
    expandedNotes,
  }: {
    bookings: Booking[];
    onCancel: (id: string) => void;
    formatTime: (time: string) => string;
    onReadMoreToggle: (id: string) => void;
    expandedNotes: { [key: string]: boolean };
  }) => (
    <div className="overflow-x-auto rounded">
      <table className="w-full border">
        <thead>
          <tr className="text-sm">
            {[
              "Booking ID#",
              "Date",
              "Time",
              "Hours",
              "Notes",
              "Service Type",
              "Service Status",
              "Total Cost",
              "Actions",
            ].map((header) => (
              <th
                key={header}
                className="bg-gray-100 border px-4 py-2 text-left"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.booking_id}>
              <td className="border px-4 py-4">{booking.booking_id}</td>
              <td className="border px-4 py-4">
                {new Date(booking.date).toLocaleDateString()}
              </td>
              <td className="border px-4 py-4">{formatTime(booking.time)}</td>
              <td className="border px-4 py-4">{booking.hours}</td>
              <td className="border px-4 py-4">
                {booking.notes ? (
                  expandedNotes[booking.booking_id] ? (
                    <div>
                      {booking.notes}
                      <span
                        className="text-[#b1463c] font-semibold cursor-pointer"
                        onClick={() => onReadMoreToggle(booking.booking_id)}
                      >
                        Show Less
                      </span>
                    </div>
                  ) : (
                    <div>
                      {booking.notes.substring(0, 50)}...
                      <span
                        className="text-[#b1463c] font-semibold cursor-pointer"
                        onClick={() => onReadMoreToggle(booking.booking_id)}
                      >
                        Read More
                      </span>
                    </div>
                  )
                ) : (
                  "No notes"
                )}
              </td>
              <td className="border px-4 py-2">{booking.service_type}</td>
              <td className="border px-4 py-2">{booking.status}</td>
              <td className="border px-4 py-2">${booking.total_price}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-[#3498db] transition-opacity duration-500 text-sm hover:opacity-80 hover:bg-[#85c1e9] text-white font-bold py-1 px-3 rounded-full mx-1 mb-2"
                  onClick={() => handleReviewClick(booking.booking_id)}
                >
                  <i className="fa fa-commenting" aria-hidden="true"></i> Review
                </button>

                <button
                  className="bg-[#3cb1b1] transition-opacity duration-500 text-sm hover:opacity-80 hover:bg-[#85c1e9] text-white font-bold py-1 px-3 rounded-full mx-1 mb-2"
                  onClick={() => openRescheduleModal(booking.booking_id)}
                >
                  <i className="fa fa-calendar" aria-hidden="true"></i> Reschedule
                </button>

                <Modal
                  isOpen={modalRescheduleIsOpen}
                  onRequestClose={() => setModalRescheduleIsOpen(false)}
                  contentLabel="Reschedule Booking"
                  style={{
                    overlay: {
                      backgroundColor: "rgba(0, 0, 0, 0.1)", // Optional: Background overlay style
                    },
                    content: {
                      width: "550px", // Set the width
                      height: "405px", // Set the height
                      margin: "auto", // Center the modal
                      padding: "30px", // Add some padding
                      borderRadius: "8px", // Optional: Rounded corners
                      boxShadow: "0 8px 18px rgba(0, 0, 0, 0.1)", // Optional: Add a shadow
                    },
                  }}
                >
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={bounceVariants}
                    className="modal-content"
                  >
                    <h2 className="font-semibold text-center text-md">
                      Reschedule Booking
                    </h2>

                    {/* Date */}
                    <div className="mb-4">
                      <label htmlFor="date" className="block font-medium">
                        Select Date:
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
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
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className="block w-full border p-2 rounded"
                        required
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        className="px-5 py-2 mx-4 bg-[#3cb1b1] text-white text-md rounded hover:bg-[#85c1e9] transition-colors duration-500 ease-in-out"
                        onClick={submitReschedule}
                      >
                        Reschedule
                      </button>

                      <button
                        className="px-5 py-2 bg-gray-300 text-md rounded hover:bg-gray-200 transition-colors duration-500 ease-in-out"
                        onClick={() => setModalRescheduleIsOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                    {successReschedule && <p className="mt-4 text-[#8ab13c]">{handlesuccessReschedule}</p>}
                  </motion.div>
                </Modal>

                <button
                  onClick={() => onCancel(booking.booking_id)}
                  className="bg-[#b1463c] transition-opacity duration-500 text-sm hover:opacity-80 hover:bg-[#d59187] text-white font-bold py-1 px-3 rounded-full mx-1 mb-2"
                >
                  <i className="fa fa-ban" aria-hidden="true"></i> Cancel
                </button>

                <Modal
                  isOpen={modalCancelIsOpen}
                  onRequestClose={() => setModalCancelIsOpen(false)}
                  contentLabel="Cancel Booking"
                  style={{
                    overlay: {
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    },
                    content: {
                      width: "400px",
                      height: "200px",
                      margin: "auto",
                      padding: "20px",
                      borderRadius: "8px",
                      boxShadow: "0 8px 18px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={bounceVariants}
                    className="modal-content"
                  >
                    <h2 className="font-semibold text-center text-md">
                      Cancel Booking
                    </h2>
                    <div className="text-center mt-4">
                      Are you sure you want to cancel this booking?
                    </div>
                    <div className="flex justify-center mt-8 space-x-4">
                      <button
                        className="px-6 py-2 bg-[#b1463c] text-white rounded hover:bg-[#d59187] transition-colors duration-500 ease-in-out"
                        onClick={confirmCancel}
                      >
                        Yes, Cancel
                      </button>
                      <button
                        className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-200 transition-colors duration-500 ease-in-out"
                        onClick={cancelCancel}
                      >
                        No, Keep Booking
                      </button>
                    </div>
                  </motion.div>
                </Modal>

                <button
                  onClick={handlePrint}
                  className="bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-opacity duration-500 text-sm hover:opacity-80 font-bold py-1 px-3 mx-1 mb-2"
                >
                  <i className="fa fa-print" aria-hidden="true"></i> Print Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Navbar />

      {/* Dashboard Section */}
      <div className="bg-gray min-h-screen">
        <main className="container mx-auto py-12">
          <h1 className="text-4xl text-gray-600 font-bold mb-6 mt-10">Dashboard</h1>
          <div
            className={`bg-white p-12 rounded shadow border-[#8ab13c] border mb-6 fade-in-page ${pageLoaded ? "loaded" : ""
              }`}
          >
            <div className="flex flex-col md:flex-row md:space-x-6 md:items-center mt-4 mb-4 space-y-3 md:space-y-0">
              <button
                className="bg-[#8ab13c] rounded transition-opacity duration-2000 hover:opacity-80 hover:bg-[#96be46] text-white px-4 py-2"
                onClick={fetchBookings}
              >
                <i className="fa fa-refresh" aria-hidden="true"></i>  Refresh
              </button>
              <button
                onClick={handleSortByBookingID}
                className="bg-[#3c8ab1] rounded transition-opacity duration-2000 hover:opacity-80 hover:bg-[#50a7d3] text-white px-4 py-2 mb-2"
              >
                <i className="fa fa-sort-numeric-desc" aria-hidden="true"></i>  Sort By Booking ID
              </button>
              <button
                className="bg-[#3cb1b1] rounded transition-opacity duration-2000 hover:opacity-80 hover:bg-[#4dc7c7] text-white px-4 py-2 mb-2"
                onClick={handleSortByDate}
              >
                <i className="fa fa-calendar-o" aria-hidden="true"></i>  Sort By Recent Date
              </button>
              <button
                onClick={handleSortByServiceType}
                className="bg-[#bdbb3c] rounded transition-opacity duration-2000 hover:opacity-80 hover:bg-[#d1cf4c] text-white px-4 py-2 mb-2"
              >
                <i className="fa fa-handshake-o" aria-hidden="true"></i>  Sort By Service Type
              </button>

              <button
                onClick={handleSortByServiceStatus}
                className="bg-[#b13c8a] rounded transition-opacity duration-2000 hover:opacity-80 hover:bg-[#d64ea9] text-white px-4 py-2 mb-2"
              >
                <i className="fa fa-tasks" aria-hidden="true"></i>  Sort By Service Status
              </button>
            </div>

            <h3 className="text-lg text-gray-600 font-bold mt-14 mb-5">
              My Bookings
            </h3>
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : bookings.length > 0 ? (
              <>
                <BookingTable
                  bookings={currentBookings}
                  onCancel={handleCancelBooking}
                  formatTime={formatTime}
                  onReadMoreToggle={onReadMoreToggle}
                  expandedNotes={expandedNotes}
                />
                <div className="flex justify-center items-center">
                  <div className="flex justify-between mt-8 mb-8 space-x-2">
                    <button
                      onClick={() => paginate(Math.max(currentPage - 1, 1))}
                      className={`px-4 py-2 rounded-full ${currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gray-300 hover:bg-gray-200 transition-opacity duration-2000 hover:opacity-80 text-black"
                        }`}
                      disabled={currentPage === 1}
                    >
                      <i className="fa fa-angle-double-left" aria-hidden="true"></i> {"Prev"}
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 rounded-full ${currentPage === index + 1
                            ? "bg-gray-400 text-white"
                            : "bg-gray-200 transition-opacity duration-2000 hover:opacity-80 hover:bg-gray-100"
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        paginate(Math.min(currentPage + 1, totalPages))
                      }
                      className={`px-4 py-2 rounded-full ${currentPage === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gray-300 transition-opacity duration-2000 hover:opacity-80 hover:bg-gray-200 text-black"
                        }`}
                      disabled={currentPage === totalPages}
                    >
                      {"Next"} <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p>No bookings found.</p>
            )}

            <div className="text-xs text-gray-200 flex justify-end">
              <Link href="https://www.majestikmagik.com">
                &copy; Powered by MajestikMagik.com <br /> Design by Jamil
                Matheny
              </Link>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="bg-white p-12 rounded shadow border-[#8ab13c] border">
            <h3 className="text-lg text-gray-600 font-bold mb-2">
              Quick Links
            </h3>
            <div className="flex flex-wrap gap-4">
              {[
                {
                  href: "/booking",
                  label: "Book A Cleaning",
                  bgColor: "#3cb1b1",
                },
                {
                  href: "/profile",
                  label: "Manage User Info",
                  bgColor: "#0066CC",
                },
                {
                  href: "/contact-support",
                  label: "Contact Support",
                  bgColor: "#b1a73c",
                },
              ].map((action) => (
                <Link key={action.href} href={action.href}>
                  <button
                    className="text-white px-4 py-2 rounded transition-opacity duration-2000 hover:opacity-80"
                    style={{ backgroundColor: action.bgColor }}
                  >
                    {action.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default authGuard(Dashboard);
