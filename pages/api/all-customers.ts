import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db";
import { RowDataPacket } from "mysql2";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 1. Check Request Method
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]); // Inform client which methods are allowed
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    try {
        const results = await query(
            `SELECT 
                c*
                FROM customers c
                ORDER BY c.customer_id DESC`
        ) as RowDataPacket[];

        res.status(200).json({ customers: results });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Failed to fetch customers.' });
    }
};