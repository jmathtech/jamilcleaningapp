import '../styles/globals.css';
import { AuthProvider } from './context/AuthContext';
import type { AppProps } from 'next/app';
import { BookingProvider } from './context/BookingContext';

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