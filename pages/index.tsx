"use client";

import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";


const Home = () => {
  <Head> <title>Majestik Magik | Cleaning Services</title>
   <meta name="description" content="Get quality cleaning service with us. Let us bring cleanliness and comfort to your space!" /> 
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <link rel="icon" href="/favicon.ico" />
   </Head>
  
  return (
    <div className="bg-gray index-container">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="video-background"
      >
        <source src="/img/mmcleaning_crew_video_002.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <Navbar />

      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow w-full border-[#8ab13c] border max-w-3xl text-center"
        style={{ transform: "translateY(-60px)" }}>
          <h1 className="flex justify-center items-center p-6">
            <Image
              src="/img/majestik_magik_cleaning_01.png"
              alt="Majestik Magik Cleaning"
              width={400}
              height={300}
              priority={true} // Load image immediately
              style={{ width: "auto", height: "auto", minWidth: "300px", maxWidth: "400px"}}
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
