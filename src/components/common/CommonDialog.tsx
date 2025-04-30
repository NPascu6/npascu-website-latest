// CommonDialog.tsx
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
                className={`
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          w-full max-w-3xl max-h-[90vh] overflow-y-auto
          rounded-2xl shadow-2xl
          transform transition-all duration-200 ease-out
          scale-95 opacity-0
          animate-modal-in
          p-6
        `}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
                    >
                        &times;
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>,
        document.body
    );
};

export default CommonDialog;
