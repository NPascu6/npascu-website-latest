import React, { useRef, useState, useCallback, useEffect, useMemo } from "react";
import Square from "./Square";
import SnakeHeadIcon from '../../../assets/icons/Snake2'

interface SwipeState {
    startX: number;
    startY: number;
}

const fruitEmojis = ["🍎", "🍌", "🍇", "🍓", "🍊", "🍍", "🥭", "🍑", "🍉"];
const wallEmojis = ["💀", "☠️"];

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

    const handleKeyPress = useCallback((key: string) => {
        switch (key) {
            case " ":
                !isRunning || isPaused ? startGame() : stopGame();
                break;
            case "up":
            case "down":
            case "left":
            case "right":
                direction !== oppositeDirection(key) && setDirection(key);
                break;
            default:
                break;
        }
    }, [direction, isPaused, isRunning, setDirection, startGame, stopGame]);

    const getRandomEmoji = (emojis: string[]) => emojis[Math.floor(Math.random() * emojis.length)];

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        event.preventDefault();
        const key = event.key.toLowerCase();

        if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) {
            handleKeyPress(key.replace("arrow", ""));
        }
    }, [handleKeyPress]);

    const fruitEmoji = useMemo(() => getRandomEmoji(fruitEmojis), []);
    const wallEmoji = useMemo(() => getRandomEmoji(wallEmojis), []);

    const handleSwipe = useCallback((startX: number, startY: number, endX: number, endY: number) => {
        if (!isRunning || isPaused) return;

        const MIN_SWIPE_DISTANCE = 20;
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX > MIN_SWIPE_DISTANCE || absDeltaY > MIN_SWIPE_DISTANCE) {
            // Calculate the swipe direction
            let newDirection = "";
            if (absDeltaX > absDeltaY) {
                newDirection = deltaX > 0 ? "right" : "left";
            } else {
                newDirection = deltaY > 0 ? "down" : "up";
            }

            // Prevent immediate change to the opposite direction
            if (oppositeDirection(newDirection) !== direction) {
                setDirection(newDirection);
            }
        }
    }, [isRunning, isPaused, direction, setDirection]);

    const touchStart = useCallback((event: TouchEvent) => {
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
    }, [isRunning]);

    const touchEnd = useCallback((event: TouchEvent) => {
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
    }, [handleSwipe, swipeState, isRunning]);

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

    const styles = {
        maxWidth: `${cols * (squareSize + 0.01)}px`,
    };

    return (
        <div
            ref={boardRef}
            style={styles}
            className="border-2 border-gray-700 rounded-md"
        >
            {Array.from({ length: rows }, (_, row) => (
                <div key={row} className="flex align-center">
                    {Array.from({ length: cols }, (_, col) => (
                        <Square key={`${row}-${col}`}
                            food={food}
                            col={col}
                            isFood={food.some((f) => f.x === col && f.y === row)}
                            isWall={obstacles.some((o) => o.x === col && o.y === row)}
                            isSnakeHead={snake.length > 0 && snake[0].x === col && snake[0].y === row}
                            isSnakeBody={snake.slice(1).some((s) => s.x === col && s.y === row)}
                            row={row}
                            squareSize={squareSize}
                            fruitEmoji={fruitEmoji}
                            wallEmoji={wallEmoji}
                            HeadIcon={SnakeHeadIcon}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

// Helper function to get opposite direction
const oppositeDirection = (dir: string) => {
    switch (dir) {
        case "up":
            return "down";
        case "down":
            return "up";
        case "left":
            return "right";
        case "right":
            return "left";
        default:
            return "";
    }
};

export default React.memo(Board);
