import React, {lazy, Suspense} from "react";
import {RouteDefinition} from "../models/common/common";

// Lazy load the page components
const MainPage = lazy(() => import("../pages/MainPage"));
const GamesCardPage = lazy(() => import("../pages/GamesContainer"));
const QuotePage = lazy(() => import("../components/quote/QuoteComponent"));
const DynamicComponentsContainerPage = lazy(() =>
    import("../pages/DynamicComponentsContainerPage")
);
const AboutPage = lazy(() => import("../pages/AboutPage"));

// A simple fallback component for loading states
const LoadingFallback = () => <div>Loading...</div>;

// Optionally, create a helper to wrap lazy components with Suspense
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
    <Suspense fallback={<LoadingFallback/>}>
        <Component/>
    </Suspense>
);

export const routeDefinition: RouteDefinition[] = [
    {
        path: "*",
        exact: true,
        element: withSuspense(MainPage),
    },
    {
        path: "/games/*",
        exact: true,
        element: withSuspense(GamesCardPage),
    },
    {
        path: "/quotes",
        exact: true,
        element: withSuspense(QuotePage),
    },
    {
        path: "/dynamic-components",
        exact: true,
        element: withSuspense(DynamicComponentsContainerPage),
    },
    {
        path: "/about",
        exact: true,
        element: withSuspense(AboutPage),
    },
];
