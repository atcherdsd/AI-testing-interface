import React from 'react';
import css from './Notice.module.scss';
import { BaseUI } from '@/lib/interfaces';
import AlertIcon from '@/icons/alert.svg';
import clsx from 'clsx';

export interface NoticeProps extends BaseUI {
    text: string;
}

export default function Notice({ text, className }: NoticeProps) {
    const rootClassList = clsx(css.root, className && className);

    return (
        <div className={rootClassList}>
            <span className={css.rootIcon}>
                <AlertIcon />
            </span>
            <span className={`regular-14 ${css.rootText}`}>{text}</span>
        </div>
    );
}
