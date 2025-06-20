'use client';

import React, { useEffect, useRef, useState } from 'react';
import PageData from '@/data/index.json';
import { selectSurvey, submitSurvey } from '@/store/slices/surveySlice';
import ReactMarkdown from 'react-markdown';
import css from './Step3.module.scss';
import { fetchReportStatus, selectReportState } from '@/store/slices/reportSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useReportContainerRef } from '@/app/assessment/context/ReportContainerRefContext';
import Modal from '../../ui/Modal/Modal';
import { setIsDemo } from '@/store/slices/imagesSlice';

export default function Step3() {
    const { asPageTitle, descriptionWhere } = PageData.step3;
    const dispatch = useAppDispatch();

    const { mockMarkdown } = useAppSelector(selectSurvey);
    const { status: reportStatus, error, pdfUrl, taskId } = useAppSelector(selectReportState);

    const [timedOut, setTimedOut] = useState(false);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    // const [mockMarkdownCauseTimeout, setMockMarkdownCauseTimeout] = useState<string | null>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { setContainerRef } = useReportContainerRef();
    const localRef = useRef<HTMLDivElement>(null);

    // Запись в контекст при монтировании, а также
    // при добавлении mockMarkdown в случае непоступления отчета от сервера:
    useEffect(() => {
        if (mockMarkdown && localRef.current) {
            setContainerRef(localRef.current);
        } else {
            setContainerRef(null);
        }
        return () => {
            setContainerRef(null);
        };
    }, [mockMarkdown, setContainerRef]);

    useEffect(() => {
        if (!mockMarkdown && taskId) {
            const checkStatus = async () => {
                try{
                    const result = await dispatch(fetchReportStatus()).unwrap();

                    if (result.status === 'ready') {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }
                    }
                } catch (e) {
                    console.error('Ошибка получения статуса отчета:', e);
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                }
            };

            checkStatus();
            intervalRef.current = setInterval(checkStatus, 10000);

            const MAX_WAIT = 60000;
            timeoutRef.current = setTimeout(() => {
                setTimedOut(true);
                setModalMessage('Время ожидания отчёта истекло. Показывается демонстрационный отчёт.');
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            }, MAX_WAIT);

            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            };
        }
    }, [dispatch, mockMarkdown, taskId]);

    useEffect(() => {
        if (timedOut && !mockMarkdown) {
            const fetchMock = async () => {
                dispatch(setIsDemo(true));
                await dispatch(submitSurvey())
                    .unwrap()
                    .catch((err: Error) => {
                        console.error('Ошибка демо-API:', err);
                        setModalMessage('Произошла ошибка демо-запроса');
                    });
            };
            fetchMock();
        }
    }, [timedOut, mockMarkdown, dispatch]);

    const handleCloseTimeoutModal = () => {
        setModalMessage(null);
    };

    return (
        <>
            <h1 className='visually-hidden'>{asPageTitle}</h1>
            <p className='visually-hidden'>{descriptionWhere}</p>

            <section className={css.root}>
                {mockMarkdown ? (
                    <div ref={localRef} className={css.mockMarkdownContainer}>
                        <ReactMarkdown>{mockMarkdown}</ReactMarkdown>
                    </div>
                ) : taskId ? (
                    reportStatus === 'loading' || reportStatus === 'processing' ? (
                        <h2 className='title-3-20'>Анализ в процессе...</h2>
                    ) : reportStatus === 'ready' && pdfUrl ? (
                        <h2 className="title-3-20">Отчет готов</h2>
                    ) : reportStatus === 'failed' ? (
                        <h2 className='error-text'>Ошибка при получении отчета: {error}</h2>
                    ) : timedOut ? (
                        mockMarkdown ? (
                            <div ref={localRef} className={css.mockMarkdownContainer}>
                                <ReactMarkdown>{mockMarkdown}</ReactMarkdown>
                            </div>
                        ) : (
                            <h2 className='title-3-20'>
                                Время ожидания готового отчёта истекло. Показан демонстрационный отчёт.
                            </h2>
                        )
                    ) : (
                        // Состояние "idle" или непредвиденное:
                        <h2 className='title-3-20'>Ожидание отчета...</h2>
                    )
                ) : (
                        // Пользователь не прошел шаг 2
                        <h2 className='title-3-20'>Отчет еще не запрошен</h2>
                )}
            </section>

            {modalMessage && <Modal message={modalMessage} onClose={handleCloseTimeoutModal} />}
        </>
    )
}
