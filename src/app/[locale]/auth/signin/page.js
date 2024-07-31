'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Script from 'next/script';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const t = useTranslations();
  const locale = router.locale;

  const handleSubmit = async (e) => {
    e.preventDefault();

    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'signin' }).then(async (token) => {
        try {
          const response = await signIn('credentials', {
            redirect: false,
            email,
            password,
            recaptchaToken: token,
          });

          if (!response.error) {
            router.push(`/${locale}/dashboard`);
          } else {
            setError(response.error);
          }
        } catch (error) {
          setError(error.message);
        }
      });
    });
  };

  return (
    <div>
      <h1>{t('Login')}</h1>
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
        <button type="submit">{t('Login')}</button>
      </form>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
    </div>
  );
};

export default SignIn;
