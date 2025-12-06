import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import ThemeProvider from '@/providers/ThemeProvider';
import CookieConsent from '@/components/ui/CookieConsent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Al Asr Centers - Islamic Educational Platform',
  description: 'Comprehensive Islamic educational content, Quran studies, Hadith collections, and more.',
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
            
            <div className="flex-1">
              <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <main className="flex-1">
                    {children}
                  </main>
                  <aside className="lg:w-80">
                    {/* Always visible sidebar that can be collapsed */}
                    <Sidebar alwaysVisible={true} />
                  </aside>
                </div>
              </div>
            </div>
            
            <Footer />
            <CookieConsent />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}