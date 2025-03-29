/* 

*/

import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // Replace with your Hostinger SMTP server
        port: Number(process.env.EMAIL_PORT), // Or 587, depending on your Hostinger configuration
        secure: true, // Use SSL/TLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
        // Email configuration details
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}, Majestik Magik Cleaning Services`,
      text: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
      `,
    };

    try {
        // Send the email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        // Handle errors
      console.error(error);
      res.status(500).json({ message: "Error sending email" });
    }
  } else {
    // Method not allowed
    res.status(405).json({ message: "Method not allowed" });
  }
}
