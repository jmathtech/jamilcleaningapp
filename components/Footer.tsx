
/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 12/02/2024

  /components/Footer.tsx
*/

import Link from 'next/link';

const Footer = () => {
    return (
      <footer className="bg-[#333] text-white font-semibold border-gray-300 border text-sm p-6 mt">
        <div className="container mx-auto text-center">
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
  