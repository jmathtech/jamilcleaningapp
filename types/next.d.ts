// types/next.d.ts
import { NextApiRequest } from 'next';

  interface UserPayload {
          
      customerId: string;
      bookingId: string;
        
  }

  declare module 'next-auth' {
    interface Session {
      user: {
        id: string;
        name?: string;
        email?: string;
        image?: string;
      };
    }
  }
