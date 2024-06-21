import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import "./index.css";

interface ModalProps {
    title: string;
    children: any;
}

const ModalExitAccess = forwardRef<ModalMethods | undefined, ModalProps>(
    ({ title, children }, ref) => {
        const dialog = useRef<HTMLDialogElement>(null);

        useImperativeHandle(
            ref,
            () => ({
                open: () => {
                    if (dialog.current) {
                        dialog.current.showModal();
                    }
                },
                close: () => {
                    if (dialog.current) {
                        dialog.current.close();
                    }
                },
            }),
            []
        );

        return createPortal(
            <dialog id='modal' ref={dialog}>
                <h2>{title}</h2>
                <form method='dialog' id='modal-actions'>
                    {children}
                </form>
            </dialog>,
            document.getElementById("modal-root")!
        );
    }
);

interface ModalMethods {
    open: () => void;
    close: () => void;
}

export default ModalExitAccess;
