// pages/api/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { query } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed.' });
  }

  const { first_name, last_name, email, phone, address, password } = req.body;
  
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Passing the correct parameters to the query function
    const result = await query(
      'INSERT INTO customers (first_name, last_name, email, phone, address, password) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, address, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully.', result });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error occurred.', error: error.message });
  }
}
