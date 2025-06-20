'use client';

import { useController, useFormContext, Control } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import ArrowLeftIcon from '@/icons/Arrow-left.svg';
import ArrowRightIcon from '@/icons/Arrow-right.svg';
import css from './DateInput.module.scss';
import { updateField } from '@/store/slices/formStateSlice';
import { FormSchema } from '@/lib/schemas/questionsFormSchema';
import { isValidDate, parseAndValidateDateString } from '@/lib/utils/helpers';
import { useAppDispatch } from '@/store/hooks';

interface DateInputProps {
    control: Control<FormSchema>;
    name: 'birthDate';
    label: string;
    placeholder: string;
    minDate: string | Date;
}

export default function DateInput({
    control,
    name,
    label,
    placeholder,
    minDate,
}: DateInputProps) {
    const dispatch = useAppDispatch();
    const { field, fieldState } = useController({ name, control });
    const { trigger } = useFormContext<FormSchema>();

    const [rawInputValue, setRawInputValue] = useState(
        isValidDate(field.value) ? format(field.value, 'dd.MM.yyyy') : ''
    );
    const [formatError, setFormatError] = useState<string | null>(null);

    // Синхронизация rawInputValue при внешнем изменении field.value
    useEffect(() => {
        if (isValidDate(field.value)) {
            setRawInputValue(format(field.value, 'dd.MM.yyyy'));
        } else {
            setRawInputValue('');
        }
        setFormatError(null);
    }, [field.value]);

    const zodError = fieldState.error?.message;
    const errorMessage = formatError || zodError;

    const handleParse = () => {
        const str = rawInputValue?.trim() ?? '';

        // синхронизация для сценария: клик по календарю — field.value уже установлен,
        // rawInputValue еще пуст/старый
        if (!str && isValidDate(field.value)) {
            const date = field.value!;
            setRawInputValue(format(date, 'dd.MM.yyyy'));
            setFormatError(null);
            return;
        }

        if (!str) {
            field.onChange(undefined);
            dispatch(updateField({ path: name, value: null }));

            // сообщение о пустом поле через Zod
            trigger(name);
            return;
        }

        // Проверка формата/существования/диапазона
        const { date, error } = parseAndValidateDateString(str);

        if (date) {
            field.onChange(date);
            dispatch(updateField({
                path: name,
                value: date.toISOString()
            }));
            setRawInputValue(format(date, 'dd.MM.yyyy'));
            setFormatError(null);
        } else {
            field.onChange(undefined);
            dispatch(updateField({ path: name, value: null }));

            // сообщение об ошибке формата/существования от хелпера
            setFormatError(error || 'Неверная дата');
        }
        // Zod-проверка на диапазон
        trigger(name);
    };

    return (
        <div className={css.root}>
            <label htmlFor='birthDate' className={clsx('regular-16', css.rootDateLabel)}>
                {label}
            </label>
            <>
                <DatePicker
                    locale={ru}
                    id='birthDate'
                    showPopperArrow={false}
                    popperPlacement='bottom-start'
                    popperModifiers={[
                        {
                            name: "offset",
                            fn(state) {
                                state.initialPlacement = 'top-start';
                                return state;
                            },
                        },
                    ]}
                    className={clsx(
                        'regular-14',
                        css.rootDatePicker,
                        {
                            [css.valid]: isValidDate(field.value) && !errorMessage,
                            [css.error]: !!errorMessage,
                        }
                    )}
                    placeholderText={placeholder}
                    selected={isValidDate(field.value) ? field.value : null}
                    value={rawInputValue}
                    dateFormat='dd.MM.yyyy'
                    maxDate={new Date()}
                    minDate={minDate instanceof Date ? minDate : new Date(minDate)}
                    onChange={(date) => {
                        if (isValidDate(date)) {
                            field.onChange(date);
                            dispatch(updateField({
                                path: name,
                                value: date.toISOString()
                            }));

                            setRawInputValue(format(date, 'dd.MM.yyyy'));
                            setFormatError(null);
                        } else {
                            field.onChange(undefined);
                            dispatch(updateField({ path: name, value: null }));
                        }
                    }}
                    onChangeRaw={(e) => {
                        if (!e) return;
                        const val = (e.target as HTMLInputElement).value;
                        setRawInputValue(val);
                        if (formatError) setFormatError(null);
                    }}
                    onKeyDown={(e) => {
                        if (e.ctrlKey || e.metaKey) {
                            return;
                        }
                        const allowedKeys = [
                        'Backspace',
                        'Tab',
                        'ArrowLeft',
                        'ArrowRight',
                        'Delete',
                        'Enter',
                        ];
                        const isDigit = e.key >= '0' && e.key <= '9';

                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleParse();
                        } else if (
                            !isDigit &&
                            !allowedKeys.includes(e.key) &&
                            e.key !== '.'
                        ) {
                            e.preventDefault();
                        }
                    }}
                    onBlur={() => {
                        field.onBlur();
                        handleParse();
                    }}
                    renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => {
                        const monthName = format(date, 'LLLL', { locale: ru });
                        const year = format(date, 'yyyy', { locale: ru });

                        return (
                            <div className='react-datepicker__header-top'>
                                <button
                                    className={
                                        'react-datepicker__navigation react-datepicker__navigation--previous'
                                    }
                                    type='button'
                                    onClick={decreaseMonth}
                                    aria-label='Предыдущий месяц'
                                >
                                    <ArrowLeftIcon />
                                </button>
                                <span className='react-datepicker__current-month'>
                                    <span
                                        className={clsx(
                                        'bold-18',
                                        'react-datepicker__current-month-name'
                                        )}
                                    >
                                        {monthName}
                                    </span>
                                    <span
                                        className={clsx(
                                        'regular-16',
                                        'react-datepicker__current-month-year'
                                        )}
                                    >
                                        {year}
                                    </span>
                                </span>
                                <button
                                className={
                                    'react-datepicker__navigation react-datepicker__navigation--next'
                                }
                                type='button'
                                onClick={increaseMonth}
                                aria-label='Следующий месяц'
                                >
                                    <ArrowRightIcon />
                                </button>
                            </div>
                        );
                    }}
                />
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </>
        </div>
    );
}
