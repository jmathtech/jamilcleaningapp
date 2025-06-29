/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 12/08/2024
*/

import Navbar from "../components/Navbar"; // Import Navbar component
import Footer from "../components/Footer";
const Unauthorized = () => {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center h-screen mt">
        <div className="flex justify-center items-center p-10">
          <div className="bg-white p-10 rounded-lg shadow max-w-lg">
            <h1 className="font-semibold">Unauthorized Access</h1>
            <p>You do not have permission to view this page.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Unauthorized;
