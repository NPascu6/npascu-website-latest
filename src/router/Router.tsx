import React, {Suspense} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import {routeDefinition} from './routeDefinition';
import Loading from '../pages/generic/Loading';
import {RouteDefinition} from '../models/common/common';
import {AnimatePresence} from 'framer-motion';

const renderRoutes = (routes: RouteDefinition[]) => {
    return routes.map((route: RouteDefinition, index) => (
        <Route
            key={index}
            path={route.path}
            element={route.element}
        >
            {route.routes && renderRoutes(route.routes)}
        </Route>
    ));
};

const RoutesSwitch = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Suspense fallback={<Loading/>}>
                <Routes location={location} key={location.pathname}>
                    {renderRoutes(routeDefinition)}
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
};

export default RoutesSwitch;