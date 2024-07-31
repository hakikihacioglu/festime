'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useReCaptcha } from 'next-recaptcha-v3';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const { executeRecaptcha } = useReCaptcha();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Generate ReCaptcha token for login
      const loginRecaptchaToken = await executeRecaptcha('login');

      const response = await signIn('credentials', {
        redirect: false,
        email,
        password,
        recaptchaToken: loginRecaptchaToken, // Pass the reCAPTCHA token
      });

      if (!response.error) {
        router.push(`/${locale}/dashboard`);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Link href={`/${locale}/dashboard`} className="text-blue-500 underline">
        Dashboard
      </Link>
      <h1>{t('Login')}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? t('Logging in...') : t('Login')}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
