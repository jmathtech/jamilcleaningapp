// Example: pages/api/protected.ts
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Continue with your logic
  res.status(200).json({ message: "Authorized", session });
}
