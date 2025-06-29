// pages/confirmation.tsx
import Navbar from '../components/Navbar'; // Import the Navbar component

const Confirmation = () => {
  return (
    <div className="bg-gray-100">
      {/* Add the Navbar at the top */}
      <Navbar />
      
      {/* Centering the confirmation message */}
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
          <p>Your booking has been successfully confirmed. Thank you for choosing our service!</p>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
