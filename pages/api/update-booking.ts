// /pages/api/update-booking.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from "jsonwebtoken";
import { query } from '../../lib/db';
import { RowDataPacket } from 'mysql2';

interface DecodedToken extends JwtPayload {
    customerId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    // Check for Authorization header
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Unauthorized: Missing authorization header' });
    }
    try {
        // Validate Content-Type
        if (!req.headers['content-type']?.includes('application/json')) {
            return res.status(400).json({ message: "Content-Type must be application/json" });
        }

        // Parse JSON body from request body
        let body;
        try {
            body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(400).json({ message: 'Invalid JSON in request body', body });
        }

        const { authorization } = req.headers;

        // Validate Authorization header
        if (!authorization) {
            console.error("No Authorization header found.");
            return res.status(401).json({ message: "Unauthorized: Missing authorization header." });
        }

        const tokenFromHeader = authorization.split(" ")[1];

        // Verify JWT token
        let decodedToken: DecodedToken;
        try {
            decodedToken = jwt.verify(tokenFromHeader, process.env.JWT_SECRET as string) as DecodedToken;
        } catch (jwtError) {
            console.error("JWT Verification Error:", jwtError);
            return res.status(401).json({ message: "Invalid or expired token." });
        }
        // Extract customer ID from token
        const customerId = decodedToken.customerId;
        const { bookingId, date, time } = req.body;

        // Validate request body
        if (!bookingId || !date || !time) {
            return res.status(400).json({ message: 'Missing bookingId, date, or time' });
        }

        // Debugging logs
        console.log('req.body', req.body);
        console.log('date', date);
        console.log('time', time);
        console.log('bookingId', bookingId);
        console.log('customerId', customerId);
        console.log('decodedToken', decodedToken);
        console.log('tokenFromHeader', tokenFromHeader);
        console.log('authorization', authorization);

        // Verify booking ownership
        const bookingCheckResult = await query(
            'SELECT customer_id FROM bookings WHERE booking_id = ?',
            [bookingId]
        );

        // Check if the booking exists
        if (Array.isArray(bookingCheckResult) && !bookingCheckResult.length) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        // Check if the booking belongs to the customer
        if (Array.isArray(bookingCheckResult) && bookingCheckResult[0].customer_id.toString() !== customerId) {
            return res.status(403).json({ message: 'Forbidden: Booking does not belong to the customer.' });
        }

        // Update booking
        const result = await query(
            'UPDATE bookings SET date = ?, time = ? WHERE booking_id = ?',
            [date, time, bookingId]
        ) as RowDataPacket[];

        // Failed to update entry
        if (!result) {
            return res.status(500).json({
                message: "Failed to update booking to the database.",
            });
        }
        // Successful update
        return res.status(200).json({ message: 'Booking updated successfully' });

    } catch (error) {
        console.error('Error updating booking:', error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        } else {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}