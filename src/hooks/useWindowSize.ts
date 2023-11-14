import { useState } from "react";
import { useDebounced } from "./useDebounceHook";

export interface WindowInterface {
    innerWidth: number,
    innerHeight: number
}


const useWindowSize = (): WindowInterface => {
    const [windowSize, setWindowSize] = useState<WindowInterface>(getWindowSize());

    function getWindowSize() {
        const { innerWidth, innerHeight } = window;
        return { innerWidth, innerHeight };
    }

    useDebounced(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, 1000);

    return windowSize
}

export default useWindowSize
