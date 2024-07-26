import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, redirectToLogin, redirectToHome } from 'next-firebase-auth-edge';
import { firebaseClientConfig, firebaseServerConfig } from './config/firebase';

const PUBLIC_PATHS = ['/auth/register', '/auth/login', '/auth/reset-password'];

export async function middleware(request) {
    return authMiddleware(request, {
        loginPath: '/api/login',
        logoutPath: '/api/logout',
        apiKey: firebaseClientConfig.apiKey,
        cookieName: firebaseServerConfig.cookieName,
        cookieSignatureKeys: [
            process.env.AUTH_COOKIE_SIGNATURE_KEY_CURRENT,
            process.env.AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS,
        ],
        cookieSerializeOptions: {
            path: '/',
            httpOnly: true,
            secure: process.env.USE_SECURE_COOKIES === 'true',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: 'strict',
        },
        serviceAccount: {
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        enableMultipleCookies: true,
        debug: false,
        handleValidToken: async ({ token, decodedToken }, headers) => {
            const { origin, pathname } = request.nextUrl;
            if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
                return NextResponse.redirect(`${origin}/dashboard`);
            }

            return NextResponse.next({
                request: {
                    headers,
                },
            });
        },
        handleInvalidToken: async (reason) => {
            console.info('Missing or malformed credentials', { reason });
            return redirectToLogin(request, {
                path: '/auth/login',
                publicPaths: PUBLIC_PATHS,
            });
        },
        handleError: async (error) => {
            console.error('Unhandled authentication error', { error });
            return redirectToLogin(request, {
                path: '/auth/login',
                publicPaths: PUBLIC_PATHS,
            });
        },
    });
}

export const config = {
    matcher: [
        '/api/login',
        '/api/logout',
        '/auth/:path*',
        '/dashboard/:path*',
        '/ssdashboard/:path*',
    ],
};