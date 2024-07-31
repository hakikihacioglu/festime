'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useReCaptcha } from 'next-recaptcha-v3';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organisationName, setOrganisationName] = useState('');
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
      // Basic password strength check
      if (password.length < 8) {
        throw new Error(t('Password must be at least 8 characters long'));
      }

      // Generate ReCaptcha token for registration
      const registerRecaptchaToken = await executeRecaptcha('register');

      const response = await fetch('https://europe-west3-festime.cloudfunctions.net/api/organisations/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          organisationName,
          recaptchaToken: registerRecaptchaToken
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to register');
      }

      // Generate a new reCAPTCHA token for login
      const loginRecaptchaToken = await executeRecaptcha('login');

      // Automatically sign in the user after successful registration
      const signInResult = await signIn('credentials', {
        redirect: false,
        email,
        password,
        recaptchaToken: loginRecaptchaToken,
      });

      if (!signInResult.error) {
        router.push(`/${locale}/dashboard`);
      } else {
        throw new Error(signInResult.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>{t('Register')}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
            minLength={8}
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? t('Registering') : t('Register')}
        </button>
      </form>
    </div>
  );
};

export default Register;
