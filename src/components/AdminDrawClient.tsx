'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { drawLotteryAction } from '@/actions/lotteryActions';
import { SerializedLotteryResult } from '@/components/TicketChecker';

interface AdminDrawClientProps {
  initialResult: SerializedLotteryResult | null;
  adminName?: string | null;
}

export default function AdminDrawClient({
  initialResult,
  adminName,
}: AdminDrawClientProps) {
  const [isPending, startTransition] = useTransition();
  const [year, setYear] = useState(initialResult?.year || '2570');
  const [latestResult, setLatestResult] = useState<SerializedLotteryResult | null>(
    initialResult
  );
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4500);
  };

  const handleDrawLottery = () => {
    startTransition(async () => {
      const response = await drawLotteryAction(year);
      if (response.success && response.data) {
        setLatestResult(response.data);
        showToast('success', response.message);
      } else {
        showToast('error', response.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* แถบแจ้งเตือน Toast มุมขวาบน */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 font-semibold ${
              toast.type === 'success'
                ? 'bg-green-700 text-white border-green-500'
                : 'bg-red-700 text-white border-red-500'
            }`}
          >
            <span className="text-xl">{toast.type === 'success' ? '✅' : '⚠️'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* แถบเมนูผู้ดูแลระบบ */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              แผงควบคุมการออกรางวัลสลากกาชาด
            </h1>
            <p className="text-xs text-gray-500">
              งานเทศกาลปีใหม่สี่เผ่าไทศรีสะเกษ • ผู้ดูแลระบบ: {adminName || 'แอดมิน'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition"
            >
              ดูหน้าเว็บไซต์หลัก
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      {/* กล่องควบคุมการสุ่มรางวัล */}
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
            ดำเนินการสุ่มรางวัลสลากกาชาดประจำปี
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mb-6">
            ระบบจะทำการสุ่มหมายเลขสลากจากทั้งหมด 100,000 ฉบับ (00000 ถึง 99999)
            โดยป้องกันไม่ให้หมายเลขรางวัลที่ 1 ถึงรางวัลที่ 5 ซ้ำกัน พร้อมคำนวณเลขข้างเคียงรางวัลที่ 1 อัตโนมัติ
          </p>

          <div className="max-w-xs mx-auto mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ปี พ.ศ. ที่ออกรางวัล
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={isPending}
              className="w-full px-4 py-2.5 text-center font-bold text-lg rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none text-gray-900"
            />
          </div>

          <button
            type="button"
            onClick={handleDrawLottery}
            disabled={isPending}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-lg shadow-xl shadow-red-600/30 transition inline-flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>กำลังประมวลผลสุ่มรางวัล...</span>
              </>
            ) : (
              <span>🎲 เริ่มสุ่มรางวัลใหม่</span>
            )}
          </button>
        </div>

        {/* แสดงผลรางวัลล่าสุดที่อยู่ในระบบ */}
        {latestResult && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                ผลรางวัลล่าสุดในฐานข้อมูล (ประจำปี พ.ศ. {latestResult.year})
              </h3>
              <span className="text-xs text-gray-500">
                บันทึกเมื่อ:{' '}
                {new Date(latestResult.createdAt).toLocaleString('th-TH', {
                  dateStyle: 'medium',
                  timeStyle: 'medium',
                })}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <p className="font-bold text-red-800 mb-2">รางวัลที่ 1 (2 รางวัล):</p>
                <p className="font-mono text-2xl font-black text-red-700 tracking-widest">
                  {latestResult.prize1.join(' , ')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                <p className="font-bold text-red-800 mb-2">
                  รางวัลเลขท้าย 3 ตัว (รางวัลที่ 6):
                </p>
                <p className="font-mono text-2xl font-black text-red-700 tracking-widest">
                  {latestResult.prize6_suffix3}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 md:col-span-2">
                <p className="font-bold text-gray-700 mb-1">
                  รางวัลข้างเคียงรางวัลที่ 1 (4 รางวัล):
                </p>
                <p className="font-mono text-lg font-bold text-gray-900">
                  {latestResult.prize7_adjacent.join(' , ')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-gray-700 mb-1">รางวัลที่ 2 (3 รางวัล):</p>
                <p className="font-mono text-lg font-bold text-gray-900">
                  {latestResult.prize2.join(' , ')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-gray-700 mb-1">รางวัลที่ 3 (3 รางวัล):</p>
                <p className="font-mono text-lg font-bold text-gray-900">
                  {latestResult.prize3.join(' , ')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 md:col-span-2">
                <p className="font-bold text-gray-700 mb-1">รางวัลที่ 4 (5 รางวัล):</p>
                <p className="font-mono text-lg font-bold text-gray-900">
                  {latestResult.prize4.join(' , ')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 md:col-span-2">
                <p className="font-bold text-gray-700 mb-1">รางวัลที่ 5 (10 รางวัล):</p>
                <p className="font-mono text-lg font-bold text-gray-900">
                  {latestResult.prize5.join(' , ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

