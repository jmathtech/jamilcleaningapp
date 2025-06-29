// pages/api/create-payment-intent.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import jwt from "jsonwebtoken";

interface DecodedToken {
  customerId: string;
}

// Initialize Stripe with the secret key. IMPORTANT: Keep this secret!
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ success: false, message: "Authorization token required." });
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Invalid authorization format." });
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }

    const { customerId } = decoded;

    if (!customerId) {
      return res.status(400).json({ success: false, message: "Customer ID not found in token." });
    }

    try {
      const { amount } = req.body;

      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid amount provided." });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount),
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: {
          customerId, // Attach customer ID from the token to the payment intent metadata
        },
      });

      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      return res.status(500).json({
        success: false,
        message: error || "Failed to create payment intent",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }
}
