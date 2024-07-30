'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import LogoutButton from '@/components/LogoutButton';

export default function DashboardPage() {
  const { user } = useAuth();
  const locale = useLocale();

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <p>{user.email}</p>
      <Link href={`/${locale}/ssdashboard`} className="text-blue-500 underline">
        Go to SS Dashboard
      </Link>
      <LogoutButton />
    </>
  );
}
