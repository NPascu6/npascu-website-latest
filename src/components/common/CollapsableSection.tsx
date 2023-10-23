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
        <div className="border select-none">
            <div className="p-2 flex space-between cursor-pointer" style={{ marginBottom: isOpen ? '-2em' : 0 }} onClick={toggleSection}>
                <div className='w-full text-md font-bold text-centFer'>
                    <div className={isOpen ? 'border-b-2 w-2/3 pb-2' : 'w-full'}>{title}</div>
                </div>
                <div > {isOpen ? <ChevronUp /> : <ChevronDown />}</div>
            </div>
            <div className='card'>
                {isOpen && children}
            </div>
        </div>
    );
}

export default CollapsibleSection