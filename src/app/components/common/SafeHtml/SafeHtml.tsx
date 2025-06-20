'use client';

import { BaseUI } from '@/lib/interfaces';
import createDOMPurify from 'dompurify';
import { JSX, useEffect, useMemo, useState } from 'react';

interface SafeHtmlProps extends BaseUI {
    html: string;
    as?: keyof JSX.IntrinsicElements;
}

export default function SafeHtml({ html, as: Tag = 'div', className }: SafeHtmlProps) {
    const [cleanHtml, setCleanHtml] = useState('');

    const DOMPurify = useMemo(() => {
        if (typeof window === 'undefined') return null;
        return createDOMPurify(window);
    }, []);

    useEffect(() => {
        if (DOMPurify) {
            setCleanHtml(DOMPurify.sanitize(html));
        }
    }, [DOMPurify, html]);

    if (!cleanHtml) return null;

    return <Tag className={className} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}
