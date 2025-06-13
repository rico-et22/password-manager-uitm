import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: number;
      firstName: string;
      lastName: string;
    };
  }
  interface User {
    id?: number;
    firstName?: string;
    lastName?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: number;
    firstName?: string;
    lastName?: string;
  }
}
