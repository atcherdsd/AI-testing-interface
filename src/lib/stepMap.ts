import dynamic from 'next/dynamic';
import { steps } from './steps';
import React from 'react';

export type StepId = (typeof steps)[number]['id'];

const createDynamicStepComponent = (id: StepId) =>
    dynamic(() => import(`@/app/components/steps/Step${id}/Step${id}`), {
        loading: () => React.createElement('p', null, `Загрузка шага ${id}...`),
    });

export const stepComponents: Record<StepId, ReturnType<typeof dynamic>> = Object.fromEntries(
    steps.map(({ id }) => [id, createDynamicStepComponent(id)])
) as Record<StepId, ReturnType<typeof dynamic>>;
