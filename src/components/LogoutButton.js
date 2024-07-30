// app/components/LogoutButton.js
'use client';

import { signOut } from "next-auth/react";
import { useLocale } from 'next-intl';

const LogoutButton = () => {

  const locale = useLocale();

  return (
    <button onClick={() => signOut({ callbackUrl: `/${locale}/auth/signin` })}>
      Logout
    </button>
  );
};

export default LogoutButton;