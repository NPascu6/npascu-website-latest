import { useState } from "react";
import { JsxElement } from "typescript";
import ChevronUp from "../../assets/icons/ChevronUp";
import ChevronDown from "../../assets/icons/ChevronDown";

interface CollapsibleSectionpProps {
  title: string;
  isCollapsed?: boolean;
  subTitle?: string;
  children: JsxElement | any;
}

function CollapsibleSection({
  title,
  subTitle,
  children,
  isCollapsed,
}: CollapsibleSectionpProps) {
  const [isOpen, setIsOpen] = useState(isCollapsed ?? false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border select-none w-full">
      <div
        className="p-2 flex space-between cursor-pointer"
        onClick={toggleSection}
      >
        {!isOpen && <div className="w-full">{title}</div>}
        {isOpen && subTitle && (
          <div className="w-full font-bold">{subTitle}</div>
        )}
        <div> {isOpen ? <ChevronUp /> : <ChevronDown />}</div>
      </div>
      {isOpen && children}
    </div>
  );
}

export default CollapsibleSection;
