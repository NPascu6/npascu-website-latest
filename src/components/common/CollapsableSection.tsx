import { useState } from "react";
import { JsxElement } from "typescript";
import ChevronUp from "../../assets/icons/ChevronUp";
import ChevronDown from "../../assets/icons/ChevronDown";

interface CollapsibleSectionpProps {
    title: string,
    children: JsxElement | any
    isCollapsed?: boolean
    subTitle?: string
    hideTitleOnOpen?: boolean
}

const CollapsibleSection = ({ title, children, isCollapsed = false, subTitle = "", hideTitleOnOpen = false }: CollapsibleSectionpProps) => {
    const [isOpen, setIsOpen] = useState(isCollapsed);

    const toggleSection = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div className="select-none collapsable-section mt-1">
            <div className={"flex space-between cursor-pointer shadow-xl p-1"} onClick={(e) => toggleSection(e)}>
                <div className='w-full text-sm font-bold alig-center'>
                    {(hideTitleOnOpen ? !isOpen && <div className={'pl-2'}>{title}</div> :
                        <div className={'pl-2'}>{title}</div>)
                    }
                    {subTitle && <span className="font-normal text-xs pl-2">{subTitle}</span>}
                </div>
                <div > {isOpen ? <ChevronUp /> : <ChevronDown />}</div>
            </div>
            <div className="shadow-xl collapsable-section-body p-1" style={{ marginTop: isOpen ? !subTitle ? '-1em' : '-1em' : '-0.5em' }}>
                {isOpen && children}
            </div>
        </div>
    );
}

export default CollapsibleSection