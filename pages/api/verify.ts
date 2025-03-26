import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { query } from "../../lib/db"; // Import your database query function
import { RowDataPacket } from "mysql2";

interface DecodedToken extends JwtPayload {
  customerId: number; // Assuming customerId is a number
  email: string; // Add email to decoded token type.
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Extract token from query parameters
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(401).json({ success: false, message: "Token is missing or invalid." });
    }

    // Verify the token
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) throw new Error("JWT_SECRET is not defined in environment variables.");

    const decoded = jwt.verify(token, secretKey) as DecodedToken;

    // Check for token expiration.
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ success: false, message: "Token has expired." });
    }

    // Verify customer existence using email from decoded token.
    const customerResult = await query(
      "SELECT customer_id FROM customers WHERE email = ?",
      [decoded.email]
    ) as RowDataPacket[]; 

    if (!customerResult || customerResult.length === 0) {
      return res.status(404).json({ success: false, message: "Customer not found." });
    }

    const customerIdFromDb = customerResult[0].customer_id;

    // Verify that the customerId from the token matches the one from the database.
    if (customerIdFromDb !== decoded.customerId) {
        return res.status(401).json({success: false, message: "CustomerId mismatch."});
    }

    // Generate a new token with an extended expiration (30 minutes)
    const newToken = jwt.sign({ customerId: decoded.customerId, email: decoded.email }, secretKey, { expiresIn: "30m" });

    // Send the new token back in the response
    return res.status(200).json({ success: true, token: newToken });

  } catch (error) {
    console.error("Token verification failed:", error);

    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, message: "Token has expired." });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    // Handle generic errors
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}