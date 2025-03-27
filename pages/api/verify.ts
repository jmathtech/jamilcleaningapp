import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { query } from "../../lib/db";
import { RowDataPacket } from "mysql2";
import { serialize } from 'cookie';

interface DecodedToken extends JwtPayload {
    customerId: string;
    email: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { token } = req.query;

        if (!token || typeof token !== 'string') {
            console.error("Verification Error: No token provided");
            return res.status(401).json({ success: false, message: "Token is missing or invalid." });
        }

        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            console.error("Verification Error: JWT_SECRET is not defined");
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }

        let decoded: DecodedToken;
        try {
            decoded = jwt.verify(token, secretKey) as DecodedToken;
            console.log("Decoded Token:", decoded);
        } catch (verifyError) {
            console.error("Token Verification Error:", verifyError);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
                error: verifyError instanceof Error ? verifyError.message : "Unknown verification error"
            });
        }

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            console.error("Verification Error: Token expired");
            return res.status(401).json({ success: false, message: "Token has expired." });
        }

        const customerResult = await query(
            "SELECT customer_id FROM customers WHERE email = ?",
            [decoded.email]
        ) as RowDataPacket[];

        if (!customerResult || customerResult.length === 0) {
            console.error(`Verification Error: No customer found for email ${decoded.email}`);
            return res.status(404).json({ success: false, message: "Customer not found." });
        }

        const customerIdFromDb = customerResult[0].customer_id.toString();

        if (customerIdFromDb !== decoded.customerId) {
            console.error("Verification Error: CustomerId mismatch");
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
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 30 * 60,
            })
        );

        // Send the new token in the response
        return res.status(200).json({ success: true, token: newToken });

    } catch (error) {
        console.error("Unexpected Verification Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}
