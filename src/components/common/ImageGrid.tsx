import React, { useState } from "react";
import LazyImage from "./LazyImage";
import useFullScreenToggle from "../../hooks/useToggleFullscreen";
const FullScreenImage = React.lazy(() => import("./FullScreenImage"));

interface ImageGridProps {
    images: string[];
}

const ImageGrid = ({ images }: ImageGridProps) => {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const { isFullScreen, toggleFullScreen } = useFullScreenToggle();

    const openImage = (index: number) => {
        setCurrentIndex(index);
        toggleFullScreen();
    };

    const closeImage = () => {
        toggleFullScreen();
        setCurrentIndex(null);
    };

    const handlePrev = () => {
        if (currentIndex === null) return;
        setCurrentIndex((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
    };

    const handleNext = () => {
        if (currentIndex === null) return;
        setCurrentIndex((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
    };

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className="cursor-pointer"
                        onClick={() => openImage(idx)}
                    >
                        <LazyImage
                            src={img}
                            alt={`${idx}`}
                            className="object-cover w-full h-40"
                        />
                    </div>
                ))}
            </div>
            {isFullScreen && currentIndex !== null && (
                <FullScreenImage
                    handlePrevClick={handlePrev}
                    handleNextClick={handleNext}
                    toggleFullScreen={closeImage}
                    selectedImage={images[currentIndex]}
                />
            )}
        </div>
    );
};

export default React.memo(ImageGrid);
