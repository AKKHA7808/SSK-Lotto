import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { findAdminByUsername } from '@/lib/dbService';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'ชื่อผู้ใช้งาน', type: 'text' },
        password: { label: 'รหัสผ่าน', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('กรุณากรอกชื่อผู้ใช้งานและรหัสผ่านให้ครบถ้วน');
        }

        const admin = await findAdminByUsername(credentials.username);
        if (!admin) {
          throw new Error('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, admin.password);
        if (!isValidPassword) {
          throw new Error('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
        }

        return {
          id: admin._id.toString(),
          name: admin.username,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 ชั่วโมง
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

