// /pages/api/bookings/[bookingId].ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { query } from "../../../lib/db";

interface DecodedToken extends JwtPayload {
    customerId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { authorization } = req.headers;
        const { bookingId } = req.query;

        if (!authorization) {
            return res.status(401).json({ success: false, message: "Authorization token required." });
        }

        if (!bookingId || typeof bookingId !== 'string') {
            return res.status(400).json({ success: false, message: "Booking ID is required." });
        }

        const token = authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Invalid authorization format." });
        }

        let decoded: DecodedToken;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        } catch (error) {
            console.error("JWT Verification Error:", error);
            return res.status(401).json({ success: false, message: "Invalid or expired token." });
        }

        const { customerId } = decoded;

        if (!customerId) {
            return res.status(400).json({ success: false, message: "Customer ID not found in token." });
        }

        const result = await query(
            `SELECT * FROM bookings WHERE booking_id = ? AND customer_id = ?`,
            [bookingId, customerId]
        );

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        return res.status(200).json(result[0]); 
    } catch (error) {
        console.error("Get Booking by ID API error:", error);
        return res.status(500).json({ success: false, message: "Failed to retrieve booking." });
    }
}