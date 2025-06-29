import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { query } from "../../lib/db";

interface DecodedToken extends JwtPayload {
  customerId: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ success: false, message: "Authorization token required." });
    }

    const token = authorization.split(" ")[1]; // Extract token from "Bearer <token>"
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
      `SELECT 
         b.*, 
         c.customer_id 
       FROM 
         bookings b
       JOIN 
         customers c ON b.customer_id = c.customer_id 
       WHERE 
         b.customer_id = ? 
       ORDER BY 
         b.date DESC`, 
      [customerId] 
    ); 

    console.log("Data from database:", result); 

    return res.status(200).json({ success: true, bookings: result }); 

  } catch (error) { 
    console.error("Get Booking API error:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve bookings." });
  }
};

export default handler;