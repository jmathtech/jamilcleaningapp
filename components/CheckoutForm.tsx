'use client';

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import convertToSubcurrency from "../lib/convertToSubcurrency";
import { StripePaymentElementOptions } from "@stripe/stripe-js";

interface CheckoutFormProps {
    amount: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const fetchClientSecret = async () => {
            if (!token) {
                setErrorMessage("Authentication token missing.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("/api/create-payment-intent", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || "Failed to fetch client secret.");
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setClientSecret(data.clientSecret);
                setLoading(false);
               
            } catch (error) {
                console.error("Error fetching client secret:", error);
                setErrorMessage("An unexpected error occurred.");
                setLoading(false);
            }
        };

        fetchClientSecret();
    }, [amount, token]);

    const handlePayment = async () => {
        if (!stripe || !elements || !clientSecret) return;

        setLoading(true);

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-complete`,
                },
            });

            if (error) {
                setErrorMessage(error.message || "Payment failed");
                setLoading(false);
            } else {
                // Stripe will handle the redirect to the return_url on success.
            }
        } catch (err) {
            console.error("Payment error:", err);
            setErrorMessage("Payment failed. Please try again.");
            setLoading(false);
        }
    };

    if (errorMessage) {
        return <p style={{ color: "red" }}>{errorMessage}</p>;
    }

    // Create Stripe payment element options with accordion layout
    const paymentElementOptions: StripePaymentElementOptions = {
        layout: {
            type: 'accordion' as const,
            defaultCollapsed: false,
            radios: false,
            spacedAccordionItems: false,
        },
        business: {
            name: 'Majestik Magik Cleaning',
        },
        terms: {
            card: 'always',
        },
        wallets: {
            applePay: 'auto',
            googlePay: 'auto', 
        }
    };

    return (
        <form>
            {clientSecret && elements && stripe && (
                <PaymentElement options={paymentElementOptions} />
            )}
            <button 
                onClick={handlePayment} 
                disabled={!stripe || !elements || !clientSecret || loading} 
                className="w-full px-2 py-2 bg-[#8ab13c] mt-8 text-white rounded hover:bg-[#C5D89D] transition duration-300"
            > 
                {loading ? "Processing Payment..." : "Pay"}
            </button>
        </form>
    );
};

export default CheckoutForm;