// pages/api/user.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from "jsonwebtoken";
import { query } from '../../lib/db';
import { isValidEmail } from '../../utils/validation';


interface DecodedToken extends JwtPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'error',
      message: 'Only POST requests are allowed.',
      allowedMethods: ['POST'],
    });
  }

  const { first_name, last_name, email, phone, address } = req.body;

  // Validate required fields
  // Check if the required fields are present in the request body
  const ValidationErrors = isValidEmail(req.body);
  if (ValidationErrors) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed.',
      error: ValidationErrors
    });
  }

  if (!first_name || !last_name || !email) {
    return res.status(400).json({ message: 'First name, last name, and email are required.' });
  }

  try {

    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ success: false, message: "Authorization token required." });
    }

    const token = authorization.split(" ")[1]; // Extract token from "Bearer <token>"
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

    // SQL query to insert or update the user's profile
    const result = await query(
      `
      INSERT INTO customers (first_name, last_name, email, phone, address)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        first_name = VALUES(first_name),
        last_name = VALUES(last_name),
        email = VALUES(email),
        phone = VALUES(phone),
        address = VALUES(address)
      `,
      [first_name, last_name, email, phone, address]
    );

    res.status(200).json({
      message: 'User profile updated successfully.',
      result,
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      message: 'Database error occurred.',
      error: error,
    });
  }
}
