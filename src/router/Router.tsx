import React, {Suspense} from 'react';
import {Route, Routes} from 'react-router-dom';
import {routeDefinition} from './routeDefinition';
import Loading from '../pages/generic/Loading';
import {RouteDefinition} from '../models/common/common';

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
    return (
        <Suspense fallback={<Loading/>}>
            <Routes>
                {renderRoutes(routeDefinition)}
            </Routes>
        </Suspense>
    );
};

export default RoutesSwitch;