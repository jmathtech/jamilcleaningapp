// /pages/api/all-reviews.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';
import { RowDataPacket } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Fetch reviews from bookings table
        const results = await query(
            `SELECT 
                b.booking_id, 
                b.review_rating, 
                b.review_comment, 
                b.customer_id, 
                c.name AS customer_name, 
                b.created_at
             FROM bookings b
             JOIN customers c ON b.customer_id = c.customer_id
             WHERE b.review_rating IS NOT NULL 
             ORDER BY b.created_at DESC`
        ) as RowDataPacket[];

        res.status(200).json({ reviews: results });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews.' });
    }
}
