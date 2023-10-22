import { useState } from "react";
import { JsxElement } from "typescript";
import ChevronUp from "../../assets/icons/ChevronUp";
import ChevronDown from "../../assets/icons/ChevronDown";

interface CollapsibleSectionpProps {
    title: string,
    children: JsxElement | any
}

function CollapsibleSection({ title, children }: CollapsibleSectionpProps) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSection = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="rounded border m-2 select-none border">
            <div className="p-2 flex space-between cursor-pointer" onClick={toggleSection}>
                <div className='w-full text-md font-bold text-center'>{title}</div>
                <div > {isOpen ? <ChevronUp /> : <ChevronDown />}</div>
            </div>
            {isOpen && children}
        </div>
    );
}

export default CollapsibleSection