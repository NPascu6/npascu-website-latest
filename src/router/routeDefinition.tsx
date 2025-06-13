import React, {lazy, Suspense} from "react";
import {RouteDefinition} from "../models/common/common";
import Loading from "../pages/generic/Loading";
import {motion} from 'framer-motion';

// Lazy load the page components
import MainPage from "../pages/MainPage";
const GamesCardPage = lazy(() => import("../pages/game/GamesContainer"));
const QuotePage = lazy(() => import("../components/quote/QuoteComponent"));
const DynamicComponentsContainerPage = lazy(() =>
    import("../pages/dynamic/DynamicComponentsContainerPage")
);
const AboutPage = lazy(() => import("../pages/AboutPage"));

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
    <Suspense fallback={<Loading/>}>
        <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            transition={{duration: 0.2}}
        >
            <Component/>
        </motion.div>
    </Suspense>
);

export const routeDefinition: RouteDefinition[] = [
    {
        path: "*",
        exact: true,
        element: <MainPage/>,
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
