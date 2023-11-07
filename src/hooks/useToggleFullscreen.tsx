import { useEffect, useState } from 'react';

function useFullScreenToggle(initialState = false) {
    const [isFullScreen, setFullScreen] = useState(initialState);

    const toggleFullScreen = () => {
        setFullScreen(!isFullScreen);
    };

    useEffect(() => {
        if (isFullScreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto'; // Reset body overflow on unmount
        };
    }, [isFullScreen]);

    

    return { isFullScreen, toggleFullScreen };
}

export default useFullScreenToggle;