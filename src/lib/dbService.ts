import fs from 'fs';
import os from 'os';
import path from 'path';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import { LotteryResult } from '@/models/LotteryResult';
import { SerializedLotteryResult } from '@/components/TicketChecker';

interface LocalAdminRecord {
  _id: string;
  username: string;
  password: string;
}

interface LocalDBStructure {
  admins: LocalAdminRecord[];
  lotteryResults: SerializedLotteryResult[];
}

// บน Vercel Serverless ไฟล์ระบบหลักเป็น Read-only จึงใช้ os.tmpdir() แทนเมื่อรันบน Cloud
const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'lotto-data')
  : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'local-db.json');

/**
 * อ่านข้อมูลจากไฟล์ JSON สำรอง (กรณีไม่ได้เชื่อมต่อ MongoDB)
 */
async function readLocalDB(): Promise<LocalDBStructure> {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const defaultHashedPassword = await bcrypt.hash('password1234', 10);
    const initialData: LocalDBStructure = {
      admins: [
        {
          _id: 'admin-default-001',
          username: 'admin',
          password: defaultHashedPassword,
        },
      ],
      lotteryResults: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(raw) as LocalDBStructure;
}

function writeLocalDB(data: LocalDBStructure) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * ค้นหาผู้ดูแลระบบจากชื่อผู้ใช้ (ใช้ MongoDB เป็นหลัก และสลับไปใช้ Local JSON อัตโนมัติหากยังไม่ได้ตั้งค่า MongoDB)
 */
export async function findAdminByUsername(
  username: string
): Promise<{ _id: string; username: string; password: string } | null> {
  try {
    await connectDB();

    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultHashedPassword = await bcrypt.hash('password1234', 10);
      await Admin.create({
        username: 'admin',
        password: defaultHashedPassword,
      });
    }

    const admin = await Admin.findOne({ username }).lean();
    if (!admin) return null;
    return {
      _id: admin._id.toString(),
      username: admin.username,
      password: admin.password,
    };
  } catch {
    const db = await readLocalDB();
    const found = db.admins.find((a) => a.username === username);
    return found || null;
  }
}

/**
 * ดึงผลรางวัลสลากกาชาดล่าสุด
 */
export async function getLatestLotteryResultFromDB(): Promise<SerializedLotteryResult | null> {
  try {
    await connectDB();
    const latest = await LotteryResult.findOne().sort({ createdAt: -1 }).lean();
    if (!latest) return null;
    return JSON.parse(JSON.stringify(latest));
  } catch {
    const db = await readLocalDB();
    if (db.lotteryResults.length === 0) return null;
    return db.lotteryResults[0];
  }
}

/**
 * บันทึกผลรางวัลสลากกาชาดชุดใหม่
 */
export async function saveLotteryResultToDB(payload: {
  year: string;
  prize1: string[];
  prize2: string[];
  prize3: string[];
  prize4: string[];
  prize5: string[];
  prize6_suffix3: string;
  prize7_adjacent: string[];
}): Promise<SerializedLotteryResult> {
  try {
    await connectDB();
    const created = await LotteryResult.create({
      ...payload,
      createdAt: new Date(),
    });
    return JSON.parse(JSON.stringify(created));
  } catch {
    const db = await readLocalDB();
    const newRecord: SerializedLotteryResult = {
      _id: 'lotto-' + Date.now().toString(),
      ...payload,
      createdAt: new Date().toISOString(),
    };
    db.lotteryResults.unshift(newRecord);
    writeLocalDB(db);
    return newRecord;
  }
}
