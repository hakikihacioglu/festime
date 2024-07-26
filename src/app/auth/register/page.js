// src/app/auth/register/page.js
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { app } from '../../lib/firebase';
import { createUserWithEmailAndPassword,  getAuth} from 'firebase/auth';


// Define validation schema using Yup
const schema = yup.object().shape({
    orgName: yup.string().required('Organization Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Password confirmation is required'),
});

export default function RegisterPage() {
    const router = useRouter();
    const { register, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const handleRegister = async (data) => {
        console.log(data);
        try {
            const userCredential = await createUserWithEmailAndPassword(getAuth(app), data.email, data.password);
            await
                (userCredential.user, { displayName: data.orgName });
            router.push('/dashboard');
        } catch (error) {
            setError('generic', { type: 'manual', message: 'Registration failed. Please try again.' });
        }
    };

    return (
        <form onSubmit={handleSubmit(handleRegister)}>
            <div>
                <input
                    type="text"
                    placeholder="Organization Name"
                    {...register('orgName')}
                />
                {errors.orgName && <p>{errors.orgName.message}</p>}
            </div>
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
            <div>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    {...register('confirmPassword')}
                />
                {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
            </div>
            {errors.generic && <p>{errors.generic.message}</p>}
            <button type="submit">Register</button>
        </form>
    );
}
