import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Script from 'next/script';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organisationName, setOrganisationName] = useState('');
  const [error, setError] = useState(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    const loadRecaptcha = () => {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setRecaptchaLoaded(true);
        });
      }
    };

    // Check if reCAPTCHA is already loaded
    if (typeof window !== 'undefined' && window.grecaptcha) {
      loadRecaptcha();
    } else {
      // If not, set up a listener for when it loads
      window.onloadCallback = loadRecaptcha;
    }
  }, []);

  const executeRecaptcha = async (action) => {
    if (!recaptchaLoaded) {
      throw new Error('reCAPTCHA not loaded');
    }
    return await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = await executeRecaptcha('register');

      const response = await fetch('https://europe-west3-festime.cloudfunctions.net/api/organisations/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, organisationName, recaptchaToken: token })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to register');
      }

      const loginToken = await executeRecaptcha('login');

      const signInResult = await signIn('credentials', {
        redirect: false,
        email,
        password,
        recaptchaToken: loginToken,
      });

      if (!signInResult.error) {
        router.push(`/${locale}/dashboard`);
      } else {
        setError(signInResult.error);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>{t('Register')} V1.0</h1>
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
        <button type="submit" disabled={!recaptchaLoaded}>{t('Register')}</button>
      </form>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}&onload=onloadCallback`}
        strategy="afterInteractive"
      />
    </div>
  );
};

export default Register;