'use client';

import { useAppDispatch } from '@/store/hooks';
import { nextStep } from '@/store/slices/progessSlice';
import { useRouter } from 'next/navigation';
import { ButtonHTMLAttributes } from 'react';

export interface ButtonClientProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    cName: string;
    submit?: boolean;
    isStartButton?: boolean;
    clickHandler?: () => void;
};

export default function ButtonClient({
    cName,
    submit,
    disabled,
    isStartButton,
    clickHandler,
    style,
    children,
    ...restProps
}: ButtonClientProps) {
    const dispatch = useAppDispatch();

    const router = useRouter();

    const handleClick = () => {
        if (isStartButton) {
            router.push('/assessment/step/1');
            dispatch(nextStep());
        }
        if (typeof clickHandler === 'function') clickHandler();
    };

    return (
        <button
            className={cName}
            style={style}
            type={submit ? 'submit' : 'button'}
            disabled={disabled}
            onClick={handleClick}
            {...restProps}
        >
            {children}
        </button>
    );
}
