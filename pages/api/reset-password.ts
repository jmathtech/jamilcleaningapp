// pages/api/reset-password.ts

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed.' });
  }

  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required.' });
  }

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email: string };
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const result = await query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, decoded.id]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'User not found or token expired.' });
    }

    res.status(200).json({ message: 'Password has been successfully reset.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Invalid or expired token.', error });
  }
}
