import React, { useEffect, useState } from 'react';

const Sidebar = ({ toggle, setToggle }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        console.log('renmder')
        if (toggle) {
            setIsOpen(toggle);
        }
        else {
            setIsOpen(false);
        }

        return () => {
            setIsOpen(false);
        }
    }, [toggle])

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (event.target.id !== 'side-bar') {
                setIsOpen(false);
                setToggle(false);
            }
        }

        // Add the event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsOpen, setToggle]);

    return (
        <div id={'side-bar'} className={`fixed top-0 left-0 h-full w-38 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Sidebar content goes here */}
            <div className="p-4">
                <ul>
                    <li>Coming soon...</li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
