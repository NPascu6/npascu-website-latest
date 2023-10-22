import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setShowToaster } from '../../store/reducers/appReducer';

const Toaster = ({ timeout = 1200 }) => {
    const toaster = useSelector((state: RootState) => state.app.toaster);
    const dispatch = useDispatch()

    // Auto-hide the toaster after a few seconds
    useEffect(() => {
        const hideTimeout = setTimeout(() => {
            dispatch(setShowToaster(false));
        }, timeout);

        return () => clearTimeout(hideTimeout);
    }, [toaster, dispatch, timeout]);

    return (
        <div
            className={`fixed bottom-10 right-0 mb-4 mr-4 ${toaster.showToaster ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'
                } transition-opacity duration-100 ease-in-out transform transition-transform duration-200 hover:scale-105`}>
            <div className="bg-green-500 text-white rounded-md p-3 shadow-md">
                {toaster.toasterMessage}
            </div>
        </div>
    );
};

export default Toaster;
