import React, { useCallback, useEffect, useState } from 'react';
import { routeDefinition } from '../../router/routeDefinition';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ toggle, setToggle }: any) => {
    const sideBarRef = React.useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(toggle);
    const navigate = useNavigate();
    const location = useLocation();
    const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
    const [openSubRoute, setOpenSubRoute] = useState('' as string)

    useEffect(() => {
        setIsOpen(toggle);
    }, [toggle]);

    useEffect(() => {
        function handleClickOutside(event: any) {
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


    useEffect(() => {
        console.log(location.pathname.split("/")[2])
        const subRoute = location.pathname.split("/")[2];
        if (subRoute) {
            setOpenSubRoute(subRoute);
        }
    }, [location])

    const isRouteActive = useCallback((route: any) => {
        return location.pathname === route.path || (location.pathname.includes(route.path.split("*")[0]) && route.path.includes("*"));
    }, [location]);

    return (
        <div
            ref={sideBarRef}
            id='side-bar'
            className={`fixed top-12 left-2 w-38 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-80'}`}
        >
            {routeDefinition.map((route, index) => (
                <div key={index} onMouseEnter={() => {
                    if (route?.routes) {
                        setOpenSubRoute(route.path);
                    }
                }}
                    onMouseLeave={(e) => {
                        const target = e.relatedTarget as HTMLElement; // Use relatedTarget to get the element the mouse is leaving to

                        // Check if the mouse is leaving to a sub-route element
                        const isLeavingToSubRoute = target && target.classList.contains('sub-route-class'); // Replace 'sub-route-class' with the actual class of your sub-routes

                        if (!isLeavingToSubRoute) {
                            setOpenSubRoute('');
                        }
                    }}>
                    <ul
                        className='sidebar'
                        style={{
                            fontWeight: location.pathname === route.path ? 'bold' : 'normal',
                            textDecoration: isRouteActive(route) ? 'underline' : 'none',
                            minWidth: '8em',
                            backgroundColor: isRouteActive(route) ? (isDarkTheme ? '#2d3748' : 'gray') : '',
                            color: isRouteActive(route) ? (isDarkTheme ? '#edf2f7' : "white") : ''
                        }}
                        id={route.path}
                        onClick={(e) => handleNavigateToRoute(e, route.path)}
                    >
                        <div className='sidebar flex items-center space-x-2 cursor-pointer p-3 mt-1 shadow-xl '>
                            <div style={{ opacity: isRouteActive(route) ? 1 : 0.5 }}>{route.icon}</div>
                            <div style={{ opacity: isRouteActive(route) ? 1 : 0.5 }}>{route.title}</div>
                        </div>
                    </ul>
                    {openSubRoute && route?.routes?.map((subRoute, subIndex) => (
                        <ul
                            key={subIndex}
                            className='sidebar sub-route-class shadow-xl'
                            style={{
                                fontWeight: isRouteActive(subRoute) ? 'bold' : 'normal',
                                textDecoration: isRouteActive(subRoute) ? 'underline' : 'none',
                                minWidth: '8em',
                                backgroundColor: isRouteActive(subRoute) ? (isDarkTheme ? '#2d3748' : '#edf2f7') : '',
                                color: isRouteActive(subRoute) ? (isDarkTheme ? '#edf2f7' : '#2d3748') : ''
                            }}
                            id={subRoute.path}
                            onClick={(e) => handleNavigateToRoute(e, `/games/${subRoute.path}`)}
                        >

                            <div className='sidebar flex items-center space-x-2 cursor-pointer p-3 ml-2' style={{ height: '2em' }}>
                                <div style={{ opacity: location.pathname === `${route.path.split("*")[0]}${subRoute.path}` ? 1 : 0.5 }}>{subRoute.icon}</div>
                                <div style={{ opacity: location.pathname === `${route.path.split("*")[0]}${subRoute.path}` ? 1 : 0.5 }}>{subRoute.title}</div>
                            </div>
                        </ul>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
