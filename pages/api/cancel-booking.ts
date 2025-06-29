import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

interface DecodedToken extends JwtPayload {
  customerId: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

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
  console.log("Customer ID from Token:", customerId);

  try {
    const { bookingId } = req.query;
    if (!bookingId || typeof bookingId !== "string") {
      return res.status(400).json({ success: false, message: "Booking ID must be a valid string." });
    }

    // Execute the query and handle the result
    const result = await query(
      `DELETE FROM bookings WHERE booking_id = ? AND customer_id = ?`,
      [bookingId, customerId]
    ) as RowDataPacket[];

    // Ensure result is properly validated
    if (!result) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if ('affectedRows' in result && result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    return res.status(200).json({ success: true, message: "Booking canceled successfully." });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
  }
};

export default handler;
