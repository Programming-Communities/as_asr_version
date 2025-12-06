import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ThemeProvider from '@/providers/ThemeProvider';
import CookieConsent from '@/components/ui/CookieConsent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Al-Asr Islamic Service',
  description: 'Islamic services, calendar events, and community programs. Stay updated with the latest from Al-Asr Islamic Service.',
  keywords: ['Islamic', 'Quran', 'Hadith', 'Calendar', 'Islamic Services', 'Al-Asr'],
  authors: [{ name: 'Al-Asr Islamic Service' }],
  openGraph: {
    title: 'Al-Asr Islamic Service',
    description: 'Islamic services, calendar events, and community programs. Stay updated with the latest from Al-Asr Islamic Service.',
    type: 'website',
    siteName: 'Al-Asr Islamic Service',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al-Asr Islamic Service',
    description: 'Islamic services, calendar events, and community programs.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            
            {/* Full width main content */}
            <main className="flex-1">
              {children}
            </main>
            
            <Footer />
            <CookieConsent />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}