import React, {useEffect} from "react";

import LazyImage from "./LazyImage";

const CloseIcon = React.lazy(() => import("../../assets/icons/CloseIcon"));
const ChevronLeft = React.lazy(() => import("../../assets/icons/ChevronLeft"));
const ChevronRight = React.lazy(
    () => import("../../assets/icons/ChevronRight")
);

interface FullScreenImageProps {
    handlePrevClick?: () => void;
    handleNextClick?: () => void;
    toggleFullScreen: () => void;
    selectedImage: string;
    onTouchStart?: React.TouchEventHandler;
    onTouchEnd?: React.TouchEventHandler;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({
                         handlePrevClick,
                         handleNextClick,
                         toggleFullScreen,
                         selectedImage,
                         onTouchStart,
                         onTouchEnd,
                     }) => {

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft" && handlePrevClick) {
                handlePrevClick();
            }
            if (e.key === "ArrowRight" && handleNextClick) {
                handleNextClick();
            }
            if (e.key === "Escape") {
                toggleFullScreen();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handlePrevClick, handleNextClick, toggleFullScreen]);
    return (
        <div
            id="full-screen-photo"
            className="flex fixed top-0 left-0 w-full h-full bg-black z-50 items-center justify-center"
        >
            <div className="flex items-center">
                {handlePrevClick && (
                    <span
                        className="transform -translate-y-1/2 text-white"
                        onClick={handlePrevClick}
                    >
            <ChevronLeft/>
          </span>
                )}
                <div
                    className="flex p-2"
                    onTouchStart={onTouchStart && onTouchStart}
                    onTouchEnd={onTouchEnd && onTouchEnd}
                >
                    {/* Full-screen image */}
                    <LazyImage
                        style={{maxHeight: "70dvh", maxWidth: "87vw"}}
                        src={selectedImage}
                        alt={selectedImage}
                        width="2560"
                        height="1280"
                    />
                </div>
                {handleNextClick && (
                    <span
                        className="transform -translate-y-1/2 text-white"
                        onClick={handleNextClick}
                    >
            <ChevronRight/>
          </span>
                )}
            </div>

            <span
                className="absolute top-2 right-2 cursor-pointer text-white"
                onClick={toggleFullScreen}
            >
        <CloseIcon/>
      </span>
        </div>
    );
};

export default React.memo(FullScreenImage);
