import { useState, ReactNode } from "react";
import ChevronUp from "../../assets/icons/ChevronUp";
import ChevronDown from "../../assets/icons/ChevronDown";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface CollapsibleSectionProps {
  title: string;
  isCollapsed?: any;
  subTitle?: string;
  children: ReactNode;
  setCollapsed?: any;
}

function CollapsibleSection({
  title,
  subTitle,
  children,
  isCollapsed = false,
}: CollapsibleSectionProps) {
  // Default to open unless explicitly collapsed
  const [isOpen, setIsOpen] = useState(!isCollapsed);
  const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

  const toggleSection = () => setIsOpen((prev) => !prev);

  return (
    <div
      className={`border ${
        isDarkTheme ? "border-gray-700" : "border-gray-300"
      }  shadow-sm overflow-hidden`}
    >
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors dark:bg-gray-700 "
        onClick={toggleSection}
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
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </div>
      </div>
      {isOpen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 transition-all duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

export default CollapsibleSection;
