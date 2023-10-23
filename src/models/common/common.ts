import { ReactNode } from "react";

export interface PagedResult<T> {
    totalPages: number,
    items: T[],
    itemsPerPage: number
}

export interface ReusableColumn {
    header: string;
    key: string;
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