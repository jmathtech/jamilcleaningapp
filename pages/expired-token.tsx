// pages/expired-token.tsx

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

const ExpiredToken = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Token Expired</h1>
          <p className="text-lg mb-8">Your token has expired. Please log in again.</p>
          <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExpiredToken;