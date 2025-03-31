// /pages/api/auth/google/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { query } from '../../../../lib/db';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
if (!CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID not defined');
}

const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URL; // Rely solely on the environment variable
if (!REDIRECT_URI) {
    throw new Error('GOOGLE_REDIRECT_URL not defined');
}

// Initialize the OAuth client with all required parameters
const client = new OAuth2Client({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI // Pass the redirectUri here
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { code } = req.query;

    if (!code || typeof code !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid authorization code.' });
    }

    try {
        // Exchange the authorization code for tokens
        const tokenResponse = await client.getToken(code);
        const { id_token } = tokenResponse.tokens;

        if (!id_token) {
            return res.status(401).json({ message: 'No ID token received from Google.' });
        }

        // Verify the ID token
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: CLIENT_ID,
        });

        const payload: TokenPayload | undefined = ticket.getPayload();
        if (!payload) {
            return res.status(401).json({ message: 'Invalid ID token.' });
        }

        const googleEmail = payload.email as string;

        // Look up the user in your database
        const result = await query(
            `SELECT customer_id, email, first_name, last_name, phone, address FROM customers WHERE email = ?`,
            [googleEmail]
        );

        if (Array.isArray(result) && result.length > 0) {
            const user = (result as RowDataPacket[])[0];

            const secretKey = process.env.JWT_SECRET;
            if (!secretKey) throw new Error('JWT_SECRET not defined');

            // Create a JWT for your application
            const token = jwt.sign(
                {
                    customerId: user.customer_id.toString(),
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    phone: user.phone,
                    address: user.address,
                },
                secretKey,
                { expiresIn: '2h' }
            );

            // Redirect to /api/verify with the token
            res.redirect(`/api/verify?token=${token}`);
        } else {
            // User not found in your database
            return res.status(404).json({ message: 'User not found. Please sign up with this email first.' });
        }
    } catch (error) {
        console.error('Google authentication failed:', error);
        return res.status(500).json({ message: 'Authentication failed.', error: error instanceof Error ? error.message : "Unknown error" });
    }
}
