'use client';

import { BaseUI } from '@/lib/interfaces';
import { nextStep } from '@/store/slices/progessSlice';
import { AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import { CSSProperties } from 'react';
import { useDispatch } from 'react-redux';

export interface ButtonClientProps extends BaseUI {
    cName: string;
    submit?: boolean;
    disabled?: boolean;
    isStartButton?: boolean;
    style?: CSSProperties;
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
}: ButtonClientProps) {
    const dispatch = useDispatch<AppDispatch>();

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
        >
            {children}
        </button>
    );
}
