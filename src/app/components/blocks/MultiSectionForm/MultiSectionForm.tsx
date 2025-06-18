'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, Path, useForm } from 'react-hook-form';
import { FormSchema, formSchema } from '@/lib/schemas/questionsFormSchema';
import { FormInput } from '../../ui/FormInput/FormInput';
import { FormRadioGroup } from '../../ui/FormRadioGroup/FormRadioGroup';
import css from './MultiSectionForm.module.scss';
import { MultiSectionFormData } from '@/lib/interfaces';
import ThumbsUpIcon from '@/icons/thumbs-up.svg';
import FlagIcon from '@/icons/flag.svg';
import Heading from '../../ui/Heading/Heading';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { resetSurveyFormData, setSurveyFormData, setSurveyFormValid, updateField } from '@/store/slices/formStateSlice';
import DateInput from '../../ui/DateInput.tsx/DateInput';
import clsx from 'clsx';

type MultiSectionFormProps = MultiSectionFormData;

export default function MultiSectionForm({
    asFormTitle,
    commonInfoSection,
    rulesSection,
    radioSections,
    commonQuestions
}: MultiSectionFormProps) {
    const dispatch = useDispatch();

    const methods = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            childName: '',
            birthDate: undefined,
            gender: 'male',
            parentName: '',
            section1: { q1: '', q2: '', q3: '', q4: '' },
            section2: { q1: '', q2: '', q3: '', q4: '' },
            section3: { q1: '', q2: '', q3: '', q4: '' },
            section4: { q1: '', q2: '', q3: '', q4: '' },
            section5: { radio: '', free1: '', free2: '', free3: '', free4: '' },
        }
    })

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid, dirtyFields },
        getValues,
    } = methods;

    // Очистка старого состояния формы при монтировании
    useEffect(() => {
        dispatch(resetSurveyFormData());
    }, [dispatch]);

    // Учет предзаполненных значений
    useEffect(() => {
        dispatch(setSurveyFormData(structuredClone(getValues())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(setSurveyFormValid(isValid));
    }, [isValid, dispatch]);

    // Диспатч только текущего поля (каждого простого)
    const dispatchField = (fieldName: Path<FormSchema>) => {
        const value = getValues(fieldName);
        dispatch(updateField({ path: fieldName, value }));
    };

    const {
        childInfoTitle,
        childName,
        birthDate: birthDateField,
        gender,
        parentName
    } = commonInfoSection;
    const { rulesTitle, rules } = rulesSection;

    const onSubmit = (data: FormSchema) => {
        // сабмит через StepNavigator
        console.log('Local submit data: ', data);
    }

    return (
        <FormProvider {...methods}>
            <form className={css.root} aria-labelledby='form-title' onSubmit={handleSubmit(onSubmit)}>
                <h2 id='form-title' className='visually-hidden'>
                    {asFormTitle}
                </h2>

                <fieldset>
                    <legend className='title-3-20'>{childInfoTitle}</legend>

                    <div className={css.rootCommonQuestionsWrapper}>
                        <FormInput
                            label={childName.label}
                            name='childName'
                            register={register}
                            registerOptions={{ onBlur: () => dispatchField('childName') }}
                            error={errors.childName?.message}
                            isValid={!!dirtyFields.childName && !errors.childName}
                        />

                        <DateInput
                            control={control}
                            name='birthDate'
                            label={birthDateField.label}
                            placeholder={birthDateField.placeholder}
                            minDate={birthDateField.minDate}
                        />

                        <FormRadioGroup
                            label={gender.label}
                            name='gender'
                            options={[
                                { value: 'male', label: gender.options[0] },
                                { value: 'female', label: gender.options[1] },
                            ]}
                            register={register}
                            registerOptions={{ onChange: () => dispatchField('gender') }}
                            error={errors.gender?.message}
                            isInColumnOnMobile={false}
                            isReg14={true}
                        />
                        <FormInput
                            label={parentName.label}
                            name='parentName'
                            register={register}
                            registerOptions={{ onBlur: () => dispatchField('parentName') }}
                            error={errors.parentName?.message}
                            isValid={!!dirtyFields.parentName && !errors.parentName}
                        />
                    </div>
                </fieldset>

                <section role='note' aria-labelledby='note-title'>
                    <h3 id='note-title' className='visually-hidden'>{rulesTitle}</h3>

                    <div className={css.rootRules}>
                        {rules.length && rules.map((rule) =>(
                            <div className={css.rootRuleWrapper} key={rule.text}>
                                <div className={css.rootRuleIcon}>
                                    {rule.iconType === 'thumbsUp' && <ThumbsUpIcon />}
                                    {rule.iconType === 'flag' && <FlagIcon />}
                                </div>
                                <p className={clsx('regular-14')}>
                                    {rule.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className={css.rootSpecialQuestions}>
                    {radioSections.length && radioSections.map((section, sectionIdx) => (
                        <div className={css.rootRadioSection} key={section.title}>
                            <Heading
                                className={css.rootRadioSectionTitle}
                                level={3}
                                title={section.title}
                            />

                            <div className={css.rootSpecialQuestionsWrapper}>
                                {section.questions.length && section.questions.map((q, i) => {
                                    const sectionKey = `section${sectionIdx + 1}` as
                                        | 'section1'
                                        | 'section2'
                                        | 'section3'
                                        | 'section4';
                                    const questionKey = `q${i + 1}` as 'q1' | 'q2' | 'q3' | 'q4';
                                    const fieldName = `${sectionKey}.${questionKey}` as Path<FormSchema>;

                                    return (
                                        <FormRadioGroup
                                            key={fieldName}
                                            label={q}
                                            name={fieldName}
                                            options={[
                                                { value: '1', label: 'Очень редко' },
                                                { value: '2', label: 'Редко' },
                                                { value: '3', label: 'Иногда' },
                                                { value: '4', label: 'Часто' },
                                                { value: '5', label: 'Всегда' },
                                            ]}
                                            register={register}
                                            registerOptions={{ onChange: () => dispatchField(fieldName) }}
                                            error={errors[sectionKey]?.[questionKey]?.message}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div className={css.rootCommonQuestions}>
                        <Heading
                            className={css.rootCommonQuestionsTitle}
                            level={3}
                            title={commonQuestions.title}
                        />
                        <FormRadioGroup
                            label={commonQuestions.radioQuestion}
                            name='section5.radio'
                            options={[
                                { value: '5', label: 'Отличное' },
                                { value: '4', label: 'Хорошее' },
                                { value: '3', label: 'Удовлетворительное' },
                                { value: '2', label: 'Неудовлетворительное' },
                                { value: '1', label: 'Очень плохое' },
                            ]}
                            isInColumnOnMobile={false}
                            isInColumnOnTablet
                            register={register}
                            registerOptions={{ onChange: () => dispatchField('section5.radio') }}
                            error={errors.section5?.radio?.message}
                        />
                        {commonQuestions.freeQuestions.length &&
                            commonQuestions.freeQuestions.map((q, i) => {
                                const freeQuestionKey = `free${i + 1}` as
                                    | 'free1'
                                    | 'free2'
                                    | 'free3'
                                    | 'free4';
                                const fieldName = (`section5.${freeQuestionKey}`) as Path<FormSchema>;

                                return (
                                    <FormInput
                                        key={fieldName}
                                        as='textarea'
                                        label={typeof q === 'object' && 'text' in q ? q.text : q}
                                        name={fieldName}
                                        isSmallArea={typeof q === 'object' && q.isSmallArea}
                                        register={register}
                                        registerOptions={{ onBlur: () => dispatchField(fieldName) }}
                                        error={errors.section5?.[freeQuestionKey]?.message}
                                        isValid={
                                            !!dirtyFields.section5?.[freeQuestionKey] &&
                                            !errors.section5?.[freeQuestionKey]
                                        }
                                    />
                                )
                            }
                        )}
                    </div>
                </div>
            </form>
        </FormProvider>
    )
};
