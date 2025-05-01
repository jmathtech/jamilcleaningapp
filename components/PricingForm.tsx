// /pages/pricing-form.tsx
import React from 'react';
import Image from 'next/image';
import Navbar from './Navbar';
import Footer from './Footer';
import Link from 'next/link';

const services = [
    {
        name: 'Standard / Allergy Cleaning',
        price: 30,
        description:
            'A thorough cleaning option designed to reduce dust, pet dander, and allergens. Includes dusting, vacuuming, mopping, and air quality improvement.',
    },
    {
        name: 'Organizer',
        price: 30,
        description:
            'Helps declutter and organize spaces like closets, kitchens, and bathrooms. Great for creating a more functional, stress-free living space.',
    },
    {
        name: 'Rental Cleaning',
        price: 40,
        description:
            'Ideal for short-term rental properties. Deep cleans and disinfects guest touchpoints and high-traffic areas to keep your space guest-ready.',
    },
    {
        name: 'Deep Cleaning',
        price: 50,
        description:
            'Intensive cleaning for neglected or long-unattended areas. Includes appliance scrubbing, deep surface cleaning, and optional industrial products.',
    },
    {
        name: 'Move Out Cleaning',
        price: 50,
        description:
            'Comprehensive top-to-bottom cleaning when moving in or out. Covers kitchens, bathrooms, baseboards, and all essential areas.',
    },
];

const PricingForm = () => {
    return (
        <>
            <Navbar />
            <main className="min-h-screen" style={styles.container}>
                <div className="flex justify-center items-center mt-10 p-10">
                    <Image
                        src="/img/majestik_magik_cleaning_01.png"
                        alt="Majestik Magik Cleaning"
                        width={100}
                        height={100}
                        priority={true} // Load image immediately
                        style={{ minWidth: "100px", maxWidth: "100px" }}
                    />
                </div>
                <p className="text-4xl font-bold font-montserrat text-gray-600 items-center">Majestik Magik</p>
                    <p className="text-xl font-semibold font-montserrat text-[#8ab13c] items-center pb-4">CLEANING</p>
                <h1 style={styles.heading}>Pricing</h1>
                <div style={styles.cardContainer}>
                    {services.map((service, idx) => (
                        <div key={idx} style={styles.card}>
                            <h2 style={styles.serviceName}>{service.name}</h2>
                            <p style={styles.price}>${service.price}/hr</p>
                            <p style={styles.description}>{service.description}</p>
                        </div>
                    ))}
                </div>
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
            </main>
            <Footer />
        </>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        textAlign: 'center',
        color: '#545454',
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
    },
    cardContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1.5rem',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    },
    serviceName: {
        fontSize: '1.2rem',
        color: '#545454',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
    },
    price: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#8ab13c',
        marginBottom: '0.5rem',
    },
    description: {
        fontSize: '0.95rem',
        color: '#333',
    },
};

export default PricingForm;
