import { BaseUI, ButtonConfig, IconFirstButtons, TextFirstButtons } from '@/lib/interfaces';
import css from './Button.module.scss';
import Link from 'next/link';
import { forwardRef, memo } from 'react';
import ButtonClient from '../ButtonClient/ButtonClient';
import clsx from 'clsx';

export interface ButtonProps extends BaseUI, ButtonConfig {}

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
            disabled,
            clickHandler,
            isStartButton,
            children,
        }: ButtonProps,
        ref,
    ) => {
        const cName = clsx(
            css.root,
            variant && css[variant],
            className,
            isLightBg && css.lightBg,
            isStartButton && css.startButton
        );

        const textClassList = clsx('buttons', css.rootText);

        const buttonProps = { submit, cName, disabled, isStartButton, clickHandler };

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
