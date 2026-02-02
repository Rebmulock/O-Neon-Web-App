import { useState, useEffect } from "react";

export function useIsMobile(maxWidth = 1000) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`);

        const updateIsMobile = () => {
            setIsMobile(mediaQuery.matches);
        };

        updateIsMobile();
        mediaQuery.addEventListener("change", updateIsMobile);

        return () => {
            mediaQuery.removeEventListener("change", updateIsMobile);
        };
    }, [maxWidth]);

    return isMobile;
}