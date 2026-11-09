'use server';

import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Admin } from '@/models/Admin';

export async function createAdminAction(username: string, plainPassword: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: 'ไม่มีสิทธิ์เข้าถึง กรุณาเข้าสู่ระบบผู้ดูแลระบบก่อนทำรายการ',
    };
  }

  const trimmedUsername = username.trim();

  if (!trimmedUsername || trimmedUsername.length < 3) {
    return {
      success: false,
      message: 'ชื่อผู้ใช้งานต้องมีความยาวอย่างน้อย 3 ตัวอักษร',
    };
  }

  if (!plainPassword || plainPassword.length < 6) {
    return {
      success: false,
      message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร',
    };
  }

  try {
    await connectDB();

    const existing = await Admin.findOne({ username: trimmedUsername });
    if (existing) {
      return {
        success: false,
        message: `ชื่อผู้ใช้งาน "${trimmedUsername}" มีอยู่ในระบบแล้ว`,
      };
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await Admin.create({
      username: trimmedUsername,
      password: hashedPassword,
    });

    return {
      success: true,
      message: `สร้างบัญชีผู้ดูแลระบบ "${trimmedUsername}" สำเร็จเรียบร้อยแล้ว!`,
    };
  } catch (error) {
    console.error('Error creating admin:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างบัญชีผู้ดูแลระบบ กรุณาลองใหม่อีกครั้ง',
    };
  }
}
