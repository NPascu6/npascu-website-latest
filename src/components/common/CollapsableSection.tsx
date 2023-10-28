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
        <div className="select-none" id='collapsable-section'>
            <div className="p-2 flex space-between cursor-pointer shadow-xl " onClick={toggleSection}>
                <div className='w-full text-sm font-bold alig-center'>
                    <div className={isOpen ? 'w-full' : 'w-full'}>{title}</div>
                </div>
                <div > {isOpen ? <ChevronUp /> : <ChevronDown />}</div>
            </div>
            <div className="shadow-xl" id="collapsable-section-body" style={{ marginTop: isOpen ? '-1em' : '-0.5em' }}>
                {isOpen && children}
            </div>
        </div>
    );
}

export default CollapsibleSection