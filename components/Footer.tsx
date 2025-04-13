
/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 12/02/2024

  /components/Footer.tsx
*/

'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#333] text-white font-semibold text-sm p-6 mt">
      <div className="container mx-auto text-center">
        <div className="flex justify-center items-center mb-6 payment-icons-container">
          <Image src="/img/credit_cards/amex.svg" alt="Amex" width={75} height={55} style={{ maxWidth: "75px" }}  className="payment-icon mx" />
          <Image src="/img/credit_cards/mastercard.svg" alt="Mastercard" width={75} height={55} style={{ maxWidth: "75px" }}  className="payment-icon mx" />
          <Image src="/img/credit_cards/visa.svg" alt="Visa" width={75} height={55} style={{ maxWidth: "75px" }}  className="payment-icon mx" />
          <Image src="/img/payment_options/apple.svg" alt="Apple Pay" width={75} height={55} style={{ maxWidth: "75px" }}  className="payment-icon mx" />
          <Image src="/img/payment_options/google-pay.svg" alt="Google Pay" width={75} height={55} style={{ maxWidth: "75px" }} className="payment-icon mx" />
          <Image src="/img/payment_options/paypal.svg" alt="PayPal" width={75} height={55} style={{ maxWidth: "75px" }} className="payment-icon mx" />
          <Image src="/img/payment_options/stripe.svg" alt="Stripe" width={75} height={55} style={{ maxWidth: "75px" }}  className="payment-icon mx" />
          <Image src="/img/payment_options/klarna.svg" alt="Klarna" width={75} height={55} style={{ maxWidth: "75px" }}  className="payment-icon mx" />
        </div>
        <p>&copy; {new Date().getFullYear()}  <Link href="https://www.majestikmagik.com" className="text-white font-semibold hover:text-[#C5D89D]">Majestik Magik</Link>. All rights reserved.</p>
        <div className="mt-2">
          <Link href="/privacy-policy" className="text-white font-semibold hover:text-[#C5D89D] px-2">Privacy Policy</Link>
          <Link href="/terms" className="text-white font-semibold hover:text-[#C5D89D] px-2">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
