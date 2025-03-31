import React, {useEffect, useRef, useState} from "react";

export default function DownloadCVButton() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        // Add click event listener to the entire document
        document.addEventListener("click", handleClickOutside);
        return () => {
            // Clean up the listener when component unmounts
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
    };

    return (
        <div ref={containerRef} className="relative inline-block text-left w-full">
            {/* The main button to open/close the dropdown */}
            <button
                onClick={toggleDropdown}
                className="inline-flex items-center px-2 py-1 bg-green-500 text-white hover:bg-green-700 border border-gray-600 transition-colors duration-300 ease-in-out"
            >
                Download CV
                <span className="ml-2">
        </span>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute left-0 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        <a
                            href="./PascuNorbertresumeEN.pdf"
                            download="PascuNorbertresumeEN.pdf"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            English (EN)
                        </a>
                        <a
                            href="./PascuNorbertAusbildugDE.pdf"
                            download="PascuNorbertAusbildugDE.pdf"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            Deutsch (DE)
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
