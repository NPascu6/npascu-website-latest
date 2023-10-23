import React, { useEffect, useState } from 'react';
import { routeDefinition } from '../../router/routeDefinition';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ toggle, setToggle }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;

        if (active) {
            console.log('Render side toggle')
            setIsOpen(toggle);
        }

        return () => {
            active = false;
            setIsOpen(false);
        }
    }, [toggle])

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (event.target.id !== 'side-bar' && !event.target.classList.contains('side-bar-class')) {
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

    const handleNavigateToRoute = (path: string) => {
        navigate(path);
    }

    return (
        <div id={'side-bar'} className={`side-bar-class fixed top-0 left-0 h-full w-38 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Sidebar content goes here */}
            <div className="p-4">
                <ul>
                    {
                        routeDefinition.map((route, index) => {
                            return (
                                <div
                                    className='flex items-center space-x-2 cursor-pointer  p-2'
                                    onClick={() => handleNavigateToRoute(route.path)}
                                    key={index}>
                                    <div>{route.icon}</div>
                                    <div>{route.title}</div>
                                </div>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
