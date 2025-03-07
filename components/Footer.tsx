
/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 12/02/2024

  /components/Footer.tsx
*/

const Footer = () => {
    return (
      <footer className="bg-[#8ab13c] text-white text-sm p-6 mt">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()}  Majestik Magik. All rights reserved.</p>
          <div className="mt-2">
            <a href="/privacy-policy" className="text-white hover:text-gray-300 px-2">Privacy Policy</a>
            <a href="/terms" className="text-white hover:text-gray-300 px-2">Terms of Service</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  