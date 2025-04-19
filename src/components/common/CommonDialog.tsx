import React from "react";

interface CommonDialogProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    isOpen: boolean;
}

const CommonDialog = ({
                          title,
                          children,
                          onClose,
                          isOpen,
                      }: CommonDialogProps) => {
    return isOpen ? (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-700 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-md p-4 m-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className=" text-black text-xl font-semibold">{title}</h2>
                    <button
                        style={{fontSize: "1.5rem"}}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={onClose}
                    >
                        x
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    ) : null;
};

export default CommonDialog;
