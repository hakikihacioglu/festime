import { getTokens } from 'next-firebase-auth-edge';
import { cookies as nextCookies } from 'next/headers';
import { firebaseClientConfig, firebaseServerConfig } from '../../config/firebase';
import LogoutButton from './../../components/LogoutButton';
import Link from 'next/link';


export default async function SSDashboardPage() {
  const cookies = nextCookies();
  const tokens = await getTokens(cookies, {
    apiKey: firebaseClientConfig.apiKey,
    cookieName: firebaseServerConfig.cookieName,
    cookieSignatureKeys: firebaseServerConfig.cookieSignatureKeys,
    serviceAccount: firebaseServerConfig.serviceAccount,
  });

  if (!tokens) {
    return (
      <div>
        <h1>User is not logged in</h1>
      </div>
    );
  }

  const { decodedToken } = tokens;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-xl mb-4">Super secure home page Server Component</h1>
      <p>
        Only <strong>{decodedToken.email}</strong> holds the magic key to this kingdom!
      </p>
      <Link href="/dashboard" className="text-blue-500 underline">
          Go to CS Dashboard
        </Link>
      <LogoutButton />
    </main>
  );
}
