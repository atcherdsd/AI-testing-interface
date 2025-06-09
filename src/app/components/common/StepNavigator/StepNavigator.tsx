'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { nextStep, prevStep } from '@/store/slices/progessSlice';
import type { RootState, AppDispatch } from '@/store/store';
import { BaseUI } from '@/lib/interfaces';
import css from './StepNavigator.module.scss';
import { totalSteps } from '@/lib/steps';
import Button from '../../ui/Button/Button';
import PageData from '@/data/index.json';
import ArrowRightIcon from '@/icons/arrow-2-right.svg';
import ArrowLeftIcon from '@/icons/Arrow-left.svg';
import ForwardRightIcon from '@/icons/Forward-right.svg';
import DownloadIcon from '@/icons/download.svg';
import SendIcon from '@/icons/Send.svg';

export type StepNavigatorProps = BaseUI;

export default function StepNavigator({}: StepNavigatorProps) {
    const currentStep = useSelector((state: RootState) => state.progress.currentStep);
    const dispatch = useDispatch<AppDispatch>();

    const router = useRouter();

    const { navButton } = PageData.step1;
    const { navButtons } = PageData.step2;
    const { shareButtons } = PageData.step3;

    const handleNext = () => {
        const next = currentStep + 1;
        dispatch(nextStep());
        router.push(`/assessment/step/${next}`);
    };

    const handlePrev = () => {
        const prev = currentStep - 1;
        dispatch(prevStep());
        router.push(`/assessment/step/${prev}`);
    };

    return (
        <div className={css.root}>
            <p>{currentStep}/{totalSteps}</p>

            {currentStep === 1 && (
                <Button clickHandler={handleNext} variant='textFirst' {...navButton} >
                    <ArrowRightIcon />
                </Button>
            )}

            {(currentStep > 1) && (currentStep < totalSteps) && (
                <div>
                    <Button clickHandler={handlePrev} variant='iconFirst' {...navButtons[0]} >
                        <ArrowLeftIcon />
                    </Button>
                    <Button clickHandler={handleNext} variant='textFirst' {...navButtons[1]}>
                        <ForwardRightIcon />
                    </Button>
                </div>
            )}

            {currentStep === totalSteps && (
                <div>
                    <Button clickHandler={() => {/* скачать */}} variant='textFirst' {...shareButtons[0]}>
                        <DownloadIcon />
                    </Button>
                    <Button clickHandler={() => {/* отправить */}} variant='textFirst' {...shareButtons[1]}>
                        <SendIcon />
                    </Button>
                </div>
            )}
        </div>
    );
}
