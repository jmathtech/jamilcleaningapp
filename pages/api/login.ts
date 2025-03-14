import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { query } from "../../lib/db";
import jwt from "jsonwebtoken";
import validator from "validator";
import { RowDataPacket } from "mysql2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed." });
  }

  const { email, password } = req.body;

  if (!email || !password || !validator.isEmail(validator.trim(email))) {
    return res.status(400).json({ message: "Invalid email or password. Please try again." });
  }

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
      LEFT JOIN bookings b ON c.customer_id = b.booking_id
      WHERE c.email = ?;
      `,
      [email]
    );

    if (Array.isArray(result) && result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password. Please try again." });
    }

    const user = (result as RowDataPacket[])[0];

    // If password matches, then the user can log in
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password. Please try again." });
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) throw new Error("JWT_SECRET not defined");
    

    const token = jwt.sign(
      {
        customerId: user.customer_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        bookingId: user.booking_id || null,      
  
      },
      secretKey,
      { expiresIn: '7d' }
    );

    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; ${
        process.env.NODE_ENV === "production" ? "Secure" : ""
      }`
    );

    console.log(token);


    return res.status(200).json({
      message: "Login successful.",
      token,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bookings: {
        bookingId: user.booking_id, // Use user.bookingId here as well
      },
    });
  } catch (error) {
    const typedError = error as Error;
    console.error("Error during login:", typedError.message);
    return res.status(500).json({ message: "Internal server error." });
  }
}