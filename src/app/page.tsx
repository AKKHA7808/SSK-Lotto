import React from 'react';
import Link from 'next/link';
import { getLatestLotteryResultFromDB } from '@/lib/dbService';
import TicketChecker from '@/components/TicketChecker';
import PrizeSlideshow from '@/components/PrizeSlideshow';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const result = await getLatestLotteryResultFromDB();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ส่วนหัวเว็บไซต์ (Header Banner) */}
      <header className="bg-gradient-to-br from-red-800 via-red-700 to-amber-800 text-white pt-10 pb-16 px-4 shadow-lg">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-amber-300/40 text-amber-200 text-sm font-medium mb-4">
            <span>✚ สภากาชาดไทย จังหวัดศรีสะเกษ</span>
            {result?.year && <span>• ประจำปี พ.ศ. {result.year}</span>}
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            ประกาศผลการออกสลากกาชาด
            <span className="block text-amber-300 mt-1">
              งานเทศกาลปีใหม่สี่เผ่าไทศรีสะเกษ
            </span>
          </h1>
          {result?.createdAt && (
            <p className="text-red-100 text-sm mt-3">
              ข้อมูลอัปเดตล่าสุดเมื่อ:{' '}
              {new Date(result.createdAt).toLocaleString('th-TH', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}{' '}
              น.
            </p>
          )}
        </div>
      </header>

      {/* ส่วนระบบตรวจสลาก (อยู่ด้านบนสุดของเนื้อหา) และสไลด์โชว์ประกาศผลรางวัล */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pb-16">
        <TicketChecker result={result} />

        {!result ? (
          <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-xl font-bold text-gray-700 mb-2">
              ยังไม่มีการประกาศผลรางวัลสลากกาชาดในขณะนี้
            </p>
            <p className="text-gray-500 text-sm">
              กรุณารอการประมวลผลและออกรางวัลจากผู้ดูแลระบบ
            </p>
          </div>
        ) : (
          <PrizeSlideshow result={result} />
        )}
      </main>

      {/* ส่วนท้ายเว็บไซต์ (Footer) */}
      <footer className="bg-white border-t border-gray-200 py-6 px-4 text-center text-sm text-gray-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>งานเทศกาลปีใหม่สี่เผ่าไทศรีสะเกษ • สำนักงานเหล่ากาชาดจังหวัดศรีสะเกษ</p>
          <Link
            href="/admin/dashboard"
            className="text-gray-400 hover:text-red-700 transition font-medium"
          >
            สำหรับผู้ดูแลระบบ
          </Link>
        </div>
      </footer>
    </div>
  );
}
