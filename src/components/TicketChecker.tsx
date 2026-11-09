'use client';

import React, { useState } from 'react';

export interface SerializedLotteryResult {
  _id: string;
  year: string;
  prize1: string[];
  prize2: string[];
  prize3: string[];
  prize4: string[];
  prize5: string[];
  prize6_suffix3: string;
  prize7_adjacent: string[];
  createdAt: string;
}

interface TicketCheckerProps {
  result: SerializedLotteryResult | null;
}

export default function TicketChecker({ result }: TicketCheckerProps) {
  const [ticketNumber, setTicketNumber] = useState('');
  const [inputError, setInputError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wonPrizes, setWonPrizes] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // รับเฉพาะตัวเลข ไม่เกิน 5 หลัก
    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 5);
    setTicketNumber(onlyDigits);
    if (inputError) setInputError('');
  };

  const handleCheckTicket = (e: React.FormEvent) => {
    e.preventDefault();

    if (!result) {
      setInputError('ยังไม่มีข้อมูลการออกรางวัลในระบบ');
      return;
    }

    if (ticketNumber.length !== 5) {
      setInputError('กรุณากรอกหมายเลขสลากให้ครบ 5 หลัก (เช่น 01234)');
      return;
    }

    const matchedPrizes: string[] = [];

    if (result.prize1.includes(ticketNumber)) {
      matchedPrizes.push('รางวัลที่ 1');
    }
    if (result.prize7_adjacent.includes(ticketNumber)) {
      matchedPrizes.push('รางวัลข้างเคียงรางวัลที่ 1');
    }
    if (result.prize2.includes(ticketNumber)) {
      matchedPrizes.push('รางวัลที่ 2');
    }
    if (result.prize3.includes(ticketNumber)) {
      matchedPrizes.push('รางวัลที่ 3');
    }
    if (result.prize4.includes(ticketNumber)) {
      matchedPrizes.push('รางวัลที่ 4');
    }
    if (result.prize5.includes(ticketNumber)) {
      matchedPrizes.push('รางวัลที่ 5');
    }

    // ตรวจสอบรางวัลเลขท้าย 3 ตัว (รางวัลที่ 6)
    const last3Digits = ticketNumber.slice(-3);
    if (last3Digits === result.prize6_suffix3) {
      matchedPrizes.push('รางวัลเลขท้าย 3 ตัว (รางวัลที่ 6)');
    }

    setWonPrizes(matchedPrizes);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6 md:p-8 max-w-2xl mx-auto -mt-8 relative z-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-2">
          ระบบตรวจผลสลากกาชาดด่วน
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          กรอกหมายเลขสลากกาชาด 5 หลักของท่านเพื่อตรวจสอบรางวัลทั้งหมดทันที
        </p>

        <form onSubmit={handleCheckTicket} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={ticketNumber}
              onChange={handleInputChange}
              placeholder="กรอกเลขสลาก 5 หลัก (00000 - 99999)"
              className="w-full px-5 py-4 text-center sm:text-left text-xl font-mono font-bold tracking-widest rounded-xl border-2 border-gray-200 focus:border-red-600 focus:ring-4 focus:ring-red-100 outline-none transition text-gray-900 placeholder:text-sm placeholder:font-sans placeholder:tracking-normal placeholder:font-normal"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg shadow-lg shadow-red-600/25 transition shrink-0"
          >
            ตรวจสลาก
          </button>
        </form>

        {inputError && (
          <p className="text-red-600 text-sm font-medium mt-3 text-center sm:text-left">
            {inputError}
          </p>
        )}
      </div>

      {/* Modal แสดงผลการตรวจสลาก */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 font-mono font-bold text-lg tracking-widest">
                หมายเลขสลาก: {ticketNumber}
              </span>
            </div>

            {wonPrizes.length > 0 ? (
              <>
                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
                  🎉
                </div>
                <h3 className="text-2xl font-extrabold text-green-700 mb-2">
                  ขอแสดงความยินดีด้วย!
                </h3>
                <p className="text-gray-600 mb-4">สลากหมายเลขนี้ถูกรางวัลดังต่อไปนี้:</p>
                <div className="space-y-2 mb-6">
                  {wonPrizes.map((prize, idx) => (
                    <div
                      key={idx}
                      className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300 text-red-800 font-bold text-lg shadow-sm"
                    >
                      🏆 {prize}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mx-auto mb-4 text-4xl">
                  🙏
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  เสียใจด้วย คุณไม่ถูกรางวัล
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  ขอขอบคุณที่ร่วมทำบุญกุศลกับสภากาชาดไทย ในงานเทศกาลปีใหม่สี่เผ่าไทศรีสะเกษ
                </p>
              </>
            )}

            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold transition"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </>
  );
}

