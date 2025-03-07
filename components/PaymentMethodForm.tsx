/* 
  Created by Jamil Matheny, Majestik Magik 
  Website: cleaning.majestikmagik.com
  Updated: 12/05/2024

  /components/PaymentMethodForm.tsx 
*/
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PaymentMethodForm = () => {
    const [user, setUser] = useState<{ name: string; email: string; membership: string } | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card'); // Default to 'card'
    const router = useRouter();
    const handleGoBack = () => {
        router.back(); // Go back to the previous page
      };

    useEffect(() => {
        // Mock data - Replace this with API or localStorage logic
        const storedUser = {
            name: 'Jamil Matheny',
            email: 'jamil.matheny@majestikmagik.com',
            membership: 'Gold Plan',
        };

        setUser(storedUser);
    }, []);

    const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();   

        // Handle payment method update logic here 
        // (e.g., send request to server, update local storage)
        console.log('Selected Payment Method:', selectedPaymentMethod); 
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />

            <main className="container min-h-screen text-sm mx-auto px-4">
                {/* Welcome Section */}
                {user && (
                    <div>
                        <h2 className="text-2xl text-gray-600 font-semibold mb-4 mt-14">Welcome, {user.name}!</h2>

                        {/* User Info Section */}
                        <div className="bg-white p-4 rounded shadow mb-6">
                            <h3 className="text-lg text-gray-600 font-bold">Account Details</h3>
                            <p>
                                <strong>Membership:</strong> {user.membership}
                            </p>
                            <p>
                                <strong>Email:</strong> {user.email}
                            </p>
                        </div>
                    </div>
                )}

                {/* Payment Method Form Section */}
                <div className="bg-white p-4 rounded shadow mb-6">
                    <h3 className="text-lg text-gray-600 font-bold mb-2">Payment Method</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="paymentMethod">Select Payment Method:</label>
                            <select 
                                id="paymentMethod" 
                                value={selectedPaymentMethod} 
                                onChange={handlePaymentMethodChange}   

                                className="w-full p-3 border border-gray-300 rounded-lg"
                            >
                                <option value="card">Credit/Debit Card</option>
                                <option value="paypal">PayPal</option> 
                                <option value="applepay">Apple Pay</option> 
                                {/* Add more payment options here */}
                            </select>
                        </div>

                        {/* Add fields for card details if 'card' is selected */}
                        {selectedPaymentMethod === 'card' && (
                            <div>
                                <div className="mb-4">
                                    <input 
                                        type="text" 
                                        className="w-full p-3 border border-gray-300 rounded-lg" 
                                        placeholder="Card Number" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <input 
                                        type="text" 
                                        className="w-full p-3 border border-gray-300 rounded-lg" 
                                        placeholder="Expiration Date (MM/YY)" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <input 
                                        type="text" 
                                        className="w-full p-3 border border-gray-300 rounded-lg" 
                                        placeholder="CVV" 
                                    />
                                </div>
                            </div>
                        )}
                    <div className="flex flex-wrap gap-4">
                        <button 
                            type="submit" 
                            className="bg-[#3cb1b1] text-white px-4 py-2 rounded hover:bg-[#95d0d0]"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={handleGoBack}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400"
                        >
                            Go Back
                        </button>
                        </div>
                    </form>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default PaymentMethodForm;