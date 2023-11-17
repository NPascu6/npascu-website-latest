import { useCallback, useState } from "react";
import { useDebounced } from "./useDebounceHook";

export interface WindowInterface {
    innerWidth: number,
    innerHeight: number
}


const useWindowSize = (): WindowInterface => {
    const getWindowSize = useCallback(() => {
        const { innerWidth, innerHeight } = window;
        return { innerWidth, innerHeight };
    }, [])


    const [windowSize, setWindowSize] = useState<WindowInterface>(getWindowSize());


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
