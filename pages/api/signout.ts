import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Clear the token cookie
    res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0;');

    // Redirect to the index page
    res.writeHead(302, { Location: '/' });
    res.end();

  } catch (error) {
    console.error('Sign out error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}