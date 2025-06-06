import {ReactNode, useEffect, useRef, useState} from "react";
import ChevronUp from "../../assets/icons/ChevronUp";
import ChevronDown from "../../assets/icons/ChevronDown";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";

interface CollapsibleSectionProps {
    title: string;
    subTitle?: string;
    children: ReactNode;
    className?: string;
    isCollapsed?: boolean; // Optional external control
    setCollapsed?: (collapsed: boolean) => void; // Optional setter function
    icon?: ReactNode; // Optional icon to display next to the title
    grow?: boolean; // Optional prop to control growth behavior
}

function CollapsibleSection({
                                title,
                                subTitle,
                                children,
                                isCollapsed: externalCollapsed,
                                setCollapsed: externalSetCollapsed,
                                className = "",
                                icon,
                                grow = true,
                            }: CollapsibleSectionProps) {
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const [internalGrow, setInternalGrow] = useState<boolean>(grow);
    const localRef = useRef<HTMLDivElement>(null);
    // Internal state if not controlled externally
    const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);

    useEffect(() => {
        setInternalGrow(grow);
    }, [grow]);

    // Sync external state if provided
    useEffect(() => {
        if (externalCollapsed !== undefined) {
            setInternalCollapsed(externalCollapsed);
        }
    }, [externalCollapsed]);

    useEffect(() => {
        if (!internalCollapsed) {
            setInternalGrow(false);
        } else {
            setInternalGrow(grow);
        }
    }, [internalCollapsed, grow]);

    useEffect(() => {
        const element = localRef.current;
        if (element) {
            const resetTransform = () => {
                element.style.transform = "scale(1)";
            };

            element.addEventListener("focusout", resetTransform);
            // Optionally, also listen to touchend if needed on mobile
            element.addEventListener("touchend", resetTransform);

            return () => {
                element.removeEventListener("focusout", resetTransform);
                element.removeEventListener("touchend", resetTransform);
            };
        }
    }, []);

    // Ensure setCollapsed is always available
    const setCollapsed = externalSetCollapsed ?? setInternalCollapsed;

    // Toggle function
    const toggleCollapse = () => {
        setCollapsed(!internalCollapsed);
    };

    return (
        <div
            ref={localRef}
            className={`${className} border ${
                isDarkTheme ? "border-gray-700" : "border-gray-300"
            } shadow-xl overflow-hidden transition-all ${
                internalGrow && "hover:scale-x-100 hover:scale-y-110"
            }`}
        >
            <div
                style={{
                    backgroundColor: isDarkTheme ? "#374151" : "#f3f4f6",
                    color: isDarkTheme ? "#f3f4f6" : "#374151",
                }}
                className="flex justify-between items-center p-3 cursor-pointer"
                onClick={toggleCollapse}
            >
                {/* Left side: Optional icon and text */}
                {icon ? (
                    <div className="flex w-full items-center">
                        <div
                            style={{width: "5rem", marginLeft: "-1em"}}
                            className="flex justify-center items-center"
                        >
                            {icon}
                        </div>
                        <div className="w-full">
                            <h3
                                className="text-xl font-semibold"
                                style={{
                                    backgroundColor: isDarkTheme ? "#374151" : "#f3f4f6",
                                    color: isDarkTheme ? "#f3f4f6" : "#374151",
                                }}
                            >
                                {title}
                            </h3>
                            {subTitle && (
                                <p
                                    className="text-sm"
                                    style={{color: isDarkTheme ? "#f3f4f6" : "#344151"}}
                                >
                                    {subTitle}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        <h3
                            className="text-xl font-semibold"
                            style={{
                                backgroundColor: isDarkTheme ? "#374151" : "#f3f4f6",
                                color: isDarkTheme ? "#f3f4f6" : "#374151",
                            }}
                        >
                            {title}
                        </h3>
                        {subTitle && (
                            <p
                                className="text-sm"
                                style={{color: isDarkTheme ? "#f3f4f6" : "#344151"}}
                            >
                                {subTitle}
                            </p>
                        )}
                    </div>
                )}

                {/* Right side: Chevron for toggling */}
                <div
                    className="flex-shrink-0"
                    style={{
                        backgroundColor: isDarkTheme ? "#374151" : "#f3f4f6",
                        color: isDarkTheme ? "#f3f4f6" : "#374151",
                    }}
                >
                    {internalCollapsed ? (
                        <ChevronDown className="w-5 h-5 transition-transform duration-300"/>
                    ) : (
                        <ChevronUp className="w-5 h-5 transition-transform duration-300"/>
                    )}
                </div>
            </div>
            <div
                className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
                    internalCollapsed ? "max-h-0" : "h-full"
                }`}
            >
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default CollapsibleSection;
