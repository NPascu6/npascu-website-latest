import { useState } from "react";
import { JsxElement } from "typescript";
import ChevronUp from "../../assets/icons/ChevronUp";
import ChevronDown from "../../assets/icons/ChevronDown";

interface CollapsibleSectionpProps {
  title: string;
  children: JsxElement | any;
}

function CollapsibleSection({ title, children }: CollapsibleSectionpProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border m-1 select-none w-full">
      <div
        className="p-2 flex space-between cursor-pointer"
        onClick={toggleSection}
      >
        {!isOpen &&<div className="w-full">{title}</div>}
        <div> {isOpen ? <ChevronUp /> : <ChevronDown />}</div>
      </div>
      {isOpen && children}
    </div>
  );
}

export default CollapsibleSection;
