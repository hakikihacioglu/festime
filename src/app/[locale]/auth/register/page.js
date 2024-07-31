'use client';

import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useReCaptcha } from 'next-recaptcha-v3';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organisationName, setOrganisationName] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const { executeRecaptcha } = useReCaptcha();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        // Generate ReCaptcha token for registration
        const registerToken = await executeRecaptcha('register');

        const response = await fetch('https://europe-west3-festime.cloudfunctions.net/api/organisations/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, organisationName, recaptchaToken: registerToken })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to register');
        }

        // Generate a new reCAPTCHA token for login
        const loginToken = await executeRecaptcha('login');

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
    },
    [executeRecaptcha, email, password, organisationName, locale, router]
  );

  return (
    <div>
      <h1>{t('Register')}</h1>
      {error && <p style={{ color: 'red' }}>{t(error)}</p>}
      <form id="register-form" onSubmit={handleSubmit}>
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
    </div>
  );
};

export default Register;
