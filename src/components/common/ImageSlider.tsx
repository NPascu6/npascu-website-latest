import React, { useEffect, useRef, useState } from 'react';
import useFullScreenToggle from '../../hooks/useToggleFullscreen';

const ChevronLeft = React.lazy(() => import('../../assets/icons/ChevronLeft'));
const ChevronRight = React.lazy(() => import('../../assets/icons/ChevronRight'));
const FullScreenImage = React.lazy(() => import('./FullScreenImage'));

interface ImageSliderProps {
    images: string[];
    autoSlideTimeout?: number;
}

const ImageSlider = ({ images, autoSlideTimeout = 4000 }: ImageSliderProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(Math.floor(Math.random() * images?.length));
    const { isFullScreen, toggleFullScreen } = useFullScreenToggle();
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    const handlePrevClick = (e: any) => {
        e?.stopPropagation();
        e?.preventDefault();
        setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
    };

    const handleNextClick = (e: any) => {
        e?.stopPropagation();
        e?.preventDefault();
        setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
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
        const handleNextClickScoped = (e: any) => {
            e?.stopPropagation();
            e?.preventDefault();
            setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
        };

        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        const autoSlideInterval = setInterval(() => {
            handleNextClickScoped(clickEvent); // Simulate a click on the next span
        }, autoSlideTimeout);

        return () => {
            clearInterval(autoSlideInterval);
        };
    }, [currentImageIndex, autoSlideTimeout, images]);

    return (
        <div className='flex card items-center rounded-lg shadow-xl justify-center align-center m-4'>
            <div className='flex card items-center rounded-lg shadow-xl justify-center align-center min-w-full p-1'>
                <span className="transform -translate-y-1/2" onClick={handlePrevClick}>
                    <ChevronLeft />
                </span>
                <div className="relative flex justify-center rounded-lg min-w-full" style={{ maxHeight: '22em' }} onClick={toggleFullScreen} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    <img
                        loading="lazy"
                        src={images[currentImageIndex]}
                        alt={`${currentImageIndex + 1}`}
                        className="w-full rounded-lg object-contain p-1"
                    />
                </div>
                <span className="transform -translate-y-1/2" onClick={handleNextClick}>
                    <ChevronRight />
                </span>
                {isFullScreen && <FullScreenImage
                    handlePrevClick={handlePrevClick}
                    handleNextClick={handleNextClick}
                    toggleFullScreen={toggleFullScreen}
                    selectedImage={images[currentImageIndex]}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                />}
            </div>

        </div>
    );
};

export default React.memo(ImageSlider);
