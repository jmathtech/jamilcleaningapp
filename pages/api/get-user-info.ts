import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { query } from '../../lib/db'; // Assuming db is correctly configured

// Define the User interface based on your database schema
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  // Add other fields that your users table contains
}

// Define the JWT Payload interface
interface JwtPayload {
  id: string;
  // Add other fields that you include in the token, if any
}

// Define types for the result of db.query()
type QueryResult = {
  rows: User[]; // Assuming you expect an array of users
};

type OkPacket = {
  affectedRows: number;
  insertId?: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Get the token after 'Bearer'

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get the secret key from the environment
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return res.status(500).json({ message: 'JWT secret key is missing' });
    }

    // Decode the JWT token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, secretKey) as JwtPayload; // Decode the token
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Query the database to fetch user info by ID
    const result = await query('SELECT * FROM users WHERE id = ?', [decoded.id]);

    // Check if the result is a QueryResult (SELECT query)
    if ('rows' in result) {
      // This is a SELECT query, so the result should have 'rows'
      const rows = result.rows; // Access the rows of the query
      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user: User = rows[0]; // The first row contains the user data
      return res.status(200).json(user);
    } 
    // If the result is not a QueryResult, it's probably an OkPacket (INSERT, UPDATE, DELETE)
    else if ('affectedRows' in result) {
      // This is a non-SELECT query (INSERT, UPDATE, DELETE)
      const okPacket: OkPacket = result; // Type cast the result to OkPacket
      if (okPacket.affectedRows === 0) {
        return res.status(404).json({ message: 'No rows affected' });
      }

      return res.status(200).json({ message: `${okPacket.affectedRows} row(s) affected` });
    } else {
      // Handle unexpected query result type
      return res.status(400).json({ message: 'Unexpected query result' });
    }
  } catch (error) {
    console.error('Error in get-user-info:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
