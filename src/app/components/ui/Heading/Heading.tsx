import React, { JSX } from 'react';
import css from './Heading.module.scss';
import { BaseUI } from '@/lib/interfaces';
import Notice from '../Notice/Notice';
import clsx from 'clsx';

export interface HeadingProps extends BaseUI {
    title: string;
    notice?: string;
    id?: string;
    level?: 1 | 2 | 3 | 4;
}

export default function Heading({
    title,
    notice,
    className,
    id,
    level = 1
}: HeadingProps) {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    const rootClassName = clsx(css.root, className);
    const titleClassName = clsx('title-3-20');

    return (
        <div className={rootClassName}>
            <Tag className={titleClassName} id={id}>{title}</Tag>
            {notice && <Notice className={css.rootNotice} text={notice} />}
        </div>
    );
}
