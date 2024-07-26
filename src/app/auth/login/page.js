'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../lib/firebase';
import { useAuth } from '../../../context/AuthContext';

// Define validation schema using Yup
const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const { login } = useAuth();

  const handleLogin = async (data) => {
    try {
      const credential = await signInWithEmailAndPassword(getAuth(app), data.email, data.password);
      const idToken = await credential.user.getIdToken();

      await login(idToken);
    } catch (error) {
      setError('generic', { type: 'manual', message: 'Login failed due to email/password combination mismatch' });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        {errors.generic && <p>{errors.generic.message}</p>}
        <button type="submit">Login</button>
      </form>
      <p>
        Don&apos;t have an account? <Link href="/auth/register">Register</Link>
      </p>
    </div>
  );
}
