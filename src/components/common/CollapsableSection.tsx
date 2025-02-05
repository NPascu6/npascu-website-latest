import { useState, ReactNode } from "react";
import ChevronUp from "../../assets/icons/ChevronUp";
import ChevronDown from "../../assets/icons/ChevronDown";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface CollapsibleSectionProps {
  title: string;
  subTitle?: string;
  children: ReactNode;
  className?: string;
  isCollapsed?: boolean; // Now optional
  setCollapsed?: (collapsed: boolean) => void; // Now optional
}

function CollapsibleSection({
  title,
  subTitle,
  children,
  isCollapsed: externalCollapsed, // Handle optional prop
  setCollapsed: externalSetCollapsed, // Handle optional prop
  className = "",
}: CollapsibleSectionProps) {
  const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

  // Internal state if not controlled externally
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(
    externalCollapsed ?? false
  );

  // Determine the actual collapsed state
  const isCollapsed = externalCollapsed ?? internalCollapsed;
  const setCollapsed = externalSetCollapsed ?? setInternalCollapsed;

  return (
    <div
      className={`${className} border ${
        isDarkTheme ? "border-gray-700" : "border-gray-300"
      } shadow-sm overflow-hidden`}
    >
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors dark:bg-gray-700"
        onClick={() => setCollapsed(!isCollapsed)}
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
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </div>
      </div>
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 transition-all duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

export default CollapsibleSection;
