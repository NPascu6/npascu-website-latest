import React, {useEffect, useRef, useState} from "react";
import useFullScreenToggle from "../../hooks/useToggleFullscreen";

import LazyImage from "./LazyImage";

const ChevronLeft = React.lazy(() => import("../../assets/icons/ChevronLeft"));
const ChevronRight = React.lazy(
    () => import("../../assets/icons/ChevronRight")
);
const FullScreenImage = React.lazy(() => import("./FullScreenImage"));

interface ImageSliderProps {
    images: string[];
    autoSlideTimeout?: number;
}

const ImageSlider = ({images, autoSlideTimeout = 4000}: ImageSliderProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(
        Math.floor(Math.random() * images?.length)
    );
    const {isFullScreen, toggleFullScreen} = useFullScreenToggle();
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    const handlePrevClick = (e?: any) => {
        e?.stopPropagation();
        e?.preventDefault();
        setCurrentImageIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : images.length - 1
        );
    };

    const handleNextClick = (e?: any) => {
        e?.stopPropagation();
        e?.preventDefault();
        setCurrentImageIndex((prevIndex) =>
            prevIndex < images.length - 1 ? prevIndex + 1 : 0
        );
    };

    const handleTouchStart = (e: any) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: any) => {
        touchEndX.current = e.changedTouches[0].clientX;
        if (touchEndX.current === null || touchStartX.current === null) return;

        const swipeDistance = touchEndX?.current - touchStartX?.current;

        if (swipeDistance > 0) {
            // Swipe right, go to the previous image
            handlePrevClick(e);
        } else if (swipeDistance < 0) {
            // Swipe left, go to the next image
            handleNextClick(e);
        }
    };

    useEffect(() => {
        const autoSlideInterval = setInterval(() => {
            if (isFullScreen) return;
            setCurrentImageIndex((prevIndex) =>
                prevIndex < images.length - 1 ? prevIndex + 1 : 0
            );
        }, autoSlideTimeout);

        return () => {
            clearInterval(autoSlideInterval);
        };
    }, [autoSlideTimeout, images, isFullScreen]);

    return (
        <div className="flex card items-center shadow-xl justify-center min-w-full align-center mt-2">
      <span className="transform -translate-y-1/2" onClick={handlePrevClick}>
        <ChevronLeft/>
      </span>
            <div className="flex items-center justify-center align-center p-4">
                <div
                    className="relative flex justify-center  min-w-full"
                    style={{height: "18em", minWidth: "70dvw"}}
                    onClick={toggleFullScreen}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <LazyImage
                        src={images[currentImageIndex]}
                        alt={`${currentImageIndex + 1}`}
                        className="w-full  object-contain p-1"
                        width="2560"
                        height="1280"
                    />
                </div>
            </div>
            <span className="transform -translate-y-1/2" onClick={handleNextClick}>
        <ChevronRight/>
      </span>
            {isFullScreen && (
                <FullScreenImage
                    handlePrevClick={handlePrevClick}
                    handleNextClick={handleNextClick}
                    toggleFullScreen={toggleFullScreen}
                    selectedImage={images[currentImageIndex]}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                />
            )}
        </div>
    );
};

export default React.memo(ImageSlider);
