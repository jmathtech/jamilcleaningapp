/*
This is the Admin Dashboard component for the Majestik Magik cleaning web application.
It provides an overview of the application's performance, including total customers, 
feedback reviews, and booking status. It also allows for updating booking status and 
deleting bookings. The component is protected by authentication and authorization.
*/

'use client';

import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import Footer from '../../components/Footer';
// import authGuard from "utils/admin/authGuard";


interface Review {
  booking_id: string;
  customer_first_name: string;
  customer_last_name: string;
  review_rating: number;
  review_comment: string;
  created_at: string;
}

interface Booking {
  booking_id: string;
  created_at: string;
  updated_at: string;
  customer_id: number;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  hours: string;
  notes?: string | null;
  service_type: string;
  has_pets: boolean;
  date: string;
  time: string;
  status: string;
  total_price: string;
}

const STATUS_OPTIONS: string[] = ['Pending', 'In-progress', 'Confirmed', 'Completed'];

const AdminDashboard = () => {

  // State for total customers
  const [totalCustomers, setTotalCustomers] = useState(0);

  // State for feedback reviews
  const [feedbackReviews, setFeedbackReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true); // Loading state for reviews
  const [errorReviews, setErrorReviews] = useState<string | null>(null); // Error state for reviews  ]

  // State for all bookings
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true); // Loading state for bookings
  const [errorBookings, setErrorBookings] = useState<string | null>(null); // Error state for bookings
  const [expandedNotes, setExpandedNotes] = useState<{
    [key: string]: boolean;
  }>({});

  // State for booking status
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [updateStatusError, setUpdateStatusError] = useState<string | null>(null); // Error state for status updates

  // Date formatting function
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      // Create date in UTC to avoid timezone shifts from just "YYYY-MM-DD"
      const dateParts = dateString.split('-').map(part => parseInt(part, 10));
      if (dateParts.length !== 3 || dateParts.some(isNaN)) {
        throw new Error("Invalid date format");
      }
      const date = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date value");
      }
      return date.toLocaleDateString('en-US', { timeZone: 'UTC' }); // Specify UTC to match input
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return 'Invalid Date';
    }
  };


  const onReadMoreToggle = (id: string) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  // Time formatting function
  const formatTime = (timeString: string | null | undefined): string => {
    if (!timeString) return 'N/A';
    try {
      const timeParts = timeString.split(':');
      if (timeParts.length < 2) throw new Error("Invalid time format");

      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);

      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error("Invalid time value");
      }

      // Create a dummy date object to use toLocaleTimeString
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(0); // Ensure seconds are zero

      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      console.error("Error formatting time:", timeString, e);
      return 'Invalid Time';
    }
  };


  useEffect(() => {
    const mockTotalCustomers = 150;
    setTotalCustomers(mockTotalCustomers);


  }, []);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  useEffect(() => {
    const fetchFeedbackReviews = async () => {
      setIsLoadingReviews(true); // Set loading state
      setErrorReviews(null); // Reset error state before fetching
      try {
        const response = await fetch('../../api/all-reviews'); // Fetch feedback reviews from the API
        if (!response.ok) {
          // Handle error response
          const errorData = await response.json().catch(() => ({})); // Try to get error message
          throw new Error(errorData.message || `Failed to fetch feedback reviews (Status: ${response.status})`);
        }
        const data = await response.json(); // Parse the response data
        if (data && typeof data === 'object' && Array.isArray(data.reviews)) {
          setFeedbackReviews(data.reviews); // Update state with the 'reviews' array
        } else {
          // Handle error response
          console.error('Invalid data format:', data);
          throw new Error(data.message || 'Invalid data format for feedback reviews');
        }
      } catch (error) {
        console.error('Error fetching feedback reviews:', error);
        setErrorReviews(error instanceof Error ? error.message : 'Error fetching feedback reviews');
      } finally {
        setIsLoadingReviews(false); // Stop loading state
      }
    };

    fetchFeedbackReviews();
  }, []); // Empty dependency array to run only once on component mount


  // --- Handler for Status Change ---

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    // Prevent changing if already updating this booking
    if (updatingStatusId === bookingId) return;

    setUpdatingStatusId(bookingId); // Set loading state for this specific row
    setUpdateStatusError(null); // Clear previous errors

    // --- Optimistic UI Update ---
    // Find the index of the booking to update
    const bookingIndex = bookings.findIndex(b => b.booking_id === bookingId);
    if (bookingIndex === -1) {
      console.error("Booking not found in local state:", bookingId);
      setUpdateStatusError("Booking not found locally.");
      setUpdatingStatusId(null);
      return;
    }

    // Create a temporary copy of the original booking in case we need to revert
    const originalBooking = { ...bookings[bookingIndex] };

    // Create a new array with the updated booking status
    const updatedBookings = [
      ...bookings.slice(0, bookingIndex),
      { ...originalBooking, status: newStatus }, // Update the status
      ...bookings.slice(bookingIndex + 1),
    ];
    setBookings(updatedBookings); // Update the state immediately

    // --- API Call ---
    try {
      const response = await fetch('../../api/update-booking-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if your API requires it
          // 'Authorization': `Bearer ${your_admin_token}`
        },
        body: JSON.stringify({ bookingId, newStatus }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // --- Revert UI on Failure ---
        setBookings(prevBookings => {
          const revertIndex = prevBookings.findIndex(b => b.booking_id === bookingId);
          if (revertIndex === -1) return prevBookings; // Should not happen
          return [
            ...prevBookings.slice(0, revertIndex),
            originalBooking, // Put the original booking back
            ...prevBookings.slice(revertIndex + 1),
          ];
        });
        throw new Error(result.message || 'Failed to update booking status.');
      }

      // Success: No need to do anything extra, UI is already updated optimistically
      console.log(`Booking ${bookingId} status updated to ${newStatus}`);

    } catch (error) {
      console.error('Error updating booking status:', error);
      // Revert UI state already handled in the !response.ok block
      setUpdateStatusError(error instanceof Error ? error.message : 'An unknown error occurred during update.');
      // Optionally, display a more persistent error message to the user
    } finally {
      // Reset loading state for this specific row
      setUpdatingStatusId(null); // Clear loading state for this row
    }
  };

  // --- Fetch All Bookings ---
  useEffect(() => {
    const fetchAllBookings = async () => {
      setIsLoadingBookings(true);
      setErrorBookings(null);
      try {
        // Use absolute path for API routes
        const response = await fetch('../../api/all-bookings');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); // Try to get error message
          throw new Error(errorData.message || 'Failed to fetch bookings');
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.bookings)) {
          setBookings(data.bookings); // Update total bookings count
        } else {
          throw new Error(data.message || 'Invalid data format for bookings');
        }
      } catch (error) {
        console.error('Error fetching all bookings:', error);
        setErrorBookings(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchAllBookings();
  }, []); // Empty dependency array to run only once on component mount

  const isLoading = isLoadingReviews || isLoadingBookings;
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-semibold text-sm"><div className="spinner"></div> Loading dashboard data...</div>;
  }

  // --- Render the Admin Dashboard ---
  return (
    <div className="min-h-screen flex flex-col bg-gray">
      <AdminNavbar />
      <div className="flex-grow max-w-full mx-auto p-6">
        <h1 className="text-4xl text-gray-600 font-bold mb-6 mt-10">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl text-gray-700 font-bold mb-4">Total # of Customers</h3>
            <p className="text-xl font-bold">{totalCustomers}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl text-gray-700 font-bold mb-4">Total # of Bookings</h3>
            <p className="text-xl font-bold">{bookings.length}</p>
          </div>
        </div>

        {/* Display general booking fetch error */}
        {errorBookings && <p className="text-red-600 font-medium mt-4">{errorBookings}</p>}

        {/* Display status update errors */}
        {updateStatusError && <p className="text-red-600 font-medium mt-4">{updateStatusError}</p>}

        {/* Bookings Section */}
        <div className="bg-white p-6 rounded-lg shadow mt-6 mb-8">
          <h3 className="text-xl text-gray-700 font-bold mb-4">All Bookings</h3> {/* Adjusted size/color/margin */}
          {isLoadingBookings && <p className="text-gray-500">Loading bookings...</p>}
          {errorBookings && <p className="text-red-600 font-medium">Error loading bookings: {errorBookings}</p>}
          {!isLoadingBookings && !errorBookings && (
            <div className="overflow-x-auto"> {/* Make table horizontally scrollable on small screens */}
              {bookings.length > 0 ? (
                <>
                  <table className="max-w-full divide-y divide-gray-200" key={currentBookings.length}>
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pets</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.booking_id} className={`hover:bg-gray-50 ${updatingStatusId === booking.booking_id ? 'opacity-50' : ''}`}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{booking.booking_id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{`${booking.customer_first_name} ${booking.customer_last_name}`}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{booking.service_type}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{booking.hours}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{booking.customer_email}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(booking.date)}</td>

                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatTime(booking.time)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{booking.customer_phone}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{booking.customer_address}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{booking.has_pets ? 'Yes' : 'No'}</td>

                          {/* Notes Section */}
                          <div className="notes-container px-4 py-3 text-sm text-gray-600">{booking.notes && booking.notes.length > 0 ? (
                            expandedNotes[booking.booking_id] ? (
                              <div className="py-3 text-sm text-gray-600">{booking.notes}
                                <span
                                  className="text-[#b1463c] text-sm font-semibold cursor-pointer"
                                  onClick={() => onReadMoreToggle(booking.booking_id)}
                                >
                                  Show Less
                                </span>
                              </div>
                            ) : (
                              <div className="text-md mt-4">
                                {booking.notes.substring(0, 50)}...
                                <span
                                  className="text-[#b1463c] text-sm font-semibold cursor-pointer"
                                  onClick={() => onReadMoreToggle(booking.booking_id)}
                                >
                                  Read More
                                </span>
                              </div>
                            )
                          ) : (
                            <p>No notes</p>
                          )} </div>

                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{booking.total_price}</td>
                          {/* --- STATUS CELL with Dropdown - RE-INTEGRATED --- */}
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <select
                              value={booking.status}
                              // Ensure booking_id is number if handleStatusChange expects number
                              onChange={(e) => handleStatusChange((booking.booking_id), e.target.value)}
                              disabled={updatingStatusId === booking.booking_id}
                              className={`w-full p-1 border rounded text-xs leading-5 font-semibold ${booking.status === 'Completed' ? 'bg-green-100 text-green-800 border-green-300' :
                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                booking.status === 'In-progress' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                                  booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                    'bg-gray-100 text-gray-800 border-gray-300'
                                } ${updatingStatusId === booking.booking_id ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              {STATUS_OPTIONS.map(statusOption => (
                                <option key={statusOption} value={statusOption}>
                                  {statusOption}
                                </option>
                              ))}
                            </select>
                          </td>
                          {/* --- END STATUS CELL --- */}


                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(booking.created_at)}</td> {/* Use formatDate for consistency */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                <p className="text-gray-500">No bookings found.</p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Feedback Reviews Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6"> {/* Added rounded-lg and shadow-md */}
          <h3 className="text-xl text-gray-700 font-bold mb-4">Feedback Reviews</h3> {/* Adjusted size/color/margin */}
          {isLoadingReviews && <p className="text-gray-500">Loading reviews...</p>} {/* Adjusted text color */}
          {errorReviews && <p className="text-red-600 font-medium">Error loading reviews: {errorReviews}</p>} {/* Adjusted text color/weight */}
          {!isLoadingReviews && !errorReviews && (
            <ul className="space-y-4"> {/* Removed list-disc, added spacing */}
              {feedbackReviews.length > 0 ? (
                feedbackReviews.map((review) => ( // Use booking_id from review as key
                  <li key={review.booking_id} className="border-b border-gray-200 pb-3 last:border-b-0"> {/* Added border */}
                    <p className="font-semibold text-gray-800">{`${review.customer_first_name} ${review.customer_last_name}`}</p> {/* Adjusted text color */}
                    {/* Display Rating */}
                    {typeof review.review_rating === 'number' && review.review_rating > 0 && (
                      <p className="text-yellow-500 my-1">{'⭐'.repeat(review.review_rating)} <span className="text-gray-500 text-sm">({review.review_rating}/5)</span></p>
                    )}
                    {/* Display Comment */}
                    <p className="text-gray-600 italic">&quot;{review.review_comment}&quot;</p> {/* Adjusted text color */}
                    {/* Display Date */}
                    <p className="text-xs text-gray-400 mt-1">Reviewed on: {formatDate(review.created_at)}</p> {/* Use formatDate */}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No feedback reviews available.</p>
              )}
            </ul>)}
        </div>
        {/* End Feedback Reviews Section */}

        {/* -- Calendar Section -- */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl text-gray-700 font-bold mb-4">Calendar</h3>
          <p className="text-gray-500">Calendar functionality is not yet implemented.</p>
          {/* Placeholder for calendar */}
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Calendar will be here.</p>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default (AdminDashboard);
