// file: ~/next-auth.d.ts
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /* Returned by `useAuth`, `getSession` and `getServerSession` */
  interface User {
    role: 'admin' | 'manager' | 'user';  // 为 User 添加 role 字段
  }
  
  interface Session extends DefaultSession {
    user: {
      name: string
      avatar: string
      role: 'admin' | 'manager' | 'user'
      email: string
    }
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken` */
  interface JWT {
    sessionToken?: string
  }
}