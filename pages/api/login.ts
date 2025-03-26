// Import required libraries
import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import validator from "validator";
import { RowDataPacket } from "mysql2";

// Login API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed." });
  }

  // Get email from the request body
  const { email } = req.body;

  // Validate email and password
  if (!email || !validator.isEmail(validator.trim(email))) {
    return res.status(400).json({ message: "Invalid email or password. Please try again." });
  }

  // Check if the user exists in the database with email
  try {
    const result = await query(
      `
      SELECT 
        customer_id FROM customers WHERE email = ?
      `,
      [email]
    );

    // If no user found, then the user cannot log in
    if (Array.isArray(result) && result.length === 0) {
      return res.status(401).json({ message: "User not found." });
    }

    const user = (result as RowDataPacket[])[0];

    // Generate JWT token
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) throw new Error("JWT_SECRET not defined");

    // Create a token that expires in 7 days
    const token = jwt.sign({ customerId: user.customer_id }, secretKey, { expiresIn: "30m" });
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify?token=${token}`;

    // Send the email
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com", // Replace with your Hostinger SMTP server
      port: 465, // Or 587, depending on your Hostinger configuration
      secure: true, // Use SSL/TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Majestik Magik Cleaning" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification",
      text: `Please click the following link to verify your email: ${verificationLink}`,
      html: `<p> Please click the following link to verify your email: <a href="${verificationLink}">Log in to your account</a>`,
    });

    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}