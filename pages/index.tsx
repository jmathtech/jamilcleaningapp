'use client';

import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";


const Home = () => {
  <Head> <title>Majestik Magik | Cleaning Services</title>
    <meta name="description" content="Get quality cleaning service with us. Let us bring cleanliness and comfort to your space!" />
    <link rel="icon" href="/favicon.ico" />
  </Head>

  return (
    <>
      <Navbar />

      <div className="bg-gray index-container relative">
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


        <div className="flex justify-center items-center min-h-screen px-4 relative z-10">
          <div className="bg-white mt-10 p-10 rounded-lg shadow w-full border-[#8ab13c] border max-w-lg text-center"
          >
            <h1 className="flex justify-center items-center p-2">
              <Image
                src="/img/majestik_magik_cleaning_01.png"
                alt="Majestik Magik Cleaning"
                width={100}
                height={100}
                priority={true} // Load image immediately
                style={{ minWidth: "100px", maxWidth: "100px" }}
              />
            </h1>
            <p className="text-4xl font-bold font-montserrat text-gray-600">Majestik Magik</p>
            <p className="text-xl font-semibold font-montserrat text-[#8ab13c] pb-4">CLEANING</p>
            <p className="font-semibold text-2xl text-[#8ab13c] mt-2">
              HOUSE CLEANING SERVICES</p>
            <p className="font-semibold text-xl text-gray-600 mt-2">
              Prices start at $30 for a quality cleaning.</p>
            <p className="text-gray-600 mt-2">Let&apos;s bring cleanliness & comfort to your space.</p>
            <p className="text-lg p-8">
              <Link
                href="/signup"
                className="text-[#8ab13c] font-bold hover:text-[#C5D89D]"

              >
                <button className="bg-[#8ab13c] transition-opacity duration-1000 text-md hover:opacity-80 hover:bg-[#9bbe56] text-white font-bold py-2 px-8 rounded mx-4 mb-2" style={{ width: "auto", height: "auto" }}>
                  Sign Up Today!
                </button>
              </Link>
              <Link
                href="/login"
                className="text-[#8ab13c] font-bold hover:text-[#C5D89D]"
              >
                <button className="bg-[#8ab13c] transition-opacity duration-1000 text-md hover:opacity-80 hover:bg-[#9bbe56] text-white font-bold py-2 px-10 rounded mx-4 mb-2" style={{ width: "auto", height: "auto" }}>
                  Log In
                </button>
              </Link>
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;
