import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import Footer from '../../components/Footer';
// import authGuard from "utils/admin/authGuard";


const AdminDashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [feedbackReviews, setFeedbackReviews] = useState<
  { customerName: string; feedback: string; rating: number }[]
  >([]);

  useEffect(() => {
    const mockTotalCustomers = 150;
    const mockTotalBookings = 250;
    const mockFeedbackReviews = [
      { customerName: 'Alice', feedback: 'Great service!', rating: 5 },
      { customerName: 'Bob', feedback: 'Very professional and friendly.', rating: 4 },
      { customerName: 'Charlie', feedback: 'Good, but room for improvement.', rating: 3 },
    ];

    setTotalCustomers(mockTotalCustomers);
    setTotalBookings(mockTotalBookings);
    setFeedbackReviews(mockFeedbackReviews);
  }, []);

 
  return (
    <div className="min-h-screen flex flex-col bg-gray">
      <AdminNavbar />
      <div className="flex-grow container mx-auto p-6">
        <h1 className="text-4xl text-gray-600 font-bold mb-6 mt-10">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg text-gray-600 font-semibold mb-2">Total Customers</h3>
            <p className="text-xl font-bold">{totalCustomers}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg text-gray-600 font-semibold mb-2">Total Bookings</h3>
            <p className="text-xl font-bold">{totalBookings}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow mt-6">
          <h3 className="text-lg text-gray-600 font-semibold mb-2">Bookings</h3>
        
        </div>

        {/* Feedback Reviews Section */}
        <div className="bg-white p-6 rounded shadow mt-6">
          <h3 className="text-lg text-gray-600 font-semibold mb-2">Feedback Reviews</h3>
          <ul className="list-disc pl-6">
            {feedbackReviews.map((review, index) => (
              <li key={index}>
                <p className="font-bold">{review.customerName}</p>
                <p className="text-gray-600">{review.feedback}</p>
                <p className="text-yellow-500">Rating: {'⭐'.repeat(review.rating)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default (AdminDashboard);
