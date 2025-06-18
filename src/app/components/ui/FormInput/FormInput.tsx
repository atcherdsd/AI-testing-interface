import { UseFormRegister, FieldValues, Path, RegisterOptions } from "react-hook-form";
import css from './FormInput.module.scss';
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { animateResizeTextarea, debounce } from "@/lib/utils/helpers";

interface FormInputProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    registerOptions?: RegisterOptions<T, Path<T>>;
    error?: string;
    placeholder?: string;
    type?: string;
    isValid?: boolean;
    as?: 'input' | 'textarea';
    isSmallArea?: boolean;
}

export const FormInput = <T extends FieldValues>({
    label,
    name,
    register,
    registerOptions,
    error,
    placeholder,
    isValid,
    type='text',
    as = 'input',
    isSmallArea = false
}: FormInputProps<T>) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (as !== 'textarea') return;

        const handleResize = debounce(() => {
            const el = textareaRef.current;
            if (el && el.value.trim() !== '') {
                animateResizeTextarea(el);
            }
        }, 150);

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [as]);

    const {
        ref: registerRef,
        onBlur: rhfOnBlur,
        ...restRegister
    } = register(name, registerOptions || {});

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        rhfOnBlur(e);
        if (as === 'textarea') {
            const el = textareaRef.current;
            if (el && el.value.trim() !== '') {
                animateResizeTextarea(el);
            }
        }
    };

    const labelCName = clsx('regular-16', css.rootLabel);
    const commonFieldCName = clsx(
        'regular-14',
        isValid && css.valid,
        error && css.error
    );
    const inputCName = clsx(commonFieldCName, css.rootInput);
    const textareaCName = clsx(
        commonFieldCName,
        css.rootTextarea,
        isSmallArea && css.smallArea
    );

    return (
        <div className={css.root}>
            <label className={labelCName}>
                {label}

                {as === 'textarea' ? (
                    <textarea
                        {...restRegister}
                        onBlur={handleBlur}
                        ref={(el) => {
                            registerRef(el);
                            textareaRef.current = el;
                        }}
                        className={textareaCName}
                        rows={1}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${String(name)}-error` : undefined}
                    />
                ) : (
                    <input
                        {...restRegister}
                        onBlur={handleBlur}
                        ref={registerRef}
                        className={inputCName}
                        placeholder={placeholder}
                        type={type}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${String(name)}-error` : undefined}
                    />
                )
            }
            </label>
            {error && (
                <p id={`${String(name)}-error`} style={{ color: 'red' }} role='alert'>
                    {error}
                </p>
            )}
        </div>
    );
};
