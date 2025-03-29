import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import authGuard from '../utils/authGuard';

const ContactSupport = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow container mx-auto px-8 py-12">
        <div className="bg-white p-6 rounded shadow border-[#8ab13c] border max-w-xl mx-auto">
          <h1 className="text-2xl text-gray-600 font-bold mb-6 mt-10">Contact Support</h1>
          <h3 className="text-lg text-gray-600 font-semibold mb-4">We are here to help!</h3>
          <p className="text-sm text-gray-500 mb-6">
            If you have any questions or need assistance, please fill out the form below, and we’ll get back to you as soon as possible.
          </p>

          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Your Name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Your Email"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                rows={4 as number}
                className="w-full px-3 py-2 rounded shadow"
                placeholder="Your Message"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-[#8ab13c] text-white px-4 py-2 rounded shadow hover:bg-[#b7d190] focus:outline-none focus:ring"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default authGuard(ContactSupport);
