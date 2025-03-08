import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { query } from '../../lib/db'; // Adjust path if necessary
import jwt from 'jsonwebtoken'; // Add this to handle JWT authentication
import { RowDataPacket } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await query('SELECT * FROM admin WHERE email = ?', [email]);

    // Log the result to check its structure
    console.log('Database query result:', result); // Debugging log

    if (Array.isArray(result) && result.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const admin = (result as RowDataPacket[])[0];

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('User found in database:', admin); // Debugging log

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    console.log('Password comparison result:', isMatch);

    const secretKey = process.env.JWT_SECRETADMIN;

    if (!secretKey) {
      throw new Error('JWT secret key is not defined in environment variables');
    }

    // Create a JWT token with the user data including role
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email, 
        first_name: admin.first_name, 
        last_name: admin.last_name,
        role: admin.role 
      },
      secretKey,
      { expiresIn: '1h' }
    );

    // Respond with a success message, token, and first name + role
    res.status(200).json({
      message: 'Login successful.',
      token,
      first_name: admin.first_name, 
      role: admin.role 
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Database error occurred.', error: error.message });
    } else {
      console.error('Unknown error:', error);
      res.status(500).json({ message: 'Unknown error occurred.' });
    }
  }
}
