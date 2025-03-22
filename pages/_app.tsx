import '../styles/globals.css';
import Head from 'next/head'
import AuthProvider from './context/AuthContext';
import BookingProvider from './context/BookingContext';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="viewport-fit=cover" />
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