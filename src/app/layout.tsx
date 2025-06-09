import type { Metadata } from 'next';
import '../styles/globals.scss';
import ru from '@/locales/ru/meta.json';
import { Providers } from '@/store/providers';
import { circleRounded } from './assets/fonts';

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
        <html lang="ru" className={circleRounded.variable}>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
