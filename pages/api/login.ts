// Import required libraries
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { query } from "../../lib/db";
import jwt from "jsonwebtoken";
import validator from "validator";
import { RowDataPacket } from "mysql2";

// Configuration
export const config = {
  maxDuration: 60,  // Maximum duration for the API route to be cached in seconds

};

// Login API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed." });
  }

  // Get email and password from the request body
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password || !validator.isEmail(validator.trim(email))) {
    return res.status(400).json({ message: "Invalid email or password. Please try again." });
  }

  // Check if the user exists in the database
  try {
    const result = await query(
      `
      SELECT 
        c.customer_id, 
        c.first_name,
        c.last_name,
        c.email,
        c.phone,
        c.address,
        c.password,
        b.booking_id
      FROM customers c
      LEFT JOIN bookings b ON c.customer_id = b.customer_id
      WHERE c.email = ?;
      `,
      [email]
    );

    // If no user found, then the user cannot log in
    if (Array.isArray(result) && result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password. Please try again." });
    } 

    const user = (result as RowDataPacket[])[0];

    // If password does not match, then the user cannot log in
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password. Please try again." });
    }

    // Generate JWT token
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) throw new Error("JWT_SECRET not defined");

    // Create a token that expires in 7 days
    const token = jwt.sign(
      {
        customerId: user.customer_id,

      },
      secretKey,
      { expiresIn: '7d' }
    );

    // Set the token as a cookie in the response header
    res.setHeader(
      "Set-Cookie",
      `token=${token}; httpOnly=true; Secure; SameSite=Strict; Path=/; ${process.env.NODE_ENV === "production" ? "Secure" : ""
      }`
    );

    console.log(token);

    // Return the user data
    return res.status(200).json({
      message: "Login successful.",
      token,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      booking_id: user.booking_id,
    });
  } catch (error) { // Catch any errors
    console.error("Error during login", error);
    if (error === 'ER_ACCESS_DENIED') {
      return res.status(500).json({ message: "Database access denied." });
    } else if (error=== 'ETIMEDOUT') {
      return res.status(500).json({ message: "Database connection timed out." });
    }
    return res.status(500).json({ message: "Internal server error. Please try again." });
  }
}