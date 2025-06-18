import { ButtonConfig, IconFirstButtons, TextFirstButtons } from '@/lib/interfaces';
import css from './Button.module.scss';
import Link from 'next/link';
import { ButtonHTMLAttributes, forwardRef, memo } from 'react';
import ButtonClient from '../ButtonClient/ButtonClient';
import clsx from 'clsx';

export interface ButtonProps extends ButtonConfig, ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            text,
            href,
            isBlank,
            submit,
            variant,
            isLightBg,
            className,
            clickHandler,
            isStartButton,
            ifFullWidth,
            children,
            ...restProps
        }: ButtonProps,
        ref,
    ) => {
        const cName = clsx(
            css.root,
            variant && css[variant],
            className,
            isLightBg && css.lightBg,
            isStartButton && css.startButton,
            ifFullWidth && css.fullWidth
        );

        const textClassList = clsx(!isStartButton && 'regular-16', css.rootText);

        const buttonProps = { submit, cName, isStartButton, clickHandler, ...restProps };

        const innerContent = (
            <>
                {variant && Object.values(IconFirstButtons).some((value) => value === variant) && (
                    <span className={css.rootIcon}>{children}</span>
                )}
                {text && <span ref={ref} className={textClassList}>{text}</span>}
                {variant && Object.values(TextFirstButtons).some((value) => value === variant) && (
                    <span className={css.rootIcon}>{children}</span>
                )}
            </>
        );

        return href ? (
            <Link href={href} target={isBlank ? '_blank' : '_self'} className={cName} onClick={clickHandler}>
                {innerContent}
            </Link>
        ) : (
            <ButtonClient {...buttonProps}>
                {innerContent}
            </ButtonClient>
        );
    },
);

Button.displayName = 'Button';

export default memo(Button);
