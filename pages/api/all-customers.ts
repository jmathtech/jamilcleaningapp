import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db";
import { RowDataPacket } from "mysql2";

interface CountResult extends RowDataPacket {
    count: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 1. Check Request Method
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]); // Inform client which methods are allowed
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    try {
        // 2. Fetch customer count from the database
        const results = await query(
            `SELECT COUNT(*) AS count FROM customers`
        ) as CountResult[];

        // 3. Checks to see if results are valid
        if (!results || results.length === 0 || typeof results[0].count !== 'number') {
            console.error('Unexpected result format:', results);
            
        }
        // 4. Extract the count from the results
        const customerCount = results[0].count;

        // 5. Send the response - Matched frontend structure
        // Ensure the response structure matches what the frontend expects
        res.status(200).json({ success: true, customerCount });

    } catch (error) {
        
        // 6. Handle potential database errors
        console.error('API Error fetching customers count:', error);
        const message = error instanceof Error ? error.message : 'Failed to fetch customers count.';
        res.status(500).json({ success: false, message: message});
    }
};