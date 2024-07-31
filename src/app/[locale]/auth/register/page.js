'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Script from 'next/script';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organisationName, setOrganisationName] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (typeof window.grecaptcha === 'undefined') {
      setError('reCAPTCHA is not loaded properly.');
      return;
    }

    window.grecaptcha.ready(async () => {
      const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'register' });

      try {
        const response = await fetch('https://europe-west3-festime.cloudfunctions.net/api/organisations/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, organisationName, recaptchaToken: token })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to register');
        }

        // Generate a new reCAPTCHA token for login
        const loginToken = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'login' });

        // Automatically sign in the user after successful registration
        const signInResult = await signIn('credentials', {
          redirect: false,
          email,
          password,
          recaptchaToken: loginToken, // Pass the new reCAPTCHA token for login
        });

        if (!signInResult.error) {
          router.push(`/${locale}/dashboard`);
        } else {
          setError(signInResult.error);
        }
      } catch (error) {
        setError(error.message);
      }
    });
  };

  return (
    <div>
      <h1>{t('Register')}</h1>
      {error && <p style={{ color: 'red' }}>{t(error)}</p>}
      <form id="register-form" onSubmit={handleRegister}>
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
        <div>
          <label>{t('OrganisationName')}:</label>
          <input
            type="text"
            value={organisationName}
            onChange={(e) => setOrganisationName(e.target.value)}
            required
          />
        </div>
        <button type="submit">{t('Register')}</button>
      </form>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
    </div>
  );
};

export default Register;
