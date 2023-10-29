import React, { useEffect, useState } from 'react';
import { routeDefinition } from '../../router/routeDefinition';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ toggle, setToggle }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';

    useEffect(() => {
        console.log('Render side toggle')
        setIsOpen(toggle);
    }, [toggle])

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (event.target.id !== 'side-bar' && !event.target.classList.contains('side-bar-class')) {
                setToggle(false);
            }
        }

        // Add the event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setToggle]);

    const handleNavigateToRoute = (event: React.MouseEvent<HTMLUListElement, MouseEvent>, path: string) => {
        event.preventDefault();
        event.stopPropagation();
        navigate(path);
        setToggle(false);
    }

    return (
        <div
            id='side-bar'
            className={`fixed top-12 left-2 w-38 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-80'}`}>
            {
                routeDefinition.map((route, index) => {
                    return (
                        <ul style={{
                            minWidth: '8em',
                            backgroundColor: location.pathname === route.path ? (isDarkTheme ? '#2d3748' : '#edf2f7') : '',
                            color: location.pathname === route.path ? (isDarkTheme ? '#edf2f7' : '#2d3748') : ''
                        }}
                            key={index} id={route.path} onClick={(e) => handleNavigateToRoute(e, route.path)}>
                            <div

                                className='side-bar-class flex items-center space-x-2 cursor-pointer p-3'
                            >
                                <div style={{ color: location.pathname === route.path ? 'green' : 'inherit' }}>{route.icon}</div>
                                <div style={{ color: location.pathname === route.path ? 'green' : 'inherit' }}>{route.title}</div>
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
