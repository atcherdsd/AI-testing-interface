'use client';

import ReactDOM from 'react-dom';
import css from './Modal.module.scss';

interface ModalProps {
    message: string;
    onClose: () => void;
}

export default function Modal({ message, onClose }: ModalProps) {
    const modalRoot = typeof document !== 'undefined'
        ? document.getElementById('modal-root') || (() => {
                const div = document.createElement('div');
                div.id = 'modal-root';
                document.body.append(div);
                return div;
            })()
        : null;

    if (!modalRoot) return null;

    const modalContent = (
        <div className={css.root} onClick={onClose}>
            <div className={css.rootContent} onClick={e => e.stopPropagation()}>
                <p>{message}</p>
                <button className={css.rootCloseButton} onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, modalRoot);
};
