import localFont from "next/font/local";

export const circleRounded = localFont({
    src: [
        {
            path: './fonts/CircleRounded-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './fonts/CircleRounded-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
    ],
    display: 'swap',
    variable: '--font-circle-rounded',
});
