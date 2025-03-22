import '../styles/globals.css';
import Head from 'next/head'
import AuthProvider from './context/AuthContext';
import BookingProvider from './context/BookingContext';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Majestik Magik | Cleaning Services</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Get quality cleaning service with us. Let us bring cleanliness and comfort to your space!" />
        <meta property="og:title" content="Majestik Magik | Cleaning Services" />
        <meta property="og:description" content="Get quality cleaning service with us. Let us bring cleanliness and comfort to your space!" />
        <meta property="og:image" content="/img/majestik_magik_cleaning_01.png" />
        <meta property="og:url" content="https://majestikmagik.com" />
        
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