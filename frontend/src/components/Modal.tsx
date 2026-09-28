import { useEffect, useId, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";

interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog && !dialog.open) {
            dialog.showModal();
        }
    }, []);

    function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    return (
        <dialog
            ref={dialogRef}
            className="modal"
            aria-labelledby={titleId}
            onClose={onClose}
            onClick={handleBackdropClick}
        >
            <div className="modal-content">
                <div className="modal-header">
                    <h2 id={titleId}>{title}</h2>
                    <button type="button" className="modal-close" aria-label="Fermer" onClick={onClose}>
                        ×
                    </button>
                </div>
                {children}
            </div>
        </dialog>
    );
}
