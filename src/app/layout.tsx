import type { Metadata } from 'next';
import '../styles/globals.scss';
import ru from '@/locales/ru/meta.json';
import { Providers } from '@/store/providers';
import { circleRounded } from './assets/fonts';
import css from './layout.module.scss';

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
                <div className={css.overlay}></div>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
