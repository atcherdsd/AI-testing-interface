'use client';

import css from './Modal.module.scss';

interface ModalProps {
    message: string;
    onClose: () => void;
}

export default function Modal({ message, onClose }: ModalProps) {
    return (
        <div className={css.root} onClick={onClose}>
            <div className={css.rootContent} onClick={(e) => e.stopPropagation()}>
                <p>{message}</p>
                <button className={css.rootCloseButton} onClick={onClose}>Закрыть</button>
            </div>
        </div>
    )
};
