# ระบบตรวจผลสลากกาชาด งานเทศกาลปีใหม่สี่เผ่าไทศรีสะเกษ

เว็บแอปพลิเคชันสำหรับประกาศผลและตรวจสลากกาชาดออนไลน์ พร้อมระบบผู้ดูแลระบบสำหรับสุ่มออกรางวัล

## การตั้งค่าและเริ่มต้นใช้งาน

1. ตั้งค่าการเชื่อมต่อฐานข้อมูล MongoDB ในไฟล์ `.env.local`:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/sisaket_redcross_lotto
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=sisaket-red-cross-super-secret-key-2570
   ```

2. สร้างบัญชีผู้ดูแลระบบเริ่มต้น (`admin` / `password1234`):
   ```bash
   npm run seed:admin
   ```

3. รันเซิร์ฟเวอร์สำหรับพัฒนา:
   ```bash
   npm run dev
   ```

## เส้นทางหน้าเว็บ (Routes)
- หน้าหลักสำหรับประชาชนทั่วไป: `http://localhost:3000/`
- หน้าเข้าสู่ระบบผู้ดูแลระบบ: `http://localhost:3000/admin/login`
- หน้าแผงควบคุมการสุ่มรางวัล: `http://localhost:3000/admin/dashboard`

