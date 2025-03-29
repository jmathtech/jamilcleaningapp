// /pages/api/reviews.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';
import jwt, { JwtPayload } from "jsonwebtoken";
import { RowDataPacket } from 'mysql2';

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

        // Update the bookings table with review data
        const updateResult = await query(
            'UPDATE bookings SET review_rating = ?, review_comment = ? WHERE booking_id = ? AND customer_id = ?',
            [rating, comment, bookingId, customerId]
        ) as { affectedRows: number; } & RowDataPacket[];

        // Check to see if any rows were updated successfully.
        if (updateResult.affectedRows === 0) {
            // If no rows were update, then the booking does not exist or the customer is not the one who made the booking
            const bookingExists = await query(
                'SELECT * FROM bookings WHERE booking_id = ?',
                [bookingId]
            );
            if (!bookingExists || !Array.isArray(bookingExists) || bookingExists.length === 0) {
                return res.status(404).json({ message: 'Booking not found.' });
            } else {
                return res.status(403).json({ message: 'You are not authorized to review this booking.' });

            }
        }

        res.status(200).json({ message: 'Review submitted successfully.', updateResult });
    } catch (error) {
        if (error === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
}  