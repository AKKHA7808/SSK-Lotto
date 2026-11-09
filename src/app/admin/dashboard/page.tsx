import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getLatestLotteryResultFromDB } from '@/lib/dbService';
import AdminDrawClient from '@/components/AdminDrawClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // ป้องกัน Route ฝั่ง Server อีกชั้นนอกเหนือจาก Middleware
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/admin/login');
  }

  const serializedLatest = await getLatestLotteryResultFromDB();

  return (
    <AdminDrawClient
      initialResult={serializedLatest}
      adminName={session.user?.name}
    />
  );
}

