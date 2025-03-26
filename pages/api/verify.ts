import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  customerId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
     // Extract token from query parameters
     const { token } = req.query;

     if (!token || typeof token !== 'string') {
       return res.status(401).json({ success: false, message: "Token is missing or invalid." });
     }

    // Verify the token
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) throw new Error("JWT_SECRET is not defined in environment variables.");

    const decoded = jwt.verify(token, secretKey) as DecodedToken;

    // Generate a new token with an extended expiration
    const newToken = jwt.sign({ customerId: decoded.customerId }, secretKey, { expiresIn: "30m" });

     // Send the new token back in the response
     return res.status(200).json({ success: true, token: newToken });
    } catch (error) {
      console.error("Token verification failed:", error);

    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ success: false, message: "Token has expired." });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    // Handle generic errors
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}
