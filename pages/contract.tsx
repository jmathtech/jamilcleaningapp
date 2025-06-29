/* Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 06/27/2025

  pages/contract.tsx
  - Refactored to be a read-only agreement. Acceptance is implied by booking a service.
*/

"use client";

import React from 'react'; // Removed useState as it's no longer needed
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from 'next/image'; 

const ContractAgreement = () => {
    
    // Lists for the Do's and Don'ts section
    const weWillClean = [
        "Interior windows", "Dishes", "Refrigerator (interior may be extra)", "Baseboards",
        "Mop floors", "Vacuum", "Bedrooms", "Bathrooms", "Living room",
        "Garage (within agreed timeframe)", "Organizing cabinets", "Kitchen",
        "Oven (interior may be extra)", "Closets (surface tidying)", "Countertops",
        "Tabletops", "Showers / Tubs", "Ceiling fan", "Dusting"
    ];

    const weWillNotClean = [
        "Laundry", "Mold removal (requires specialists)", "Pest control/removal",
        "Rodent control/removal", "Bodily fluids", "Outside / indoor animal feces",
        "Hoarder's house (requires specialists)", "Tree bark / scraps removal"
    ];

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Navbar />

            <main className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-200">
                    <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">House Cleaning Services Agreement</h1>
                    <p className="text-center text-gray-500 mb-10">Effective as of the date of service booking.</p>

                    {/* Parties Section */}
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-bold text-[#8ab13c] mb-4">Contractor</h2>
                        <div className="inline-block text-left">
                            <p className="font-semibold">Jamil&apos;s Cleaning Services</p>
                            <p className="text-gray-600">405 E. Laburnum Ave. Ste 3. Richmond, VA 23222</p>
                            <p className="text-gray-600">804-210-6241 & 804-362-7561</p>
                            <p className="text-gray-600">jamil.matheny@gmail.com</p>
                            <p className="text-gray-600">jamil.matheny@majestikmagik.com</p>
                        </div>
                    </div>

                    {/* Contract Terms */}
                    <div className="space-y-6 text-gray-700">
                        <h3 className="text-xl font-bold border-b pb-2">1. Services Provided</h3>
                        <p>The Contractor agrees to provide professional house cleaning services at the Client&apos;s specified service address. The specific services to be performed will be outlined in a separate service checklist or work order, to be agreed upon by both parties before each cleaning session.</p>

                        <h3 className="text-xl font-bold border-b pb-2 mt-6">2. Term of Agreement</h3>
                        <p>This Agreement shall commence on the date of signing and shall remain in effect until terminated by either party in accordance with the provisions herein.</p>

                        <h3 className="text-xl font-bold border-b pb-2 mt-6">3. Payment Terms</h3>
                        <p><b>3.1. Rate:</b> The Client agrees to pay the Contractor the agreed-upon fee for services rendered.</p>
                        <p><b>3.2. Full Payment:</b> Full payment for the cleaning service is due before completion of the service.</p>
                        <p><b>3.3. Invoicing:</b> Invoices will be issued by the Contractor. Accepted payment methods include cash, check, bank transfer, and online payment. Tips are welcome but not required.</p>

                        <h3 className="text-xl font-bold border-b pb-2 mt-6">4. Cancellation and Rescheduling Policy</h3>
                        <p><b>4.1. 24+ Hours Notice:</b> If the Client cancels or reschedules with at least 24 hours&apos; notice, no fee will be charged. You will be issued a refund.</p>
                        <p><b>4.2. Within 24 Hours Notice:</b> If the Client cancels within 24 hours of the service, no fee will be charged, but future bookings may require special terms. We will keep a partial deposit of $40 and you will be issued the remaining balance as a refund.</p>
                        <p><b>4.3. Lockout Fee:</b> If the Contractor is unable to gain access to the premises at the scheduled time (a &quot;lockout&quot;), a $40.00 lockout fee will be added to the Client&apos;s account, and the service will not be performed.</p>

                        <h3 className="text-xl font-bold border-b pb-2 mt-6">5. Scope of Services</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-4">
                            <div>
                                <h4 className="text-lg font-semibold text-green-700 mb-3">We Will Clean:</h4>
                                <ul className="space-y-2">
                                    {weWillClean.map((item, index) => (
                                        <li key={index} className="flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-red-700 mb-3">We Will NOT Clean/Perform:</h4>
                                <ul className="space-y-2">
                                    {weWillNotClean.map((item, index) => (
                                        <li key={index} className="flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">Note on showers/tubs: Powerful chemicals like commercial grade bleach may be required, and will only be used with the client&apos;s prior approval.</p>

                        {/* Continue with remaining sections */}
                        <h3 className="text-xl font-bold border-b pb-2 mt-6">6. Client Responsibilities</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Provide a safe working environment for the Contractor.</li>
                            <li>Secure or remove all valuables and delicate items prior to the service.</li>
                            <li>Provide access to necessary utilities (e.g., water, electricity).</li>
                        </ul>

                        <h3 className="text-xl font-bold border-b pb-2 mt-6">7. Contractor Responsibilities & Limitation of Liability</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Perform all services in a professional and timely manner.</li>
                            <li>Provide all necessary cleaning supplies and equipment unless otherwise agreed.</li>
                            <li>Take reasonable care to avoid damage to property. Liability for damage caused by negligence is limited to the total amount paid for the specific service giving rise to the claim.</li>
                            <li>The Contractor is not liable for indirect, incidental, or consequential damages except in cases of gross negligence or willful misconduct.</li>
                        </ul>
                        
                        <h3 className="text-xl font-bold border-b pb-2 mt-6">8. Governing Law</h3>
                        <p>This Agreement shall be governed by and construed in accordance with the laws of the Commonwealth of Virginia, U.S.A.</p>

                        <h3 className="text-xl font-bold border-b pb-2 mt-6">9. Entire Agreement & Amendments</h3>
                        <p>This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements. Any amendments must be in writing and signed by both parties.</p>

                    </div>

                    {/* Final Acknowledgement Section */}
                    <div className="mt-12 border-t-2 border-dashed pt-8 text-center">
                         <h3 className="text-2xl font-bold text-gray-800 mb-4">Agreement Acknowledgement</h3>
                         <p className="text-lg text-gray-700 italic max-w-2xl mx-auto">
                            By booking a cleaning service with Jamil&apos;s Cleaning Services, you acknowledge that you have read, understood, and agree to be bound by the terms and conditions outlined in this House Cleaning Services Agreement.
                         </p>
                         <p><Image src="/img/my signature.png" alt="Signature" width={200} height={50} className="mx-auto mt-4 item-center" /></p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ContractAgreement;