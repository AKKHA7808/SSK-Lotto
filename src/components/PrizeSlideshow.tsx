'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SerializedLotteryResult } from '@/components/TicketChecker';

interface PrizeSlideshowProps {
  result: SerializedLotteryResult;
}

interface SlideItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  numbers: string[];
  theme: 'gold' | 'red' | 'amber' | 'slate';
  isThreeDigit?: boolean;
}

function sortAscending(numbers: string[]): string[] {
  return [...numbers].sort((a, b) => a.localeCompare(b));
}

export default function PrizeSlideshow({ result }: PrizeSlideshowProps) {
  const slides: SlideItem[] = [
    {
      id: 'prize1',
      badge: '🏆 รางวัลใหญ่ประจำปี',
      title: 'รางวัลที่ 1',
      subtitle: 'มีจำนวน 2 รางวัล (หมายเลขละ 5 หลัก)',
      numbers: sortAscending(result.prize1),
      theme: 'gold',
    },
    {
      id: 'prize7_adjacent',
      badge: '✨ รางวัลพิเศษ',
      title: 'รางวัลข้างเคียงรางวัลที่ 1',
      subtitle: 'มีจำนวน 4 รางวัล (ตัวเลขใกล้เคียงรางวัลที่ 1)',
      numbers: sortAscending(result.prize7_adjacent),
      theme: 'amber',
    },
    {
      id: 'prize6_suffix3',
      badge: '🎯 รางวัลที่ 6',
      title: 'รางวัลเลขท้าย 3 ตัว',
      subtitle: 'สุ่ม 1 ชุดตัวเลข (ใช้ตรวจสำหรับผู้ถูกรางวัลทั้ง 100 รางวัล)',
      numbers: [result.prize6_suffix3],
      theme: 'red',
      isThreeDigit: true,
    },
    {
      id: 'prize2',
      badge: '🥇 รางวัลเกียรติยศ',
      title: 'รางวัลที่ 2',
      subtitle: 'มีจำนวน 3 รางวัล (เรียงลำดับจากน้อยไปมาก)',
      numbers: sortAscending(result.prize2),
      theme: 'amber',
    },
    {
      id: 'prize3',
      badge: '🥈 รางวัลเกียรติยศ',
      title: 'รางวัลที่ 3',
      subtitle: 'มีจำนวน 3 รางวัล (เรียงลำดับจากน้อยไปมาก)',
      numbers: sortAscending(result.prize3),
      theme: 'amber',
    },
    {
      id: 'prize4',
      badge: '🥉 รางวัลสมนาคุณ',
      title: 'รางวัลที่ 4',
      subtitle: 'มีจำนวน 5 รางวัล (เรียงลำดับจากน้อยไปมาก)',
      numbers: sortAscending(result.prize4),
      theme: 'slate',
    },
    {
      id: 'prize5',
      badge: '🎖️ รางวัลสมนาคุณ',
      title: 'รางวัลที่ 5',
      subtitle: 'มีจำนวน 10 รางวัล (เรียงลำดับจากน้อยไปมาก)',
      numbers: sortAscending(result.prize5),
      theme: 'slate',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showAllGrid, setShowAllGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = React.useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const toggleFullscreen = async () => {
    if (!stageRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await stageRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch {
        // กรณีเบราว์เซอร์ไม่รองรับ Fullscreen API
      }
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // ระบบเลื่อนสไลด์อัตโนมัติทุก 5 วินาที (หยุดชั่วคราวเมื่อนำเมาส์วางบนการ์ด)
  useEffect(() => {
    if (!isPlaying || isHovered || showAllGrid) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, showAllGrid, nextSlide]);

  // รองรับการกดปุ่มลูกศรซ้าย-ขวาบนคีย์บอร์ด
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showAllGrid) return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAllGrid, nextSlide, prevSlide]);

  const currentSlide = slides[currentIndex];

  return (
    <div
      ref={stageRef}
      className={`${
        isFullscreen
          ? 'bg-slate-950 p-6 sm:p-10 flex flex-col justify-center overflow-y-auto'
          : 'mt-10'
      } space-y-6`}
    >
      {/* แถบควบคุมโหมดแสดงผล และปุ่มเลือกสไลด์ด่วน */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-600 animate-pulse" />
            <span className="font-bold text-gray-800 text-sm sm:text-base">
              สไลด์โชว์ประกาศผลรางวัล ({currentIndex + 1} / {slides.length})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!showAllGrid && (
              <>
                <button
                  type="button"
                  onClick={() => setIsPlaying((prev) => !prev)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition flex items-center gap-1.5 ${
                    isPlaying
                      ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <span>{isPlaying ? '⏸ หยุดเลื่อนอัตโนมัติ' : '▶ เล่นสไลด์อัตโนมัติ'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition"
                >
                  {isFullscreen ? '↙ ออกจากโหมดเต็มจอ' : '🖥️ ขยายเต็มหน้าจอ'}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowAllGrid((prev) => !prev)}
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition"
            >
              {showAllGrid ? '🎞️ สลับเป็นโหมดสไลด์โชว์' : '📋 ดูตารางรวมทุกรางวัล'}
            </button>
          </div>
        </div>

        {/* ปุ่มแท็บเลือกสไลด์แต่ละรางวัล */}
        {!showAllGrid && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {slides.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-700 to-red-600 text-white shadow-md shadow-red-600/20'
                      : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                  }`}
                >
                  {slide.title}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* โหมดที่ 1: แสดงผลแบบสไลด์โชว์ (Slideshow Stage) */}
      {!showAllGrid ? (
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* การ์ดสไลด์หลัก */}
          <div
            key={currentSlide.id}
            className={`rounded-3xl shadow-2xl border-2 p-8 sm:p-12 min-h-[420px] flex flex-col justify-between text-center relative overflow-hidden transition-all duration-300 ${
              currentSlide.theme === 'gold'
                ? 'bg-gradient-to-br from-amber-50 via-white to-red-50 border-amber-400'
                : currentSlide.theme === 'red'
                ? 'bg-gradient-to-br from-red-800 via-red-700 to-amber-900 text-white border-amber-300'
                : currentSlide.theme === 'amber'
                ? 'bg-gradient-to-br from-white via-amber-50/40 to-amber-100/40 border-amber-300'
                : 'bg-white border-gray-200'
            }`}
          >
            {/* ส่วนหัวของสไลด์ */}
            <div>
              <div
                className={`inline-block px-5 py-1.5 rounded-full font-bold text-xs sm:text-sm tracking-wide mb-3 shadow-sm ${
                  currentSlide.theme === 'red'
                    ? 'bg-white/20 text-amber-200 border border-amber-300/40'
                    : 'bg-red-700 text-white'
                }`}
              >
                {currentSlide.badge}
              </div>

              <h2
                className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-2 ${
                  currentSlide.theme === 'red'
                    ? 'text-amber-300'
                    : currentSlide.theme === 'gold'
                    ? 'text-red-900'
                    : 'text-gray-900'
                }`}
              >
                {currentSlide.title}
              </h2>

              <p
                className={`text-sm sm:text-base ${
                  currentSlide.theme === 'red' ? 'text-red-100' : 'text-gray-500'
                }`}
              >
                {currentSlide.subtitle}
              </p>
            </div>

            {/* ส่วนแสดงหมายเลขรางวัลตรงกลางสไลด์ */}
            <div className="my-8 flex items-center justify-center">
              {/* กรณีรางวัลที่ 1 (2 รางวัล ขนาดใหญ่พิเศษ) */}
              {currentSlide.id === 'prize1' && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12 w-full">
                  {currentSlide.numbers.map((num, idx) => (
                    <div
                      key={idx}
                      className="w-full sm:w-auto min-w-[240px] bg-white px-10 py-7 rounded-2xl shadow-lg border-2 border-amber-400"
                    >
                      <span className="block text-xs font-semibold text-amber-700 mb-1">
                        หมายเลขที่ถูกรางวัล
                      </span>
                      <span className="text-5xl md:text-6xl font-mono font-black tracking-widest text-red-700">
                        {num}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* กรณีรางวัลเลขท้าย 3 ตัว (1 ชุดตัวเลข ขนาดใหญ่พิเศษ) */}
              {currentSlide.isThreeDigit && (
                <div className="bg-white/15 backdrop-blur-md px-14 py-8 rounded-3xl border-2 border-amber-300/60 shadow-xl">
                  <span className="block text-xs font-semibold text-amber-200 mb-2">
                    เลขท้าย 3 ตัวที่ถูกรางวัล
                  </span>
                  <span className="text-6xl md:text-7xl font-mono font-black tracking-widest text-white">
                    {currentSlide.numbers[0]}
                  </span>
                </div>
              )}

              {/* กรณีรางวัลข้างเคียง (4 รางวัล) หรือ รางวัลที่ 2-3 (3 รางวัล) */}
              {(currentSlide.id === 'prize7_adjacent' ||
                currentSlide.id === 'prize2' ||
                currentSlide.id === 'prize3') && (
                <div
                  className={`grid gap-4 w-full max-w-3xl ${
                    currentSlide.numbers.length === 4
                      ? 'grid-cols-2 sm:grid-cols-4'
                      : 'grid-cols-1 sm:grid-cols-3'
                  }`}
                >
                  {currentSlide.numbers.map((num, idx) => (
                    <div
                      key={idx}
                      className="bg-white border-2 border-amber-300 rounded-2xl py-6 px-4 shadow-md"
                    >
                      <span className="block text-xs text-gray-400 font-medium mb-1">
                        หมายเลขที่ {idx + 1}
                      </span>
                      <span className="text-3xl md:text-4xl font-mono font-extrabold tracking-widest text-gray-800">
                        {num}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* กรณีรางวัลที่ 4 (5 รางวัล) และ รางวัลที่ 5 (10 รางวัล) */}
              {(currentSlide.id === 'prize4' || currentSlide.id === 'prize5') && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 w-full max-w-4xl">
                  {currentSlide.numbers.map((num, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-3 shadow-sm"
                    >
                      <span className="block text-[11px] text-gray-400 font-medium mb-0.5">
                        อันดับที่ {idx + 1}
                      </span>
                      <span className="text-2xl sm:text-3xl font-mono font-bold tracking-wider text-gray-800">
                        {num}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ส่วนท้ายสไลด์: ปุ่มย้อนกลับ / จุดบอกตำแหน่งสไลด์ / ปุ่มถัดไป */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-black/10">
              <button
                type="button"
                onClick={prevSlide}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
                  currentSlide.theme === 'red'
                    ? 'bg-white/15 hover:bg-white/25 text-white'
                    : 'bg-gray-900 hover:bg-gray-800 text-white shadow-sm'
                }`}
              >
                <span>← รางวัลก่อนหน้า</span>
              </button>

              {/* จุด Indicator */}
              <div className="flex items-center gap-2">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`ไปยังสไลด์ ${s.title}`}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === currentIndex
                        ? currentSlide.theme === 'red'
                          ? 'w-8 bg-amber-300'
                          : 'w-8 bg-red-600'
                        : currentSlide.theme === 'red'
                        ? 'w-2.5 bg-white/40 hover:bg-white/70'
                        : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
                  currentSlide.theme === 'red'
                    ? 'bg-amber-400 hover:bg-amber-300 text-red-950'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                }`}
              >
                <span>รางวัลถัดไป →</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* โหมดที่ 2: ตารางรวมทุกรางวัล (กรณีผู้ใช้กดสลับมาดูภาพรวมทั้งหมด) */
        <div className="space-y-6">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{slide.title}</h3>
                  <p className="text-xs text-gray-500">{slide.subtitle}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold">
                  {slide.badge}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {slide.numbers.map((num, idx) => (
                  <div
                    key={idx}
                    className="px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-2xl font-bold text-gray-800 tracking-widest"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

