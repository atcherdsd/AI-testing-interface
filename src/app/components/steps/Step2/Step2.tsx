import React from 'react';
import PageData from '@/data/index.json';
import MultiSectionForm from '../../blocks/MultiSectionForm/MultiSectionForm';
import { mapStringToEnum } from '@/lib/utils/enumHelper';
import { IconType } from '@/lib/interfaces';

export default function Step2() {
    const stepData = PageData.step2;
    const formData = stepData.form;

    const parsedFormData = {
        ...formData,
        rulesSection: {
            ...formData.rulesSection,
            rules: formData.rulesSection.rules.map(rule => ({
                ...rule,
                iconType: mapStringToEnum(IconType, rule.iconType, IconType.Flag),
            }))
        }

    };

    return (
        <>
            <h1 className='visually-hidden'>{stepData.asPageTitle}</h1>
            <p className='visually-hidden'>{stepData.descriptionWhere}</p>

            <section>
                <MultiSectionForm {...parsedFormData} />
            </section>
        </>
    )
}
