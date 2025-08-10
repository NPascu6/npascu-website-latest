import {useEffect, useState} from "react";

/**
 * Returns a debounced version of `value` that only updates after `delay`.
 *
 * Any pending timer is cleared when the hook unmounts or when either `value`
 * or `delay` change, ensuring that no orphaned timeouts remain.
 */
export const useDebounced = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};
