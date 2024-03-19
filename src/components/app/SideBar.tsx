import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routeDefinition } from '../../router/routeDefinition';
import { RouteDefinition } from '../../models/common/common';

interface SidebarItemProps {
    route: RouteDefinition;
    isActive: boolean;
    handleClick: () => void;
}

const SidebarItem = ({ route, isActive, handleClick }: SidebarItemProps) => {
    return (
        <li className={`sidebar-item ${isActive ? 'active' : ''}`} onClick={handleClick}>
            <div className="sidebar-item-content">
                <div>{route.icon}</div>
                <div>{route.title}</div>
            </div>
        </li>
    );
};

interface SidebarProps {
    toggle: boolean;
    setToggle: (toggle: boolean) => void;
}

const Sidebar = ({ toggle, setToggle }: SidebarProps) => {
    const sideBarRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!sideBarRef.current?.contains(event.target as Node)) {
                setToggle(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setToggle]);

    const handleNavigate = (path: string) => {
        navigate(path);
        setToggle(false);
    };

    const isRouteActive = (route: RouteDefinition) =>
        location.pathname === route.path ||
        (location.pathname.includes(route.path.split('*')[0]) && route.path.includes('*'));

    return (
        <div ref={sideBarRef} id="side-bar" className={`sidebar ${toggle ? 'open' : 'closed'}`}>
            <ul className="sidebar-list">
                {routeDefinition.map((route, index) => (
                    <React.Fragment key={index}>
                        <SidebarItem
                            route={route}
                            isActive={isRouteActive(route)}
                            handleClick={() => handleNavigate(route.path)}
                        />
                    </React.Fragment>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
