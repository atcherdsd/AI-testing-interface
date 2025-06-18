import { FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import css from './FormRadioGroup.module.scss';
import clsx from "clsx";

interface FormRadioGroupProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    options: {
        label: string;
        value: string;
    }[];
    register: UseFormRegister<T>;
    registerOptions?: RegisterOptions<T, Path<T>>;
    error?: string;
    isInColumnOnMobile?: boolean;
    isInColumnOnTablet?: boolean;
    isReg14?: boolean;
}

export const FormRadioGroup = <T extends FieldValues> ({
    label,
    name,
    options,
    register,
    registerOptions,
    error,
    isReg14,
    isInColumnOnMobile = true,
    isInColumnOnTablet = false
}: FormRadioGroupProps<T>) => {;
    // RHF автоматически обрабатывает методы registerOptions
    const registerProps = register(name, registerOptions || {});

    const radioContainerCName = clsx(
        css.rootRadioContainer,
        isInColumnOnMobile && css.columnMobile,
        isInColumnOnTablet && css.columnTablet
    );
    const labelTextCName = clsx(
        isReg14 ? 'regular-14': 'regular-12',
        css.rootLabelText
    );

    return (
        <fieldset className={css.root}>
            <legend className='regular-16'>{label}</legend>

            <div className={radioContainerCName}>
                {options.map((option) => (
                    <label className={css.rootLabel} key={option.value}>
                        <span className={css.rootInputContainer}>
                            <input
                                {...registerProps}
                                className={css.rootInput}
                                type='radio'
                                value={option.value}
                            />
                        </span>
                        <span className={labelTextCName}>{option.label}</span>
                    </label>
                ))}
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </fieldset>
    )
};
