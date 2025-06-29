import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { query } from "../../lib/db";
import { RowDataPacket } from "mysql2";

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
          b.booking_id DESC 
        LIMIT 1`,
      [customerId]
    );

    console.log("Latest booking from database:", result);

    if (Array.isArray(result) && result.length === 0) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    } else {
      return res.status(200).json({ success: true, bookingData: ( result as RowDataPacket[] )[0] });
    }
  } catch (error) {
    console.error("Get Latest Booking API error:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve latest booking." });
  }
};

export default handler;