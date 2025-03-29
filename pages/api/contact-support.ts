// pages/api/contact-support.ts
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
      html: `
      <DOCTYPE html>
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
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p class="p-center"><a href="mailto:${email}" class="button">Reply</a></p>
    </div>
</body>
</html>

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
