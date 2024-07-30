
import LogoutButton from '../../../components/LogoutButton';
import Link from 'next/link';
import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";


export default async function SSDashboardPage({ params }) {

  const session = await getServerSession(authOptions);

  if (!session) {
    // If there is no session, you can redirect to the signin page
    return (
      <div>
        <p>You must be logged in to view this page. Redirecting to sign-in...</p>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.href = '/auth/signin';`
          }}
        />
      </div>
    );
  }


  // Extract the locale from the URL parameters
  const { locale } = params;

  return (
    <>
      <p>{session.user.email}</p>
      <Link href={`/${locale}/dashboard`} className="text-blue-500 underline">
        Go to CS Dashboard
      </Link>
      <LogoutButton />
    </>
  );
}
