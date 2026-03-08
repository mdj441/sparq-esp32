import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'user';
      image?: string | null;
    };
  }
  interface User {
    role: 'admin' | 'user';
  }
}
