// app/[locale]/auth/signin/page.js
'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError(result.error);
    } else {
      router.push(`/${locale}/dashboard`);
    }
  };

  return (
    <div>
      <h1>{t('Sign In')}</h1>
      {error && <p style={{ color: 'red' }}>{t(error)}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t('Email')}:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>{t('Password')}:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{t('Sign In')}</button>
      </form>
    </div>
  );
};

export default SignIn;


