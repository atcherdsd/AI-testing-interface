'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { nextStep, prevStep } from '@/store/slices/progessSlice';
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
import { clearError, selectAllUploaded, setIsDemo, uploadImages } from '@/store/slices/imagesSlice';
import { useImagesContext } from '@/app/assessment/context/ImagesContext';
import Modal from '../../ui/Modal/Modal';
import clsx from 'clsx';
import { selectSurveyFormValid } from '@/store/slices/formStateSlice';
import { resetSurveyState, selectSurvey, submitSurvey } from '@/store/slices/surveySlice';
import { resetReportState, setTaskId } from '@/store/slices/reportSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useReportContainerRef } from '@/app/assessment/context/ReportContainerRefContext';

export type StepNavigatorProps = BaseUI;

export interface UploadResponse {
    task_id: string;
}

const mockEnabledMsg =
    'Сервер недоступен. Файлы не были отправлены - вы можете продолжить работу в демо-режиме или повторить отправку файлов на сервер, вернувшись на шаг 1.';

export default function StepNavigator({}: StepNavigatorProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const currentStep = useAppSelector((state) => state.progress.currentStep);
    const imagesStatus = useAppSelector((state) => state.images.status);
    const allUploaded = useAppSelector(selectAllUploaded);
    const { filesRef } = useImagesContext();
    const { containerRef } = useReportContainerRef();

    const isValid = useAppSelector(selectSurveyFormValid);
    const { surveyStatus , serverResponse, mockMarkdown } = useAppSelector(selectSurvey);

    const { status: reportStatus, pdfUrl, } = useAppSelector(state => state.report);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [modalMessage, setModalMessage] = useState<string | null>(null);

    const { navButton } = PageData.step1;
    const { navButtons } = PageData.step2;
    const { shareButtons } = PageData.step3;

    useEffect(() => {
        if (currentStep === 1) dispatch(setIsDemo(false));
    }, [currentStep, dispatch]);

    const handleNext = async () => {
        if (currentStep === 1) {
            const files = filesRef.current.filter((f): f is File => f !== null);

            try {
                const response = await dispatch(uploadImages(files)).unwrap();

                if ('__mock' in response) {
                    setModalMessage(mockEnabledMsg);
                    dispatch(setIsDemo(true));
                }

                dispatch(nextStep());
                router.push(`/assessment/step/${currentStep + 1}`);
            } catch (e) {
                console.error('Ошибка отправки:', e);
                const errorMessage = e instanceof Error ? e.message : 'Неизвестная ошибка при загрузке файлов';
                setModalMessage(`
                    Ошибка загрузки файлов: ${errorMessage}. Попробуйте отправить файлы позже
                `);
            }

        } else if (currentStep === 2) {
            try {
                // очистка прошлого статуса
                dispatch(resetSurveyState());
                dispatch(resetReportState());

                const response = await dispatch(submitSurvey()).unwrap();

                if (typeof response === 'string') {
                    dispatch(nextStep());
                    router.push(`/assessment/step/${currentStep + 1}`);
                } else {
                    setModalMessage(response.message);
                    dispatch(setTaskId(response.task_id));
                }

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

        if (surveyStatus === 'succeeded' && serverResponse) {
            dispatch(nextStep());
            router.push(`/assessment/step/${currentStep + 1}`);
        }
    };

    const rootCName = clsx(
        css.root,
        mounted ? css.visible : css.hidden,
        currentStep === 2 && css.columnMobile,
        currentStep === totalSteps && css.columnTablet
    );

    const isReportReady = Boolean(mockMarkdown) || (reportStatus === 'ready' && !!pdfUrl);

    const downloadReport = async () => {
        if (mockMarkdown && containerRef) {
            const html2pdf = (await import('html2pdf.js')).default;
            try {
                const opt = {
                    margin:       10,
                    filename:     'report.pdf',
                    image:        { type: "jpeg" as const, quality: 0.98 },
                    html2canvas:  { scale: 2 },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
                };
                await html2pdf().from(containerRef).set(opt).save();
            } catch (err) {
                console.error('Ошибка при скачивании PDF:', err);
            }
        }
    };

    const openReportInPdf = async () => {
        if (mockMarkdown && containerRef) {
            const html2pdf = (await import('html2pdf.js')).default;
            try {
                const opt = {
                    margin:       10,
                    filename:     'report.pdf',
                    image:        { type: 'jpeg' as const, quality: 0.98 },
                    html2canvas:  { scale: 2 },
                    jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' as const },
                };

                const blob = await html2pdf().from(containerRef).set(opt).outputPdf('blob');
                if (blob instanceof Blob) {
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                } else if (typeof blob === 'string') {
                    window.open(blob, '_blank');
                }
            } catch (err) {
                console.error('Ошибка при просмотре PDF:', err);
            }
        }
    };

    return (
        <div className={rootCName}>
            <p className={`bold-14 ${css.rootCurrentStep}`}>Шаг {currentStep}/{totalSteps}</p>

            {currentStep === 1 && (
                <Button
                    className={clsx(
                        css.rootButton,
                        imagesStatus === 'loading' ? css.loadingGradient : ''
                    )}
                    disabled={imagesStatus === 'loading' || !allUploaded}
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
                        className={clsx(
                            css.rootButton,
                            surveyStatus === 'loading' ? css.loadingGradient : ''
                        )}
                        disabled={!isValid || surveyStatus === 'loading'}
                        clickHandler={handleNext}
                        variant='textFirst'
                        ifFullWidth
                        {...navButtons[1]}
                    >
                        <ForwardRightIcon />
                    </Button>
                </div>
            )}

            {currentStep === totalSteps && isReportReady && (
                <div className={css.rootButtonsContainer}>
                    {mockMarkdown && (
                        <>
                            <Button clickHandler={downloadReport} variant='textFirst' isPaddingLarge {...shareButtons[0]}>
                                <DownloadIcon />
                            </Button>
                            <Button clickHandler={openReportInPdf} variant='textFirst' {...shareButtons[1]}>
                                <SendIcon />
                            </Button>
                        </>
                    )}
                    {reportStatus === 'ready' && !!pdfUrl && (
                        <>
                            <Button href={pdfUrl} download variant='textFirst' isPaddingLarge {...shareButtons[0]}>
                                <DownloadIcon />
                            </Button>
                            <Button href={pdfUrl} isBlank variant='textFirst' {...shareButtons[1]}>
                                <SendIcon />
                            </Button>
                        </>
                    )}
                </div>
            )}

            {modalMessage && <Modal message={modalMessage} onClose={closeModal} />}
        </div>
    );
}
