// /workspaces/jamilcleaningapp/jamilcleaningapp/pages/api/all-bookings.ts
import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db"; // Adjust path if necessary
import { RowDataPacket } from "mysql2";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // 1. Check if the request method is GET
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]); // Inform the client which methods are allowed
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    // 2. Construct the SQL query to fetch all bookings and join with customer names
    const sqlQuery = `
      SELECT 
        b.*, 
        c.first_name AS customer_first_name,
        c.last_name AS customer_last_name,
        c.email AS customer_email,
        c.phone AS customer_phone,
        c.address AS customer_address

      FROM 
        bookings b
      JOIN 
        customers c ON b.customer_id = c.customer_id 
      ORDER BY 
        b.created_at DESC`; // Order by creation date, newest first

    // 3. Execute the query
    const results = await query(sqlQuery) as RowDataPacket[];

    // 4. Log the fetched data (optional, for debugging)
    console.log("Fetched all bookings from database:", results.length, "records");

    // 5. Return the results
    // No check for empty results needed here, an empty array is a valid response if there are no bookings
    return res.status(200).json({ success: true, bookings: results });

  } catch (error) {
    // 6. Handle potential errors during database query
    console.error("Get All Bookings API error:", error);
    // Provide a generic error message to the client
    return res.status(500).json({ success: false, message: "Failed to retrieve bookings." });
  }
};

export default handler;
