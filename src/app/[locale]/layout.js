import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import ClientLayout from './ClientLayout';
import Providers from '@/components/Providers';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import '@/styles/tailwind.css'

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className="h-full bg-gray-50 text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950"
    >
      <body className="h-full">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <ClientLayout>
              <ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
                {children}
              </ReCaptchaProvider>
            </ClientLayout>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
