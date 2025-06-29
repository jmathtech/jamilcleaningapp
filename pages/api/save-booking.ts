import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { query } from "../../lib/db";
import { RowDataPacket } from "mysql2";

interface DecodedToken extends JwtPayload {
  customerId: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { authorization } = req.headers;

    if (!authorization) {
      console.error("No Authorization header found.")
      return res.status(401).json({ success: false, message: "Unauthorized: Missing authorization header." });
    }

    const tokenFromHeader = authorization.split(" ")[1];
    let decodedToken: DecodedToken;

    try {
      decodedToken = jwt.verify(tokenFromHeader, process.env.JWT_SECRET as string) as DecodedToken;
    } catch (jwtError) {
      console.error("JWT Verification Error:", jwtError);
      return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }

    const customerId = decodedToken.customerId;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is missing from the token.",
      });
    }

    const {
      service_type,
      email,
      hours,
      notes = null,
      date,
      time,
      has_pets = false,
      status = "pending",
      total_price,
    } = req.body;

    // Validate input fields (as an example)
    if (!service_type || typeof service_type !== "string") {
      return res.status(400).json({ success: false, message: "Invalid service type." });
    }

    const parsedHours = Number(hours);
    if (isNaN(parsedHours) || parsedHours <= 0) {
      return res.status(400).json({ success: false, message: "Invalid hours value." });
    }

    const parsedTotalPrice = parseFloat(total_price);
    if (isNaN(parsedTotalPrice) || parsedTotalPrice < 0) {
      return res.status(400).json({ success: false, message: "Invalid total price value." });
    }

    const result = await query(
      `INSERT INTO bookings (
        customer_id, service_type, email, hours, notes, 
        date, time, has_pets, status, total_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        service_type,
        email,
        parsedHours,
        notes,
        date,
        time,
        has_pets,
        status,
        parsedTotalPrice,
      ]
    );

    if (!result || (result as RowDataPacket).affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to save booking to the database.",
      });
    }

    const bookingId = (result as RowDataPacket).insertId;
    const token = jwt.sign({ customerId, bookingId }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });

    return res.status(200).json({
      success: true,
      token,
      bookingId,
      message: "Booking saved successfully!",
    });
  } catch (error) {
    console.error("Booking API error:", error);
    return res.status(500).json({ success: false, message: "Failed to save booking." });
  }
};

export default handler;
