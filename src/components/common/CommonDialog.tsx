import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface CommonDialogProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    isOpen: boolean;
}

const CommonDialog: React.FC<CommonDialogProps> = ({
                                                       title,
                                                       children,
                                                       onClose,
                                                       isOpen,
                                                   }) => {
    // Lock background scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={
                    `relative w-full max-w-3xl max-h-[90vh] overflow-y-auto
          bg-white dark:bg-gray-900 shadow-2xl
          transform transition-all duration-200 ease-out
          scale-100 opacity-100
          p-4 m-4`}
            >
                {/* Close Button in top-right */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-2xl"
                    aria-label="Close dialog"
                >
                    &times;
                </button>
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold text-center">{title}</h2>
                </div>
                <div>{children}</div>
            </div>
        </div>,
        document.body
    );
};

export default CommonDialog;
