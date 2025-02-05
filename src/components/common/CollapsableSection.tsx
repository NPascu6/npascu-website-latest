import { useState, ReactNode, useEffect } from "react";
import ChevronUp from "../../assets/icons/ChevronUp";
import ChevronDown from "../../assets/icons/ChevronDown";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface CollapsibleSectionProps {
  title: string;
  subTitle?: string;
  children: ReactNode;
  className?: string;
  isCollapsed?: boolean; // Optional external control
  setCollapsed?: (collapsed: boolean) => void; // Optional setter function
}

function CollapsibleSection({
  title,
  subTitle,
  children,
  isCollapsed: externalCollapsed,
  setCollapsed: externalSetCollapsed,
  className = "",
}: CollapsibleSectionProps) {
  const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

  // Internal state if not controlled externally
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);

  // Sync external state if provided
  useEffect(() => {
    if (externalCollapsed !== undefined) {
      setInternalCollapsed(externalCollapsed);
    }
  }, [externalCollapsed]);

  // Ensure setCollapsed is always available
  const setCollapsed = externalSetCollapsed ?? setInternalCollapsed;

  // Toggle function
  const toggleCollapse = () => {
    setCollapsed(!internalCollapsed);
  };

  return (
    <div
      className={`${className} border ${
        isDarkTheme ? "border-gray-700" : "border-gray-300"
      } shadow-xl overflow-hidden transition-all`}
    >
      <div
        className="flex justify-between items-center p-4 cursor-pointer bg-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors dark:bg-gray-700"
        onClick={toggleCollapse}
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {subTitle && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {subTitle}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          {internalCollapsed ? (
            <ChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform duration-300" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform duration-300" />
          )}
        </div>
      </div>
      <div
        className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
          internalCollapsed ? "max-h-0" : "max-h-screen"
        }`}
      >
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}

export default CollapsibleSection;
