'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      disabled={isLoggingOut}
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
}