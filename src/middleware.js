import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, redirectToLogin, redirectToHome } from 'next-firebase-auth-edge';
import { firebaseClientConfig, firebaseServerConfig } from './config/firebase';

const PUBLIC_PATHS = ['/auth/register', '/auth/login', '/auth/reset-password'];

export async function middleware(request) {
    console.log("Middleware invoked");
    

    // Log environment variables
    console.log('Environment Variables:');
    console.log('AUTH_COOKIE_SIGNATURE_KEY_CURRENT:', process.env.AUTH_COOKIE_SIGNATURE_KEY_CURRENT);
    console.log('AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS:', process.env.AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS);
    console.log('USE_SECURE_COOKIES:', process.env.USE_SECURE_COOKIES);
    console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    console.log('FIREBASE_ADMIN_CLIENT_EMAIL:', process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
    console.log('FIREBASE_ADMIN_PRIVATE_KEY:', process.env.FIREBASE_ADMIN_PRIVATE_KEY); // Mask the private key for security

    if(process.env.USE_SECURE_COOKIES === 'true')
        console.log("Using secure cookies");
    else
        console.log("Not using secure cookies");
    // Log Firebase configurations
    console.log('Firebase Client Config:', firebaseClientConfig);
    console.log('Firebase Server Config:', firebaseServerConfig);

    try {
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
                    console.log("Redirecting to dashboard");
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
    } catch (error) {
        console.error('Middleware error', { error });
        return new Response('Internal Server Error', { status: 500 });
    }
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
