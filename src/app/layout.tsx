import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.scss';
import ru from '@/locales/ru/meta.json';
import { Providers } from '@/store/providers';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: ru.title,
    description: ru.description,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
