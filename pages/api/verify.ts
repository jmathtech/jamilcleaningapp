import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { query } from "../../lib/db";
import { RowDataPacket } from "mysql2";
import { serialize } from 'cookie';

// Define the DecodedToken interface
interface DecodedToken extends JwtPayload {
  customerId: string;
  email: string;
}

// Login API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { token } = req.query; // Get the token from the query parameter
    // Verify the token received
    if (!token || typeof token !== 'string') {
      console.error("Verification Error: No token provided");
      return res.status(401).json({ success: false, message: "Token is missing or invalid." });
    }

    // Verify the token with the secret key
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      console.error("Verification Error: JWT_SECRET is not defined");
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    // Verify the original token with the secret key
    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, secretKey) as DecodedToken; // Verify the original token
      console.log("Decoded Token:", decoded);
    } catch (verifyError) {
      console.error("Token Verification Error:", verifyError); // Log the error
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        error: verifyError instanceof Error ? verifyError.message : "Unknown verification error"
      });
    }

    // Check if the token has expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.error("Verification Error: Token expired");
      return res.status(401).json({ success: false, message: "Token has expired." });
    }

    // Fetch the customer ID from the database
    const customerResult = await query(
      "SELECT customer_id FROM customers WHERE email = ?",
      [decoded.email]
    ) as RowDataPacket[];

    // Check if a customer was found
    if (!customerResult || customerResult.length === 0) {
      console.error(`Verification Error: No customer found for email ${decoded.email}`);
      return res.status(404).json({ success: false, message: "Customer not found." });
    }

    // Check if the customer ID from the token matches the customer ID from the database
    const customerIdFromDb = customerResult[0].customer_id.toString();

    // If not, return an error response
    if (customerIdFromDb !== decoded.customerId) {
      console.error("Verification Error: CustomerId mismatch");
      return res.status(401).json({ success: false, message: "CustomerId mismatch." });
    }

    // Set the original token as a cookie
    res.setHeader(
      "Set-Cookie",
      serialize('token', token, { // Use the original token here
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 30 * 60,
      })
    );

    // Redirect to verification-success.tsx
    res.redirect(`/verification-success?token=${token}`);

    // If all checks pass, return a success response
  } catch (error) {
    console.error("Unexpected Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}