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

// Инлайн-скрипт: применяет тему ДО рендера, чтобы не было мигания
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${raleway.variable} ${inter.variable}`}>
      <head>
        {/* Применяем тему сразу, до гидрации — убирает мигание */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-background text-text-primary font-inter min-h-screen">
        {children}
      </body>
    </html>
  );
}
