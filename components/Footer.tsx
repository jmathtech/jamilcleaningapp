
/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 12/02/2024

  /components/Footer.tsx
*/

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-[#333] text-white font-semibold text-sm p-6 mt">
      <div className="container mx-auto text-center">
        <div className="flex justify-center items-center">
          <Image src="/img/credit_cards/amex.svg" alt="Amex" width={50} height={30} className="payment-icon mx-4" />
          <Image src="/img/credit_cards/mastercard.svg" alt="Mastercard" width={50} height={30} className="payment-icon mx-4" />
          <Image src="/img/credit_cards/visa.svg" alt="Visa" width={50} height={30} className="payment-icon mx-4" />
          <Image src="/img/payment_options/apple.svg" alt="Apple Pay" width={50} height={30} className="payment-icon mx-4" />
          <Image src="/img/payment_options/paypal.svg" alt="PayPal" width={50} height={30} className="payment-icon mx-4" />
          <Image src="/img/payment_options/stripe.svg" alt="Stripe" width={50} height={30} className="payment-icon mx-4" />
          <Image src="/img/payment_options/klarna.svg" alt="Klarna" width={50} height={30} className="payment-icon mx-4" />
        </div>
        <p>&copy; {new Date().getFullYear()}  Majestik Magik. All rights reserved.</p>
        <div className="mt-2">
          <Link href="/privacy-policy" className="text-white font-semibold hover:text-[#C5D89D] px-2">Privacy Policy</Link>
          <Link href="/terms" className="text-white font-semibold hover:text-[#C5D89D] px-2">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
