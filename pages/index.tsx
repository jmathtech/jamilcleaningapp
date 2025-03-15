"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="bg-gray index-container">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="video-background"
      >
        <source src="/img/mmcleaning_crew_video_002.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Navbar />

      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow w-full border max-w-3xl text-center">
          <h1 className="flex justify-center items-center p-6">
            <Image
  src="/img/majestik_magik_cleaning_01.png"
  alt="Majestik Magik Cleaning"
  layout="responsive"
  width={400}
  height={300} // Adjust based on your image's aspect ratio
/>
          </h1>
          <p className="font-sans text-xl text-gray-600 mt-2">
           Let us bring cleanliness & comfort to your space.</p>
          <p className="text-lg p-8">
          
            <Link
              href="/signup"
              className="text-[#8ab13c] font-bold hover:text-[#C5D89D]"
              
            >
              <button className="bg-[#8ab13c] transition-opacity duration-1000 text-md hover:opacity-80 hover:bg-[#9bbe56] text-white font-bold py-2 px-8 rounded mx-4 mb-2" style={{ width: "auto", height: "auto" }}>
                Sign Up
              </button>
            </Link>
            <Link
              href="/login"
              className="text-[#8ab13c] font-bold hover:text-[#C5D89D]"
            >
             <button className="bg-[#8ab13c] transition-opacity duration-1000 text-md hover:opacity-80 hover:bg-[#9bbe56] text-white font-bold py-2 px-10 rounded mx-4 mb-2" style={{ width: "auto", height: "auto" }}>
                Login
              </button>
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
