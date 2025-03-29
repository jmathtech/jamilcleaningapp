/* 
  /pages/api/login.ts
  This file handles the login of a user.
  It checks if the user exists in the database with the provided email
  and if the password is correct.
  If the user exists and the password is correct, it generates a JWT token
  and sends it to the user's email for verification.
  If the user does not exist or the password is incorrect, it returns an error.
  If the email is not valid, it returns an error.
  If the email is valid, it returns a success message.
  If the method is not POST, it returns an error.
*/

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
    return res.status(405).json({ message: "Method not allowed" });
  }

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
        customer_id, email, first_name, last_name FROM customers WHERE email = ?
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

    // Create a token that expires in 2 hours
    const token = jwt.sign({
      customerId: user.customer_id.toString(),
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    }, secretKey, { expiresIn: "2h" });
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
      html: `<DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .button {
            display: inline-block;
            background-color: #8ab13c; /* Replace with your brand color */
            color: white;
            padding: 14px 25px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #C5D89D; /* Replace with your brand hover color */
        }
        .p-center {
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Verify Your Email Address</h2>
        <p>Hello,</p>
        <p>Please click the button below to log in to your account. This link will expire in 15 minutes.</p>
        <p class="p-center">
            <a href="${verificationLink}" class="button">Log in to your account</a>
        </p>
        <p>If you did not request this verification, please ignore this email.</p>
        <p>Thank you,</p>
        <p>The Majestik Magik Cleaning Team</p>
    </div>
</body>
</html>`,
    });

    res.status(200).json({ message: "Email sent successfully." });
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}