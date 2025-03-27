import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { query } from "../../lib/db";
import { RowDataPacket } from "mysql2";
import { serialize } from 'cookie'; // Import the 'serialize' function

interface DecodedToken extends JwtPayload {
    customerId: number;
    email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { token } = req.query;

        if (!token || typeof token !== 'string') {
            return res.status(401).json({ success: false, message: "Token is missing or invalid." });
        }

        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) throw new Error("JWT_SECRET is not defined in environment variables.");

        const decoded = jwt.verify(token, secretKey) as DecodedToken;

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            return res.status(401).json({ success: false, message: "Token has expired." });
        }

        const customerResult = await query(
            "SELECT customer_id FROM customers WHERE email = ?",
            [decoded.email]
        ) as RowDataPacket[];

        if (!customerResult || customerResult.length === 0) {
            return res.status(404).json({ success: false, message: "Customer not found." });
        }

        const customerIdFromDb = customerResult[0].customer_id;

        if (customerIdFromDb !== decoded.customerId) {
            return res.status(401).json({ success: false, message: "CustomerId mismatch." });
        }

        const newToken = jwt.sign(
            { customerId: decoded.customerId, email: decoded.email },
            secretKey,
            { expiresIn: "30m" }
        );

        // Set the new token as a cookie
        res.setHeader(
            "Set-Cookie",
            serialize('token', newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 30 * 60, // 30 minutes in seconds
            })
        );

        // Redirect to the dashboard
        return res.redirect("/dashboard");

    } catch (error) {
        console.error("Token verification failed:", error);

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ success: false, message: "Token has expired." });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ success: false, message: "Invalid token." });
        }

        return res.status(500).json({ success: false, message: "Internal server error." });
    }
}