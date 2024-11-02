import {ReactNode} from "react";

export interface PagedResult<T> {
    totalPages: number,
    items: T[],
    itemsPerPage: number
}

export interface RouteDefinition {
    path: string;
    routes?: RouteDefinition[];
    element?: ReactNode | JSX.Element;
    exact?: boolean;
    title?: string;
    icon?: React.ReactElement;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    orders: Order[];
}

export interface Item {
    id: string;
    name: string;
    description: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    id: string;
    user: User;
    items: Item[];
    createdAt: string;
    updatedAt: string;
}

interface AirplaneProps {
    pathPoints: { x: number; y: number }[];
    width: number;
    height: number;
    flightSpeed: number;
    weaponKey: string;
    shieldKey: string;
}

export default AirplaneProps;