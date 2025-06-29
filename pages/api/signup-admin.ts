import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db'; // Adjust path if necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { first_name, last_name, email, phone, role } = req.body;

  if (!first_name || !last_name || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await query(
      'INSERT INTO admin (first_name, last_name, email, phone, role) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, role || 'admin']
    );
    

    res.status(201).json({ message: 'Admin registered successfully', id: result});
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
