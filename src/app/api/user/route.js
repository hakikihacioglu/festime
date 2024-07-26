import { getTokens } from 'next-firebase-auth-edge';
import { cookies } from 'next/headers';
import { firebaseClientConfig, firebaseServerConfig } from '../../../config/firebase';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    // Access cookies synchronously
    const cookieStore = cookies();

    let tokens;
    try {
      tokens = await getTokens(cookieStore, {
        apiKey: firebaseClientConfig.apiKey,
        cookieName: firebaseServerConfig.cookieName,
        cookieSignatureKeys: firebaseServerConfig.cookieSignatureKeys,
        serviceAccount: firebaseServerConfig.serviceAccount,
      });
    } catch (error) {
      console.error('Error in getTokens:', error);
      return new Response(JSON.stringify({ error: 'Token verification failed', details: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!tokens) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ user: tokens.decodedToken }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in API route:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
