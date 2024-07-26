'use client';

import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User is not logged in</div>;
  }

  const handleLogout = async () => {
    await logout();
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-xl mb-4">Super secure home page Client Component</h1>
      <p>
        Only <strong>{user.email}</strong> holds the magic key to this kingdom!
      </p>
      <Link href="/ssdashboard" className="text-blue-500 underline">
        Go to SS Dashboard
      </Link>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </main>
  );
}

