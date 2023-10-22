import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from '../pages/MainPage';

export const RoutesSwitch = () => {
    //const token = useToken()

    return (
        <Suspense fallback={<div>...</div>}>
            <Routes>
                <Route
                    id={'/'}
                    path={'/'}
                    element={<MainPage />} />
            </Routes>
        </Suspense>
    );
};

