// pages/api/user.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { query } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed.' });
  }

  const { first_name, last_name, email, phone, address, password } = req.body;

  if (!first_name || !last_name || !email) {
    return res.status(400).json({ message: 'First name, last name, and email are required.' });
  }

  try {
    // Hash the password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // SQL query to insert or update the user's profile
    const result = await query(
      `
      INSERT INTO customers (first_name, last_name, email, phone, address, password)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        first_name = VALUES(first_name),
        last_name = VALUES(last_name),
        email = VALUES(email),
        phone = VALUES(phone),
        address = VALUES(address),
        password = IF(VALUES(password) IS NOT NULL, VALUES(password), password)
      `,
      [first_name, last_name, email, phone, address, hashedPassword]
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
