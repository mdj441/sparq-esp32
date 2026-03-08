import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';
import './globals.css';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ספארק – מורה ESP32 לילדים',
  description: 'מערכת AI שמלווה ילדים בבניית פרויקטים ומשחקים עם לוח ESP32',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} font-heebo antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
