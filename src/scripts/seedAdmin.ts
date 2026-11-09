import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';

// โหลดค่าจาก .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      process.env[key] = val;
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI!;

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('เชื่อมต่อฐานข้อมูล MongoDB Atlas สำเร็จ');

    const username = 'admin';
    const plainPassword = 'password1234';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`มีบัญชีผู้ดูแลระบบ "${username}" อยู่ในระบบแล้ว`);
    } else {
      await Admin.create({
        username,
        password: hashedPassword,
      });
      console.log(`สร้างบัญชีผู้ดูแลระบบสำเร็จ! ชื่อผู้ใช้: ${username} / รหัสผ่าน: ${plainPassword}`);
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการสร้างข้อมูลผู้ดูแลระบบ:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
