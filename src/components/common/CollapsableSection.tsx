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
        style={{
          backgroundColor: isDarkTheme ? "#374151" : "#f3f4f6",
          color: isDarkTheme ? "#f3f4f6" : "#374151",
        }}
        className="flex justify-between items-center p-3 cursor-pointer"
        onClick={toggleCollapse}
      >
        <div>
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
              style={{ color: isDarkTheme ? "#f3f4f6" : "#344151" }}
            >
              {subTitle}
            </p>
          )}
        </div>
        <div
          className="flex-shrink-0"
          style={{
            backgroundColor: isDarkTheme ? "#374151" : "#f3f4f6",
            color: isDarkTheme ? "#f3f4f6" : "#374151",
          }}
        >
          {internalCollapsed ? (
            <ChevronDown className="w-5 h-5  transition-transform duration-300" />
          ) : (
            <ChevronUp className="w-5 h-5  transition-transform duration-300" />
          )}
        </div>
      </div>
      <div
        className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
          internalCollapsed ? "max-h-0" : ""
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
