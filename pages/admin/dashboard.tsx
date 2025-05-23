/*
This is the Admin Dashboard component for the Majestik Magik cleaning web application.
It provides an overview of the application's performance, including total customers, 
feedback reviews, and booking status. It also allows for updating booking status and 
deleting bookings. The component is protected by authentication and authorization.
*/

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AdminNavbar from '../../components/AdminNavbar';
import Footer from '../../components/Footer';
// import authGuard from "utils/admin/authGuard";
// import { useAuth } from "utils/admin/authContext";
import { EventClickArg } from '@fullcalendar/core';
import { DateSelectArg } from '@fullcalendar/core';
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import BookingModal from '../../components/BookingModal';


// Defines Customer type
interface Customer {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}


// Defines Review type
// This type represents a review object with properties for booking ID, customer name, rating, comment, and creation date.
interface Review {
  booking_id: string;
  customer_first_name: string;
  customer_last_name: string;
  review_rating: number;
  review_comment: string;
  created_at: string;
}

// Defines Booking type and SortableBookingKeys
type SortableBookingKeys = keyof Booking | 'customer_name';

// Defines Booking type
interface Booking {
  booking_id: string;
  updated_at?: string; // Optional as it might not be needed for create/edit form directly
  customer_id: number | null; // Allow null for new bookings before customer selection
  customer_first_name?: string; // Useful for display, but customer_id is key
  customer_last_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  hours: string; // Keep as string to match input type, convert on save if needed
  notes?: string | null;
  service_type: string;
  has_pets: boolean;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format (24-hour)
  status: string;
  total_price?: string; // Calculated, likely display-only in modal
}

const STATUS_OPTIONS: string[] = ['pending', 'confirmed', 'in progress', 'completed'];
const SERVICE_TYPES: string[] = ['Standard/ Allergy Cleaning', 'Organizer', 'Deep Cleaning', 'Rental Cleaning', 'Move In/Out Cleaning'];


const AdminDashboard = () => {

  // State for total customers
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [errorCustomers, setErrorCustomers] = useState<string | null>(null); // Error state for customers

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

  // State for calendar modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState<DateSelectArg | Booking | null>(null);

  // --- State for Sorting ---
  const [sortColumn, setSortColumn] = useState<SortableBookingKeys>('booking_id'); // Default sort by created_at
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');


  // Date formatting function
  /* This function takes a date string in the format "YYYY-MM-DD" and returns it in a more readable format.
   It handles invalid date formats and returns 'Invalid Date' if the input is not valid.
  */
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

  // --- Read More / Show Less Toggle ---
  // This function toggles the expanded state of notes for a specific booking.
  const onReadMoreToggle = (id: string) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  // Time formatting function
  /* This function takes a time string in the format "HH:MM" and returns it in a more readable format.
    It handles invalid time formats and returns 'Invalid Time' if the input is not valid.
    It also handles null or undefined values by returning 'N/A'.
    The function uses a dummy date object to format the time correctly without being affected by the local timezone.
    The function also ensures that seconds are set to zero to avoid timezone issues.
  */
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

      /* Create a dummy date object to use toLocaleTimeString
       This is necessary to ensure the time is formatted correctly
       without being affected by the local timezone
       Set seconds to 0 to avoid timezone issues.
       */
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

  // --- Fetch Total Customers ---
  /* Fetch total customers from the API
   This effect runs only once when the component mounts
   and sets the total customers state.
   It also handles loading and error states.
   The API endpoint is assumed to be '/api/all-customers'.
   The response is expected to be in the format:
   { success: true, customerCount: number } or { success: false, message: string } 
  */
  useEffect(() => {
    const fetchTotalCustomers = async () => {
      setIsLoadingCustomers(true);
      setErrorCustomers(null);
      setCustomers([]);
      try {
        const response = await fetch('/api/all-customers');
        const responseData = await response.json().catch(() => ({ message: 'Failed to fetch total customers' }));

        if (!response.ok) {
          throw new Error(responseData?.message || 'Failed to fetch total customers');
        }

        if (responseData?.success) {
          // Check for the correct property name: customerCount
          if (typeof responseData.customerCount === 'number') {
            console.log('Customer Count:', responseData.customerCount); // Log the correct value
            setTotalCustomers(responseData.customerCount); // Use the correct property
          } else if (Array.isArray(responseData.customers)) {
            console.log('Customer Count (customers array length):', responseData.customers.length);
            setTotalCustomers(responseData.customers.length);
          } else {
            console.error('Unexpected response format for total customers:', responseData);
            throw new Error('Invalid response format for total customers');
          }
        } else {
          console.error('Unsuccessful response for total customers:', responseData);
          throw new Error(responseData?.message || 'Response was unsuccessful');
        }
      } catch (error) {
        console.error('Error fetching total customers:', error);
        setErrorCustomers(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    fetchTotalCustomers();
  }, []);

  

  // --- Pagination Handler ---
  // This function handles pagination by setting the current page.
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // --- Memoized Sorted Bookings ---
  // This memoized value sorts the bookings based on the selected column and direction.
  const sortedBookings = useMemo(() => {
    const sortableBookings = [...bookings];

    // Sort the bookings based on the selected column and direction.
    // It handles different data types (string, number, date, boolean) for sorting.
    sortableBookings.sort((a, b) => {
      let aValue: string | number | boolean;
      let bValue: string | number | boolean;

      // Handle combined customer name sort
      if (sortColumn === 'customer_name') {
        aValue = `${a.customer_first_name} ${a.customer_last_name}`;
        bValue = `${b.customer_first_name} ${b.customer_last_name}`;
      } else {
        aValue = a[sortColumn as keyof Booking] ?? "";
        bValue = b[sortColumn as keyof Booking] ?? "";
      }

      // Determining the type and compare
      let comparison = 0;
      switch (sortColumn) {
        case 'booking_id': // Assuming numeric string
        case 'customer_id':
          const numA_id = parseInt(String(aValue), 10); // Convert to number
          const numB_id = parseInt(String(bValue), 10);
          if (isNaN(numA_id) && isNaN(numB_id)) comparison = 0;
          else if (isNaN(numA_id)) comparison = -1; // Treat NaN as smaller
          else if (isNaN(numB_id)) comparison = 1;
          else comparison = numA_id - numB_id; // Numeric comparison
          break;

        case 'hours':
        case 'total_price': // Assuming numeric string, potentially with currency
          // Attempt to parse, removing non-numeric characters except decimal point
          const numA_price = parseFloat(String(aValue).replace(/[^0-9.-]+/g, ""));
          const numB_price = parseFloat(String(bValue).replace(/[^0-9.-]+/g, ""));
          if (isNaN(numA_price) && isNaN(numB_price)) comparison = 0;
          else if (isNaN(numA_price)) comparison = -1; // Treat NaN as smaller
          else if (isNaN(numB_price)) comparison = 1;
          else comparison = numA_price - numB_price;
          break;

        case 'date':
        case 'updated_at':
          const dateA = new Date(String(aValue)).getTime(); // Convert to timestamp
          const dateB = new Date(String(bValue)).getTime();
          if (isNaN(dateA) && isNaN(dateB)) comparison = 0;
          else if (isNaN(dateA)) comparison = -1; // Treat invalid dates as smaller
          else if (isNaN(dateB)) comparison = 1;
          else comparison = dateA - dateB;
          break;

        case 'has_pets': // Boolean
          const boolA = aValue ? 1 : 0;
          const boolB = bValue ? 1 : 0;
          comparison = boolA - boolB;
          break;

        // String comparison
        case 'customer_first_name':
        case 'customer_last_name':
        case 'customer_email':
        case 'customer_phone':
        case 'customer_address':
        case 'service_type':
        case 'status':
        case 'notes':
        case 'time':
        default:
          comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sortableBookings;
  }, [bookings, sortColumn, sortDirection]);


  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  // Calculate total pages based on the number of bookings and bookings per page.
  const totalPages = Math.ceil(sortedBookings.length / bookingsPerPage);


  // --- Fetch Feedback Reviews ---
  /* This effect fetches feedback reviews from the API when the component mounts.
   It handles loading and error states. */
  useEffect(() => {
    const fetchFeedbackReviews = async () => {
      setIsLoadingReviews(true); // Set loading state
      setErrorReviews(null); // Reset error state before fetching
      try {
        const response = await fetch('/api/all-reviews'); // Fetch feedback reviews from the API
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
    const updatedBookingsOptimistic = [
      ...bookings.slice(0, bookingIndex),
      { ...originalBooking, status: newStatus }, // Update the status
      ...bookings.slice(bookingIndex + 1),
    ];
    setBookings(updatedBookingsOptimistic); // Update the state immediately


    // --- API Call ---
    try {
      const response = await fetch('/api/update-booking-status', {
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

          const revertedBookings = [...prevBookings];
          revertedBookings[revertIndex] = originalBooking; // Put the original booking back
          return revertedBookings;
        });
        throw new Error(result.message || 'Failed to update booking status.');
      }

      // Success: No need to do anything extra, UI is already updated optimistically
      console.log(`Booking ${bookingId} status updated to ${newStatus}`);

    } catch (error) {
      console.error('Error updating booking status:', error);
      // --- Revert UI on Failure ---
      setBookings(prevBookings => {
        const revertIndex = prevBookings.findIndex(b => b.booking_id === bookingId);
        if (revertIndex === -1) return prevBookings;

        const revertedBookings = [...prevBookings];
        revertedBookings[revertIndex] = originalBooking; // Put the original booking back
        return revertedBookings;
      });

      // Revert UI state already handled in the !response.ok block
      setUpdateStatusError(error instanceof Error ? error.message : 'An unknown error occurred during update.');
      // Optionally, display a more persistent error message to the user
    } finally {
      // Reset loading state for this specific row
      setUpdatingStatusId(null); // Clear loading state for this row
    }
  };

  // --- Sorting Handler ---
  const handleSort = (column: SortableBookingKeys) => {
    const direction = (sortColumn === column && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortColumn(column);  // Set the column to sort by
    setSortDirection(direction); // Set the direction of sorting
    setCurrentPage(1); // Reset to the first page sorting
  };


  // --- Fetch All Bookings ---

  const fetchAllBookings = async () => {
    setIsLoadingBookings(true);
    setErrorBookings(null);
    try {
      // Use absolute path for API routes
      const response = await fetch('/api/all-bookings');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to get error message
        throw new Error(errorData.message || 'Failed to fetch bookings');
      }
      const BookingData = await response.json();
      if (BookingData.success && Array.isArray(BookingData.bookings)) {
        setBookings(BookingData.bookings); // Update total bookings count
      } else {
        throw new Error(BookingData.message || 'Invalid data format for bookings');
      }
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      setErrorBookings(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);
  // Empty dependency array to run only once on component mount


  // --- Calendar Event Transformation (using sortedBookings if needed, but usually not necessary) ---
  const calendarEvents = useMemo(() => {
    // (Keep existing calendarEvents logic, it operates on the original 'bookings' is fine)
    return bookings
      .map((booking) => {
        try {
          if (!booking.date || !booking.time) {
            console.warn(`Booking ${booking.booking_id} has missing date or time.`);
            return null;
          }

          const startDateTimeString = `${booking.date}T${booking.time}`;
          const startDate = new Date(startDateTimeString);

          if (isNaN(startDate.getTime())) {
            console.warn(`Booking ${booking.booking_id} has invalid date or time: ${startDateTimeString}`);
            return null;
          }

          const durationHours = parseFloat(booking.hours);
          if (isNaN(durationHours) || durationHours <= 0) {
            console.warn(`Booking ${booking.booking_id} has invalid hours: ${booking.hours}`);
            return null;
          }

          const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

          return {
            id: booking.booking_id,
            title: `ID: ${booking.booking_id} - ${booking.customer_first_name} (${booking.service_type})`,
            start: startDate,
            end: endDate,
            extendedProps: {
              booking: booking
            },
          };
        } catch (error) { console.error(`Error processing booking ${booking.booking_id} for calendar:`, error); return null; }
      })
      .filter(event => event !== null);
  }, [bookings]);

  const isLoading = isLoadingCustomers || isLoadingReviews || isLoadingBookings;
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-semibold text-gray-500 text-sm"><div className="spinner"></div> Loading dashboard data...</div>;
  } 

  // --- Calendar Event Handler ---
  const handleEventClick = (clickInfo: EventClickArg) => {
    // (Keep existing handleEventClick logic)
    const booking = clickInfo.event.extendedProps.booking as Booking;

    if (booking) {
      console.log('Event clicked:', booking);
      setSelectedEventData(booking); // Set the selected booking data
      setIsModalOpen(true); // Open the modal
    } else {
      console.warn('Clicked event missing "booking" in extendedProps:', clickInfo.event);
      // Optionally show a generic alert or do nothing
      alert(`Clicked event: ${clickInfo.event.title}\n(Could not load details)`);
    }
  };

  // --- Calendar Date/Time Select Handler --- 
  const handleDateSelect = (selectInfo: DateSelectArg) => {

    console.log("Date selected:", selectInfo);
    setSelectedEventData(selectInfo);
    setIsModalOpen(true);
    selectInfo.view.calendar.unselect();
  };

  // --- Close Modal Handler ---
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEventData(null);
  }


  const handleModalSave = async (bookingData: Booking) => {
    console.log("Modal Save triggered with data:", bookingData);

    // TODO: Implement save logic here
    // 1. Determine if this is an update, if data has booking_id) or create
    // 2. Call the API to save the data (PUT for update, POST for create)
    // 3. Handle the response
    // 4. Update the local state if successful
    // 5. Close the modal
    // 6. Show a success message

    // --- Determine if this is an update or create ---

    if (!bookingData.customer_first_name === undefined) {
      alert("Please select a customer.");
      return;
    }
    if (!bookingData.date || !bookingData.time) {
      alert("Please select a valid date and time.");
      return;
    }
    if (parseInt(bookingData.hours, 10) <= 0) {
      alert("Hours must be greater than zero.");
      return;
    }
    try {
      let response;
      if (bookingData.booking_id) {
        // Update existing booking
        console.log("Updating booking:", bookingData.booking_id);
        response = await fetch('/api/update-booking', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        });
      } else {
        // Create new booking
        console.log("Creating new booking:", bookingData);
        response = await fetch('/api/create-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        });
      }

      // --- Handle the response ---
      const responseData = await response.json();
      if (!response.ok || !responseData.success) throw new Error(responseData.message || 'Failed to save booking.');

      alert("Save successful!");
      handleModalClose();
      await fetchAllBookings(); // Refresh bookings after save
    } catch (error) {
      console.error('Error saving booking:', error);
      alert(error instanceof Error ? error.message : 'An unknown error occurred while saving the booking.');
    }
  };

  // --- Modal Delete/Cancel Handler ---
  const handleModalDelete = async (bookingId: string) => {
    console.log("Modal Delete triggered for booking ID:", bookingId);
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const response = await fetch('/api/cancel-booking', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId }),
        });

        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || 'Failed to delete booking.');

        alert("Booking deleted successfully!");
        handleModalClose();
        await fetchAllBookings(); // Refresh bookings after deletion
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert(error instanceof Error ? error.message : 'An unknown error occurred while deleting the booking.');
      }
    }

    // --- Confirm Deletion ---
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) {
      console.log("Deletion cancelled by user.");
      return;
    }

    // --- API Call ---
    try {
      const response = await fetch('/api/delete-booking', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Failed to delete booking.');

      alert("Booking deleted successfully!");
      handleModalClose();
      await fetchAllBookings(); // Refresh bookings after deletion
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert(error instanceof Error ? error.message : 'An unknown error occurred while deleting the booking.');
    }
  }


  // ---  Render helper for Sortable Headers ---
  const renderSortableHeader = (label: string, columnKey: SortableBookingKeys) => {
    const isSorted = sortColumn === columnKey;
    const icon = isSorted ? (sortDirection === 'asc' ? '▲' : '▼') : '';

    return (
      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort(columnKey)}>
        <div className="flex items-center">
          <span>{label}</span>
          {/* --- Sort Icon --- */}
          {isSorted && <span className="ml-1 text-gray-700">{icon}</span>}
        </div>
      </th>
    );
  };

  // --- Rendering the Admin Dashboard ---
  return (
    <div className="min-h-screen flex flex-col bg-gray-300">
      <AdminNavbar />
      <div className="flex-grow max-w-full mx-auto p-6">
        <h1 className="text-4xl text-gray-700 font-bold mb-6 mt-6">Dashboard</h1>

        {/* Displays total customers fetch error */}
        {errorCustomers && <p className="text-red-600 font-medium">{errorCustomers}</p>}


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 border border-gray-400 rounded shadow">

            {/* Displays Total # of Customers */}
            <h3 className="text-xl text-gray-700 font-bold mb-4">Total # of Customers</h3>
            {isLoadingCustomers ? (<span className="text-gray-500">Loading customers...</span>
            ) : (
              <p className="text-lg font-semibold text-gray-500">{totalCustomers}</p>
            )}
          </div>

          <div className="bg-white p-6 border border-gray-400 rounded shadow">

            {/* Display Total # of Bookings */}
            <h3 className="text-xl text-gray-700 font-bold mb-4">Total # of Bookings</h3>
            {isLoadingBookings ? (<span className="text-gray-500">Loading bookings...</span>
            ) : (
              <p className="text-lg font-semibold text-gray-500">{bookings.length}</p>
            )}
          </div>
        </div>

        {/* Displays total booking fetch error */}
        {errorBookings && <p className="text-red-600 font-medium mt-4">{errorBookings}</p>}

        {/* Displays status update errors */}
        {updateStatusError && <p className="text-red-600 font-medium mt-4">{updateStatusError}</p>}

        {/* Bookings Section */}
        <div className="bg-white p-6 border border-gray-400 rounded shadow mt-6 mb-8">
          <h3 className="text-xl text-gray-700 font-bold mb-4">All Bookings</h3> {/* Adjusted size/color/margin */}
          {isLoadingBookings && <p className="text-gray-500">Loading bookings...</p>}
          {errorBookings && <p className="text-red-600 font-medium">Error loading bookings: {errorBookings}</p>}
          {!isLoadingBookings && !errorBookings && (
            <div className="overflow-x-auto"> {/* Make table horizontally scrollable on small screens */}
              {sortedBookings.length > 0 ? (
                <>
                  <table className="max-w-full divide-y divide-gray-200" key={currentBookings.length}>
                    <thead className="bg-gray-50">
                      <tr>
                        {/* --- Use renderSortableHeader --- */}
                        {renderSortableHeader('ID', 'booking_id')}
                        {renderSortableHeader('Customer', 'customer_name')} {/* Use virtual key */}
                        {renderSortableHeader('Service', 'service_type')}
                        {renderSortableHeader('Hours', 'hours')}
                        {renderSortableHeader('Email', 'customer_email')}
                        {renderSortableHeader('Date', 'date')}
                        {renderSortableHeader('Time', 'time')}
                        {renderSortableHeader('Phone', 'customer_phone')}
                        {renderSortableHeader('Address', 'customer_address')}
                        {renderSortableHeader('Pets', 'has_pets')}
                        {renderSortableHeader('Notes', 'notes')}
                        {renderSortableHeader('Total Cost', 'total_price')}
                        {renderSortableHeader('Status', 'status')}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentBookings.map((booking) => (
                        <tr key={booking.booking_id} className={`hover:bg-gray-50 ${updatingStatusId === booking.booking_id ? 'opacity-50' : ''}`}>
                          <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{booking.booking_id}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{`${booking.customer_first_name} ${booking.customer_last_name}`}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{booking.service_type}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{booking.hours}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{booking.customer_email}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(booking.date)}</td>

                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{formatTime(booking.time)}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{booking.customer_phone}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{booking.customer_address}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{booking.has_pets ? 'Yes' : 'No'}</td>

                          {/* Notes Section */}
                          <td className="px-3 py-3 text-sm text-gray-600 max-w-xs"> {/* Added max-w-xs for notes */}
                            {booking.notes && booking.notes.length > 50 ? (
                              <>
                                {expandedNotes[booking.booking_id] ? booking.notes : `${booking.notes.substring(0, 50)}...`}
                                <button
                                  onClick={() => onReadMoreToggle(booking.booking_id)}
                                  className="text-green-600 hover:text-green-800 text-xs ml-1 whitespace-nowrap"
                                >
                                  {expandedNotes[booking.booking_id] ? 'Show Less' : 'Read More'}
                                </button>
                              </>
                            ) : (
                              booking.notes || <span className="text-gray-400">No notes</span>
                            )}
                          </td>

                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{booking.total_price}</td>

                          {/* --- STATUS CELL with Dropdown --- */}
                          <td className="px-1 py-3 whitespace-nowrap text-sm">
                            <select
                              value={booking.status}
                              // Ensure booking_id is number if { handleStatusChange } expects number
                              onChange={(e) => handleStatusChange((booking.booking_id), e.target.value)}
                              disabled={updatingStatusId === booking.booking_id}
                              className={`w-full p-2 border rounded text-xs leading-5 font-semibold appearance-none  ${booking.status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                  booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                    booking.status === 'in progress' ? 'bg-orange-100 text-orange-800 border-orange-300' :
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

                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* --- Pagination Controls --- */}
                  <div className="flex justify-center items-center">
                    <div className="flex justify-between mt-8 mb-8 space-x-2">
                      <button
                        onClick={() => paginate(Math.max(currentPage - 1, 1))}
                        className={`px-3 py-2 rounded-full ${currentPage === 1
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
                          className={`px-3 py-2 rounded-full ${currentPage === index + 1
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
                        className={`px-3 py-2 rounded-full ${currentPage === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gray-300 transition-opacity duration-2000 hover:opacity-80 hover:bg-gray-200 text-black"
                          }`}
                        disabled={currentPage === totalPages}
                      >
                        {"Next"} <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                  {/* --- END Pagination Controls --- */}

                </>
              ) : (
                <p className="text-gray-500">No bookings found.</p>
              )}
            </div>
          )}
          <div className="text-xs text-gray-200 flex justify-end">
            <Link href="https://www.majestikmagik.com">
              &copy; Powered by MajestikMagik.com <br /> Design by Jamil
              Matheny <br /> Version 1.0.0
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">

          {/* Customer Feedback Reviews Section */}
          <div className="bg-white p-6 border border-gray-400 rounded shadow-md mt-6">
            <h3 className="text-xl text-gray-700 font-bold mb-4">Feedback Reviews</h3>
            {isLoadingReviews && <p className="text-gray-500">Loading reviews...</p>}
            {errorReviews && <p className="text-red-600 font-medium">Error loading reviews: {errorReviews}</p>}
            {!isLoadingReviews && !errorReviews && (
              <ul className="space-y-4">
                {feedbackReviews.length > 0 ? (
                  feedbackReviews.map((review) => ( // Use booking_id from review as key
                    <li key={review.booking_id} className="border-b border-gray-200 pb-3 last:border-b-0">
                      <p className="font-semibold text-gray-800">{`${review.customer_first_name} ${review.customer_last_name}`}</p>
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
          {/* End Customer Feedback Reviews Section */}

          {/* -- Calendar Section Begins -- */}
          <div className="bg-white p-6 border border-gray-400 rounded shadow-md mt-6">
            <h3 className="text-xl text-gray-700 font-bold mb-4">Calendar</h3>


            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={calendarEvents}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              height="500px"
              eventClick={handleEventClick}
              select={handleDateSelect}
            />
          </div>
          {/* -- Calendar Section Ends -- */}

          {/* Modal for Booking Details */}
          {isModalOpen && (
            <BookingModal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              eventData={selectedEventData}
              onSave={handleModalSave}              
              onDelete={handleModalDelete}
              customers={customers}
              serviceTypes={SERVICE_TYPES}
              statusOptions={STATUS_OPTIONS} // Pass status options to the modal
            />
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default (AdminDashboard);
