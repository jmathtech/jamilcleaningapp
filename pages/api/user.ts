// pages/api/user.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed.' });
  }

  const { first_name, last_name, email, phone, address } = req.body;

  if (!first_name || !last_name || !email) {
    return res.status(400).json({ message: 'First name, last name, and email are required.' });
  }

  try {

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
