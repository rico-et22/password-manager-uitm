import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      firstName: string;
      lastName: string;
    };
  }
  interface User {
    firstName?: string;
    lastName?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    firstName?: string;
    lastName?: string;
  }
}
