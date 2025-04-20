// /workspaces/jamilcleaningapp/jamilcleaningapp/pages/api/update-booking-status.ts
import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db"; // Adjust path if necessary based on your project structure
import { RowDataPacket } from "mysql2"; // Import OkPacket for type checking update results
// import jwt from 'jsonwebtoken'; // Import JWT library for token verification

// Define allowed statuses server-side for validation
// Ensure this matches the STATUS_OPTIONS in your frontend
const ALLOWED_STATUSES: string[] = ['pending', 'confirmed', 'in progress', 'completed']; // Add/remove as needed

// Define the expected request body structure for type safety
interface UpdateStatusRequestBody {
    bookingId?: string;
    newStatus?: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // 1. Check Request Method
    if (req.method !== "PUT") {
        res.setHeader("Allow", ["PUT"]); // Inform client which methods are allowed
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    // --- 2. IMPORTANT: Authentication & Authorization ---
    // This endpoint modifies data and MUST be protected.
    // Implement logic here to verify if the request comes from an authenticated admin user.
    // This could involve checking a session cookie, validating a JWT token, etc.
    // Example (pseudo-code - replace with your actual auth logic):
    /*
    const session = await getSession({ req }); // Example using next-auth
    if (!session || !session.user?.isAdmin) { // Check if user is logged in and is an admin
       return res.status(403).json({ success: false, message: "Forbidden: Admin access required." });
    }
    */
    // If you're using JWT tokens passed in the Authorization header:

/*  const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Authorization token required." });
    }
    try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET); // Use a specific admin secret
        if (!decoded.isAdmin) { // Check for an admin claim in the token
            throw new Error('Not an admin');
        }
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ success: false, message: "Invalid or expired token, or insufficient permissions." });
    }

    // --- End Authentication Check ---
*/

    // 3. Get Data from Request Body
    const { bookingId, newStatus }: UpdateStatusRequestBody = req.body;

    // 4. Validate Input Data
    if (typeof bookingId !== 'number' || !Number.isInteger(bookingId) || bookingId <= 0) {
        return res.status(400).json({ success: false, message: "Invalid or missing 'bookingId'. It must be a positive integer." });
    }
    if (typeof newStatus !== 'string' || !newStatus) {
        return res.status(400).json({ success: false, message: "Invalid or missing 'newStatus'. It must be a non-empty string." });
    }
    if (!ALLOWED_STATUSES.includes(newStatus)) {
        return res.status(400).json({ success: false, message: `Invalid status value: '${newStatus}'. Allowed statuses are: ${ALLOWED_STATUSES.join(', ')}.` });
    }

    // 5. Perform Database Update
    try {
        const sqlQuery = `
      UPDATE bookings
      SET status = ?
      WHERE booking_id = ?`;

        // Execute the query with parameters to prevent SQL injection
        const result = await query(sqlQuery, [newStatus, bookingId]) as RowDataPacket;

        // Check if any row was actually updated by the query
        if (result.affectedRows === 0) {
            // If no rows were affected, it means the booking_id was not found
            return res.status(404).json({ success: false, message: `Booking with ID ${bookingId} not found.` });
        }

        // 6. Send Success Response
        console.log(`Admin action: Successfully updated status for booking ID ${bookingId} to ${newStatus}`);
        return res.status(200).json({ success: true, message: "Booking status updated successfully." });

    } catch (error) {
        // 7. Handle Database or Other Errors
        console.error("API Error updating booking status:", error);
        // Provide a generic error message to the client for security
        return res.status(500).json({ success: false, message: "Failed to update booking status due to a server error." });
    }
};

export default handler;
