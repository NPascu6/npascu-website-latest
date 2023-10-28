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

    const handleNavigateToRoute = (event: React.MouseEvent<HTMLUListElement, MouseEvent>, path: string) => {
        event.preventDefault();
        event.stopPropagation();
        navigate(path);
    }

    return (
        <div
            id='side-bar'
            className={`fixed top-0 left-0 w-38 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {
                routeDefinition.map((route, index) => {
                    return (
                        <ul key={index} id={route.path} onClick={(e) => handleNavigateToRoute(e, route.path)}>
                            <div
                                className='side-bar-class flex items-center space-x-2 cursor-pointer  p-2'
                            >
                                <div>{route.icon}</div>
                                <div>{route.title}</div>
                            </div>
                            <hr className='border-b-1' />
                        </ul>
                    )
                })
            }
        </div>
    );
};

export default Sidebar;
