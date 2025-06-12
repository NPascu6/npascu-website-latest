import React, { useEffect, useRef, useState } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    width?: number | string;
    height?: number | string;
    srcSet?: string;
    sizes?: string;
    fetchPriority?: 'high' | 'low' | 'auto';
}

const LazyImage: React.FC<LazyImageProps> = ({ src, width, height, srcSet, sizes, fetchPriority, ...props }) => {
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
            { rootMargin: '200px' }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => observer.disconnect();
    }, [src]);

    return (
        <img
            ref={ref}
            src={source}
            loading="lazy"
            decoding="async"
            crossOrigin="anonymous"
            width={width}
            height={height}
            srcSet={srcSet}
            sizes={sizes}
            fetchPriority={fetchPriority}
            {...props}
        />
    );
};

export default LazyImage;
