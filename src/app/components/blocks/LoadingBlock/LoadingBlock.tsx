'use client';

import { BaseUI } from '@/lib/interfaces';
import css from './LoadingBlock.module.scss';
import LoadIcon from '@/icons/load.svg';
import ReloadIcon from '@/icons/reload.svg';
import Button from '../../ui/Button/Button';
import { ChangeEvent, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { clearError, resetImage, setImage } from '@/store/slices/imagesSlice';
import Modal from '../../ui/Modal/Modal';
import { useImagesContext } from '@/app/assessment/context/ImagesContext';
import clsx from 'clsx';

const MAX_FILE_SIZE_MB = 5;

interface LoadingBlockProps extends BaseUI {
    index: number;
    capture: string;
    errorMessage: string;
}

export default function LoadingBlock({ index, capture, errorMessage, className }: LoadingBlockProps) {
    const dispatch = useDispatch<AppDispatch>();
    const url = useSelector((state: RootState) => state.images.urls[index]);
    const { filesRef } = useImagesContext();

    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        e.target.value = '';

        const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
        if (!isValidSize) {
            setModalMessage(errorMessage);
            return;
        }

        const url = URL.createObjectURL(file);
        dispatch(setImage({ index, url }));

        filesRef.current[index] = file;
    };

    const onButtonClick = () => {
        inputRef.current?.click();
    };
    const closeModal = () => {
        dispatch(clearError());
        setModalMessage(null);
    };

    const rootClassName = clsx(css.root, className);

    return (
        <div className={rootClassName}>
            <label
                className={css.rootImageSlot}
                aria-label={url ? "Загрузить изображение заново" : "Загрузить изображение"}
            >
                <input
                    ref={inputRef}
                    type='file'
                    accept='.jpg,.jpeg,.png,.pdf'
                    onChange={onFileChange}
                    hidden
                    aria-label={`Загрузить файл для ${capture.toLowerCase()}`}
                />

                {!url ? (
                    <Button
                        className={css.rootButton}
                        variant='load'
                        clickHandler={onButtonClick}
                        aria-label='Загрузить файл'
                    >
                        <LoadIcon />
                    </Button>
                ) : (
                    <>
                        <div
                            className={css.rootPreview}
                            style={{ backgroundImage: `url(${url})` }}
                        />
                        <Button
                            className={css.rootButton}
                            variant='load'
                            clickHandler={() => dispatch(resetImage(index))}
                            aria-label="Загрузить файл заново"
                        >
                            <ReloadIcon />
                        </Button>
                    </>
                )}
            </label>
            <p className={`regular-16 ${css.rootCapture}`}>{capture}</p>

            {modalMessage && <Modal message={modalMessage} onClose={closeModal} />}
        </div>
    )
}
