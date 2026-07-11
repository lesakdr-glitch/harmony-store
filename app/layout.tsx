import type { Metadata } from 'next';
import { Raleway, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingSupport from '@/components/FloatingSupport';

const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-raleway',
  weight: ['300', '400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Harmony Store — здоровье начинается с митохондрий',
  description: 'Продукция Vilavi для митохондриального здоровья. БАДы, концентраты, масла, витаминные комплексы.',
  keywords: 'Vilavi, митохондрии, здоровье, БАДы, концентраты, витамины, Harmony Store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${raleway.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-inter text-[#2D2D2D] bg-[#FAF7F2] min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FloatingSupport />
      </body>
    </html>
  );
}