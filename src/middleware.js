// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import createIntlMiddleware from 'next-intl/middleware';

const intlMiddleware = createIntlMiddleware({
    locales: ['en', 'fr', 'de', 'tr'], // Add your supported locales here
    defaultLocale: 'en'
});

export async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_JWT_SECRET });

    const isAuthPath = pathname.includes('/auth');
    const isDashboardPath = pathname.includes('/dashboard');

    /*
    if (!token && isDashboardPath) {
        return NextResponse.redirect(new URL(`/${req.nextUrl.locale}/auth/signin`, req.url));
    }

    if (token && isAuthPath) {
        return NextResponse.redirect(new URL(`/${req.nextUrl.locale}/dashboard`, req.url));
    }
    */

    return intlMiddleware(req);
}

export const config = {
    matcher: ['/', '/(de|en|fr|tr)/:path*'],
};