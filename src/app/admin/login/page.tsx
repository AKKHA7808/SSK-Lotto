'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg(res.error);
        setLoading(false);
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch {
      setErrorMsg('เกิดข้อผิดพลาดในการเชื่อมต่อระบบ กรุณาลองใหม่อีกครั้ง');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-amber-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-200">
        {/* ส่วนหัวการ์ด */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 px-6 py-8 text-center text-white">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-300">
            <span className="text-3xl font-bold text-amber-300">✚</span>
          </div>
          <h1 className="text-2xl font-bold tracking-wide">เข้าสู่ระบบผู้ดูแลระบบ</h1>
          <p className="text-red-100 text-sm mt-1">
            ระบบออกรางวัลสลากกาชาด งานเทศกาลปีใหม่สี่เผ่าไทศรีสะเกษ
          </p>
        </div>

        {/* ฟอร์มล็อกอิน */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-4 rounded-md text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              ชื่อผู้ใช้งาน
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="กรอกชื่อผู้ใช้งานผู้ดูแลระบบ"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition text-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่าน"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                <span>กำลังตรวจสอบข้อมูล...</span>
              </>
            ) : (
              <span>เข้าสู่ระบบ</span>
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-red-600 transition font-medium"
            >
              ← กลับสู่หน้าตรวจผลสลากกาชาด
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

