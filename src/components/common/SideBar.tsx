import React, { useEffect, useState } from 'react';
import { routeDefinition } from '../../router/routeDefinition';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ toggle, setToggle }: any) => {
    const sideBarRef = React.useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(toggle);
    const navigate = useNavigate();
    const location = useLocation();
    const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';

    useEffect(() => {
        setIsOpen(toggle);
    }, [toggle]);

    useEffect(() => {
        function handleClickOutside(event: any) {
            console.log(event.target.classList)
            if (sideBarRef.current && !sideBarRef.current.contains(event.target) && !event.target.classList.contains('sidebar')) {
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

    const handleNavigateToRoute = (e: any, path: string) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(path);
    };

    return (
        <div
            ref={sideBarRef}
            id='side-bar'
            className={`fixed top-12 left-2 w-38 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-80'}`}
        >
            {routeDefinition.map((route, index) => (
                <ul
                    className='sidebar shadow-xl'
                    style={{
                        fontWeight: location.pathname === route.path ? 'bold' : 'normal',
                        textDecoration: location.pathname === route.path ? 'underline' : 'none',
                        minWidth: '8em',
                        backgroundColor: location.pathname === route.path ? (isDarkTheme ? '#2d3748' : '#edf2f7') : '',
                        color: location.pathname === route.path ? (isDarkTheme ? '#edf2f7' : '#2d3748') : ''
                    }}
                    key={index}
                    id={route.path}
                    onClick={(e) => handleNavigateToRoute(e, route.path)}
                >
                    <div className='sidebar flex items-center space-x-2 cursor-pointer p-3'>
                        <div style={{ opacity: location.pathname === route.path ? 1 : 0.5 }}>{route.icon}</div>
                        <div style={{ opacity: location.pathname === route.path ? 1 : 0.5 }}>{route.title}</div>
                    </div>
                </ul>
            ))}
        </div>
    );
};

export default Sidebar;
