// /pages/api/update-booking.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from "jsonwebtoken";
import { query } from '../../lib/db';

interface DecodedToken extends JwtPayload {
    customerId: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        // Validate Content-Type
        if (!req.headers['content-type']?.includes('application/json')) {
            return res.status(400).json({ message: "Content-Type must be application/json" });
        }

        // Parse JSON body
        let body;
        try {
            body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        } catch (parseError) {
            return res.status(400).json({ message: 'Invalid JSON in request body' });
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

        const customerId = decodedToken.customerId;
        const { bookingId, date, time } = req.body;

        // Validate request body
        if (!bookingId || !date || !time) {
            return res.status(400).json({ message: 'Missing bookingId, date, or time' });
        }

        // Verify booking ownership
        const bookingCheckResult = await query(
            'SELECT customer_id FROM bookings WHERE booking_id = ?',
            [bookingId]
        );

        if (!bookingCheckResult?.length) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        if (bookingCheckResult[0].customer_id !== customerId) {
            return res.status(403).json({ message: 'Forbidden: Booking does not belong to the customer.' });
        }

        // Update booking
        const result = await query(
            'UPDATE bookings SET date = ?, time = ? WHERE booking_id = ?',
            [date, time, bookingId]
        );

        if (!result?.affectedRows) {
            return res.status(500).json({
                message: "Failed to update booking to the database.",
            });
        }

        return res.status(200).json({ message: 'Booking updated successfully' });

    } catch (error) {
        console.error('Error updating booking:', error);

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        return res.status(500).json({ message: 'Internal Server Error' });
    }
}