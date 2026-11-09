import type { Metadata } from 'next';
import { Prompt } from 'next/font/google';
import './globals.css';

const promptFont = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ประกาศผลการออกสลากกาชาด งานเทศกาลปีใหม่สี่เผ่าไทศรีสะเกษ',
  description:
    'ระบบตรวจผลสลากกาชาดออนไลน์ งานเทศกาลปีใหม่สี่เผ่าไทศรีสะเกษ สำนักงานเหล่ากาชาดจังหวัดศรีสะเกษ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${promptFont.className} antialiased`}>{children}</body>
    </html>
  );
}

