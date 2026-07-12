import type { Metadata } from "next";
import { Raleway, Inter } from "next/font/google";
import "./globals.css";

const raleway = Raleway({ 
  subsets: ["latin", "cyrillic"],
  variable: "--font-raleway",
  display: "swap",
});

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harmony Store — Продукция Vilavi для митохондриального здоровья",
  description: "БАДы, концентраты, масла, витаминные комплексы и клетчатка для вашего здоровья",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={raleway.variable + " " + inter.variable}>
      <body className="bg-background text-text-primary font-inter">
        {children}
      </body>
    </html>
  );
}
