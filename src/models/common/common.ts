import { ReactNode } from "react";

export interface PagedResult<T> {
    totalPages: number,
    items: T[],
    itemsPerPage: number
}

export interface ReusableColumn {
    header: string;
    key: string;
    style?: React.CSSProperties;
    className?: string;
    hidden?: boolean;
    cellRenderer?: (a: any) => React.ReactElement | string | number | null | undefined | boolean;
}

export interface RouteDefinition {
    path: string;
    component: ReactNode | JSX.Element;
    exact?: boolean;
    title?: string;
    icon?: React.ReactElement;
    subRoutes?: RouteDefinition[];
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