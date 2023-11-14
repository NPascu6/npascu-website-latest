import React, { useRef, useState, useCallback, useEffect } from "react";
import Square from "./Square";
interface SwipeState {
    startX: number;
    startY: number;
}

interface BoardProps {
    rows: number;
    cols: number;
    snake: { x: number; y: number }[];
    food: { x: number; y: number }[];
    obstacles: { x: number; y: number }[];
    squareSize: number;
    isRunning: boolean;
    isPaused: boolean;
    direction: string;
    startGame: () => void;
    stopGame: () => void;
    setDirection: (direction: string) => void;
}

const Board = ({
    rows,
    cols,
    snake,
    food,
    obstacles,
    squareSize,
    isRunning,
    isPaused,
    direction,
    startGame,
    stopGame,
    setDirection,
}: BoardProps) => {
    const boardRef = useRef<HTMLDivElement>(null);
    const [swipeState, setSwipeState] = useState<SwipeState | null>(null);

    const handleKeyPress = useCallback(
        (key: string) => {

            switch (key) {
                case " ": {
                    if (!isRunning || isPaused)
                        startGame();
                    else {
                        stopGame();
                    }
                    break
                }
                case "up":
                    if (direction !== "down") {
                        setDirection(key);
                    }
                    break;
                case "down":
                    if (direction !== "up") {
                        setDirection(key);
                    }
                    break;
                case "left":
                    if (direction !== "right") {
                        setDirection(key);
                    }
                    break;
                case "right":
                    if (direction !== "left") {
                        setDirection(key);
                    }
                    break;
                default:
                    break;
            }
        },
        [isRunning, direction, setDirection, startGame, stopGame, isPaused]
    );

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        event.preventDefault();
        const key = event.key.toLowerCase();

        if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) {

            handleKeyPress(key.replace("arrow", ""));
        }
    },
        [handleKeyPress]);

    const handleSwipe = useCallback(
        (startX: number, startY: number, endX: number, endY: number) => {
            if (!isRunning || isPaused) return;

            const MIN_SWIPE_DISTANCE = 20;
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);

            if (absDeltaX > MIN_SWIPE_DISTANCE || absDeltaY > MIN_SWIPE_DISTANCE) {
                switch (true) {
                    case absDeltaX > absDeltaY:
                        setDirection(deltaX > 0 ? "right" : "left");
                        break;
                    case absDeltaY > absDeltaX:
                        setDirection(deltaY > 0 ? "down" : "up");
                        break;
                    default:
                        break;
                }
            }
        },
        [setDirection, isRunning, isPaused]
    );

    const touchStart = useCallback(
        (event: TouchEvent) => {
            const { touches } = event;

            if (touches.length === 1 && boardRef.current && isRunning) {
                event.preventDefault();
                const touch = touches[0];
                const boardRect = boardRef.current.getBoundingClientRect();

                if (
                    touch.clientX >= boardRect.left &&
                    touch.clientX <= boardRect.right &&
                    touch.clientY >= boardRect.top &&
                    touch.clientY <= boardRect.bottom
                ) {
                    setSwipeState({ startX: touch.clientX, startY: touch.clientY });
                }
            }
        },
        [setSwipeState, isRunning]
    );

    const touchEnd = useCallback(
        (event: TouchEvent) => {
            const { changedTouches } = event;

            if (
                changedTouches.length === 1 &&
                swipeState &&
                boardRef.current &&
                isRunning
            ) {
                event.preventDefault();
                const touch = changedTouches[0];
                const boardRect = boardRef.current.getBoundingClientRect();

                if (
                    touch.clientX >= boardRect.left &&
                    touch.clientX <= boardRect.right &&
                    touch.clientY >= boardRect.top &&
                    touch.clientY <= boardRect.bottom
                ) {
                    handleSwipe(
                        swipeState.startX,
                        swipeState.startY,
                        touch.clientX,
                        touch.clientY
                    );
                    setSwipeState(null);
                }
            }
        },
        [handleSwipe, swipeState, isRunning]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        const ref = boardRef.current;

        if (!ref) return;

        const handleTouchMove = (event: TouchEvent) => {
            const { touches } = event;
            if (touches.length === 1 && swipeState && boardRef.current && isRunning) {
                const touch = touches[0];
                handleSwipe(swipeState.startX, swipeState.startY, touch.clientX, touch.clientY);
            }
        };

        ref.addEventListener("touchstart", touchStart);
        ref.addEventListener("touchend", touchEnd);
        ref.addEventListener("touchmove", handleTouchMove);

        return () => {
            ref.removeEventListener("touchstart", touchStart);
            ref.removeEventListener("touchend", touchEnd);
            ref.removeEventListener("touchmove", handleTouchMove);
        };
    }, [touchEnd, touchStart, handleSwipe, swipeState, isRunning]);

    return (
        <div
            ref={boardRef}
            style={{
                maxWidth: `${cols * (squareSize + 0.01)}px`
            }}
            className="border-2 border-gray-700 rounded-md"
        >
            {Array.from({ length: rows }).map((_, row) => (
                <div key={row} className="flex align-center">
                    {Array.from({ length: cols }).map((_, col) =>
                        <Square key={`${row}-${col}`} snake={snake} food={food} obstacles={obstacles} col={col} row={row} squareSize={squareSize} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default React.memo(Board);
