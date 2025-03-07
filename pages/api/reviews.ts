// /pages/api/reviews.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
    customerId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { bookingId, rating, comment } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!bookingId || rating === undefined || comment === undefined) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        const customerId = decodedToken.customerId;

        // Verify that the booking belongs to the customer
        const bookingCheckResult = await query(
            'SELECT customer_id FROM bookings WHERE booking_id = ?',
            [bookingId]
        );

        if (!bookingCheckResult || !Array.isArray(bookingCheckResult) || bookingCheckResult.length === 0) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        if (bookingCheckResult[0].customer_id !== customerId) {
            return res.status(403).json({ message: 'Forbidden: Booking does not belong to the customer.' });
        }

        // Update the bookings table with review data
        const updateResult = await query(
            'UPDATE bookings SET review_rating = ?, review_comment = ? WHERE booking_id = ?',
            [rating, comment, bookingId]
        );

        res.status(200).json({ message: 'Review submitted successfully.', updateResult });
    } catch (error) {
      if (error === 'JsonWebTokenError') {
          return res.status(401).json({ message: 'Invalid token.' });
      }
  
      console.error('Unexpected error:', error);
      res.status(500).json({ message: 'An unexpected error occurred.' });
  }
}  