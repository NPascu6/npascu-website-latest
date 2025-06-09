import React, { useEffect, useRef, useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, ...props }) => {
    const [source, setSource] = useState<string | undefined>(undefined);
    const ref = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSource(src);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => observer.disconnect();
    }, [src]);

    return <img ref={ref} src={source} loading="lazy" {...props} />;
};

export default LazyImage;
