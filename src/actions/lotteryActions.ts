'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { saveLotteryResultToDB } from '@/lib/dbService';

/**
 * แปลงตัวเลขเป็น String 5 หลัก เติม 0 ด้านหน้า (00000 - 99999)
 */
function format5Digits(num: number): string {
  return num.toString().padStart(5, '0');
}

/**
 * แปลงตัวเลขเป็น String 3 หลัก เติม 0 ด้านหน้า (000 - 999)
 */
function format3Digits(num: number): string {
  return num.toString().padStart(3, '0');
}

/**
 * คำนวณเลขข้างเคียงรางวัลที่ 1 (+1 และ -1) โดยรองรับกรณี 00000 และ 99999 แบบ Wrap-around
 */
function getAdjacentNumbers(fiveDigitStr: string): [string, string] {
  const num = parseInt(fiveDigitStr, 10);
  const prev = num === 0 ? 99999 : num - 1;
  const next = num === 99999 ? 0 : num + 1;
  return [format5Digits(prev), format5Digits(next)];
}

export async function drawLotteryAction(year: string = '2570') {
  // 1. ตรวจสอบสิทธิ์ผู้ดูแลระบบด้วย NextAuth
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: 'ไม่มีสิทธิ์เข้าถึง กรุณาเข้าสู่ระบบผู้ดูแลระบบก่อนทำรายการ',
    };
  }

  try {
    // 2. สุ่มตัวเลข 5 หลักที่ไม่ซ้ำกันเลยสำหรับ รางวัลที่ 1 ถึง รางวัลที่ 5
    // จำนวนรวม: รางวัลที่ 1 (2) + รางวัลที่ 2 (3) + รางวัลที่ 3 (3) + รางวัลที่ 4 (5) + รางวัลที่ 5 (10) = 23 รางวัล
    const totalUniquePrizes = 2 + 3 + 3 + 5 + 10;
    const uniqueNumbers = new Set<string>();

    while (uniqueNumbers.size < totalUniquePrizes) {
      const randomNum = Math.floor(Math.random() * 100000); // 0 ถึง 99999
      uniqueNumbers.add(format5Digits(randomNum));
    }

    const drawnArray = Array.from(uniqueNumbers);

    const prize1 = drawnArray.slice(0, 2);
    const prize2 = drawnArray.slice(2, 5);
    const prize3 = drawnArray.slice(5, 8);
    const prize4 = drawnArray.slice(8, 13);
    const prize5 = drawnArray.slice(13, 23);

    // 3. สุ่มรางวัลเลขท้าย 3 ตัว (000 - 999) เพียง 1 ชุดตัวเลข
    const randomSuffix3 = Math.floor(Math.random() * 1000);
    const prize6_suffix3 = format3Digits(randomSuffix3);

    // 4. คำนวณรางวัลข้างเคียงรางวัลที่ 1 จาก prize1 ทั้ง 2 รางวัล (รวม 4 รางวัล)
    const [adj1_prev, adj1_next] = getAdjacentNumbers(prize1[0]);
    const [adj2_prev, adj2_next] = getAdjacentNumbers(prize1[1]);
    const prize7_adjacent = [adj1_prev, adj1_next, adj2_prev, adj2_next];

    // 5. บันทึกลงฐานข้อมูล MongoDB (พร้อมระบบสำรองข้อมูลอัตโนมัติ)
    const newResult = await saveLotteryResultToDB({
      year,
      prize1,
      prize2,
      prize3,
      prize4,
      prize5,
      prize6_suffix3,
      prize7_adjacent,
    });

    // 6. ล้างแคชหน้าหลักเพื่อให้ฝั่งผู้ใช้งานอัปเดตทันที
    revalidatePath('/');
    revalidatePath('/admin/dashboard');

    return {
      success: true,
      message: 'สุ่มและบันทึกผลรางวัลสลากกาชาดประจำปี พ.ศ. ' + year + ' สำเร็จเรียบร้อยแล้ว!',
      data: newResult,
    };
  } catch (error) {
    console.error('Error drawing lottery:', error);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการสุ่มผลรางวัล กรุณาลองใหม่อีกครั้ง',
    };
  }
}

