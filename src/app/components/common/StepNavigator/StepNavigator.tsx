'use client';

import React, { useEffect, useState } from 'react';
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
import { clearError, selectAllUploaded, uploadImages } from '@/store/slices/imagesSlice';
import { useImagesContext } from '@/app/assessment/context/ImagesContext';
import Modal from '../../ui/Modal/Modal';
import clsx from 'clsx';
import { selectSurveyFormValid } from '@/store/slices/formStateSlice';
import { resetSurveyState, selectSurveyError, selectSurveyStatus, submitSurvey } from '@/store/slices/surveySlice';

export type StepNavigatorProps = BaseUI;

export interface UploadResponse {
    task_id: string;
}

const mockEnabledMsg =
    'Сервер недоступен — вы работаете в демо-режиме. Файлы не были отправлены, но вы можете продолжить работу.';

export default function StepNavigator({}: StepNavigatorProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const currentStep = useSelector((state: RootState) => state.progress.currentStep);
    const status = useSelector((state: RootState) => state.images.status);
    const allUploaded = useSelector(selectAllUploaded);
    const { filesRef } = useImagesContext();

    const isValid = useSelector(selectSurveyFormValid);
    const surveyStatus = useSelector(selectSurveyStatus);
    const surveyError = useSelector(selectSurveyError);

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const [modalMessage, setModalMessage] = useState<string | null>(null);

    const { navButton } = PageData.step1;
    const { navButtons } = PageData.step2;
    const { shareButtons } = PageData.step3;

    const handleNext = async () => {
        if (currentStep === 1) {
            const files = filesRef.current.filter((f): f is File => f !== null);

            try {
                const response = await dispatch(uploadImages(files)).unwrap();

                if ('__mock' in response) {
                    setModalMessage(mockEnabledMsg);
                }

                dispatch(nextStep());
                router.push(`/assessment/step/${currentStep + 1}`);
            } catch (e) {
                console.error('Ошибка отправки:', e);
                const errorMessage = e instanceof Error ? e.message : 'Неизвестная ошибка при загрузке файлов';
                setModalMessage(`Ошибка загрузки файлов: ${errorMessage}`);
            }

        } else if (currentStep === 2) {
            try {
                // очистка прошлго статуса
                dispatch(resetSurveyState());
                await dispatch(submitSurvey()).unwrap();

                dispatch(nextStep());
                router.push(`/assessment/step/${currentStep + 1}`);
            } catch (e) {
                console.error('Ошибка отправки:', e);
                const errorMessage = e instanceof Error ? e.message : 'Неизвестная ошибка отправки анкеты';
                setModalMessage(`Ошибка отправки анкеты: ${errorMessage}`);
            }
        }
    };

    const handlePrev = () => {
        dispatch(prevStep());
        router.push(`/assessment/step/${currentStep - 1}`);
    };

    const closeModal = () => {
        dispatch(clearError());
        setModalMessage(null);
    };

    const rootCName = clsx(
        css.root,
        mounted ? css.visible : css.hidden,
        currentStep === 2 && css.columnMobile
    );

    return (
        <div className={rootCName}>
            <p className={`bold-14 ${css.rootCurrentStep}`}>Шаг {currentStep}/{totalSteps}</p>

            {currentStep === 1 && (
                <Button
                    className={`${css.rootButton} ${status === 'loading' ? css.loadingGradient : ''}`}
                    disabled={status === 'loading' || !allUploaded}
                    style={{ minHeight: '40px'}}
                    clickHandler={handleNext}
                    variant='textFirst'
                    {...navButton}
                >
                    <ArrowRightIcon />
                </Button>
            )}

            {currentStep === 2 && (
                <div className={css.rootButtonsContainer}>
                    <Button clickHandler={handlePrev} variant='iconFirst' ifFullWidth {...navButtons[0]} >
                        <ArrowLeftIcon />
                    </Button>
                    <Button
                        disabled={!isValid || surveyStatus === 'loading'}
                        clickHandler={handleNext}
                        variant='textFirst'
                        ifFullWidth
                        {...navButtons[1]}
                    >
                        <ForwardRightIcon />
                    </Button>
                    {surveyError && <p className="error-text">{surveyError}</p>}
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

            {modalMessage && <Modal message={modalMessage} onClose={closeModal} />}
        </div>
    );
}
