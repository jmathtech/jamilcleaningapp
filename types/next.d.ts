// types/next.d.ts
 export interface UserPayload {
          
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
