import '../styles/globals.css';
import Head from 'next/head';
import AuthProvider from './context/AuthContext';
import BookingProvider from './context/BookingContext';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Jamil&apos;s Cleaning Services</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="title" content="Jamil&apos;s Cleaning Services" />
        <meta name="keywords" content="cleaning, cleaning service, janitorial, janitorial service, residential cleaning, commercial cleaning" />
        <meta name="author" content="Jamil Matheny, Majestik Magik" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Jamil&apos;s Cleaning Services" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image:type" content="image/png" />
        <meta name="description" content="Get quality cleaning service with us. Let us bring cleanliness and comfort to your space!" />
        <meta property="og:title" content="Jamil&apos;s Cleaning Services" />
        <meta property="og:description" content="Get quality cleaning service with us. Let us bring cleanliness and comfort to your space!" />
        <meta property="og:image" content="/img/majestik_magik_cleaning_01.png" />
        <meta property="og:url" content="https://jamilcleaningapp.vercel.app" />
        
      </Head>
      <AuthProvider>
        <BookingProvider>
          <Component {...pageProps} />
        </BookingProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;