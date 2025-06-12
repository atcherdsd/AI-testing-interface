import React from 'react';
import css from './Heading.module.scss';
import { BaseUI } from '@/lib/interfaces';
import Notice from '../Notice/Notice';

export interface HeadingProps extends BaseUI {
    title: string;
    notice?: string;
}

export default function Heading({ title, notice }: HeadingProps) {
    return (
        <div className={css.root}>
            <h1 className={`title-3-20 ${css.rootTitle}`}>{title}</h1>
            {notice && <Notice className={css.rootNotice} text={notice} />}
        </div>
    );
}
