import type { Metadata } from 'next';
import { Bebas_Neue, JetBrains_Mono, Barlow } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const barlow = Barlow({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hyrox Training Dashboard',
  description: 'Personal training dashboard for Hyrox race preparation - 12-week program for sub-70 minute finish',
  openGraph: {
    title: 'Hyrox Training Dashboard',
    description: '12-week program for sub-70 minute Hyrox finish',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${jetbrainsMono.variable} ${barlow.variable}`}>
      <body className="font-body min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
