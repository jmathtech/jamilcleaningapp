import '../styles/globals.css';
import AuthProvider from './context/AuthContext';
import BookingProvider from './context/BookingContext';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider> 
      <BookingProvider>
        <Component {...pageProps} /> 
      </BookingProvider>
    </AuthProvider>
  );
}

export default MyApp;