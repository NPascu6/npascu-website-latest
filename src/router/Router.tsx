import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routeDefinition } from './routeDefinition';
import Loading from '../pages/generic/Loading';

export const RoutesSwitch = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {
                    routeDefinition.map((route, index) => {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={route.component}
                            />
                        )
                    })
                }
            </Routes>
        </Suspense>
    );
};

