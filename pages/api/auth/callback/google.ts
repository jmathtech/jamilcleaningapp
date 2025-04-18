// /pages/api/auth/google/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { query } from '../../../../lib/db';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';
import { serialize } from 'cookie';

// Get the Google Client ID and redirect URI from environment variables
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
if (!CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID not defined');
}

const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
if (!CLIENT_SECRET) { 
    throw new Error('GOOGLE_CLIENT_SECRET not defined');
}

// Get the Google Client ID and redirect URI from environment variables
const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL;
if (!REDIRECT_URI) {
    throw new Error('GOOGLE_REDIRECT_URL not defined');
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not defined');
}

// Initialize the OAuth client with all required parameters
const client = new OAuth2Client({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI
});

// Function to query the database
async function findUserByEmail(email: string): Promise<RowDataPacket | null> {
    const result = await query(
        `SELECT customer_id, email, first_name, last_name, phone, address FROM customers WHERE email = ?`,
        [email]
    );
    if (Array.isArray(result) && result.length > 0) {
        return (result as RowDataPacket[])[0];
    }
    return null;
}

// Function to create a JWT
function createJWT(user: RowDataPacket, secretKey: string): string {
    return jwt.sign(
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
}

// Define the handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code as string;
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    // Get the authorization code from the query parameters
    if (!code || typeof code !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid authorization code.' });
    }

    try {
        console.log("Authorization Code:", code);
        // Exchange the authorization code for tokens
        const tokenResponse = await client.getToken(code);
        console.log("Token Response:", tokenResponse);
        const { id_token } = tokenResponse.tokens;
        console.log("ID Token:", id_token);
        // Check if the ID token was received
        if (!id_token) {
            return res.status(401).json({ message: 'No ID token received from Google.' });
        }

        // Verify the ID token
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: CLIENT_ID,
        });

        // Extract user information from the ID token
        console.log("Ticket:", ticket);
        const payload: TokenPayload | undefined = ticket.getPayload();
        if (!payload) {
            return res.status(401).json({ message: 'Invalid ID token.' });
        }
        console.log("Payload:", payload);
        const email = payload.email as string;

        // Look up the user in your database
        console.log("Email:", email);
        const user = await findUserByEmail(email);

        console.log("Query Result:", user);

        // If the user is found in your database
        if (user) {
            // Create a JWT for your application
            const token = createJWT(user, JWT_SECRET as string);

            // Set the JWT as an HTTP-only cookie
            const serialized = serialize('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'strict',
                maxAge: 60 * 60 * 2, // 2 hours
                path: '/',
            });
            res.setHeader('Set-Cookie', serialized);

            // Redirect to /api/verify with the token
            res.redirect(`/api/verify?token=${token}`);
        } else {
            // User not found in your database
            return res.status(401).json({ message: 'User not found. Please sign up with this email first.' });
        }
    } catch (error) {
        console.error('Google authentication failed:', error);
        console.log("Error:", error);
        return res.status(500).json({ message: 'Authentication failed.', error: error instanceof Error ? error.message : "Unknown error" });
    }
}
