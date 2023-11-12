import React, { useState, useEffect, useCallback, useRef } from "react";
import useWindowSize from "../../hooks/useWindowSize";

interface SnakeSegment {
    x: number;
    y: number;
}

interface SwipeState {
    startX: number;
    startY: number;
}

const MIN_SQUARE_SIZE = 10;
const MAX_SQUARE_SIZE = 30;

const SnakeGame: React.FC = () => {
    const windowSize = useWindowSize();
    const boardRef = useRef<HTMLDivElement>(null);
    const [score, setScore] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [swipeState, setSwipeState] = useState<SwipeState | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    const calculateSizes = useCallback(() => {
        const squareSize = Math.max(
            MIN_SQUARE_SIZE,
            Math.min(MAX_SQUARE_SIZE, Math.floor(Math.min(windowSize.innerWidth, windowSize.innerHeight) / 25))
        );
        const newRows = Math.floor((windowSize.innerHeight - 210) / squareSize);
        const newCols = Math.floor(windowSize.innerWidth / squareSize);

        return { squareSize, newRows, newCols };
    }, [windowSize]);

    const { squareSize, newRows, newCols } = calculateSizes();

    const [rows, setRows] = useState(newRows);
    const [cols, setCols] = useState(newCols);
    const [snake, setSnake] = useState<SnakeSegment[]>([{ x: 0, y: 0 }]);
    const [direction, setDirection] = useState("right");

    const [speed, setSpeed] = useState(50);
    const [maxRows, setMaxRows] = useState<any>();
    const [maxCols, setMaxCols] = useState<any>();

    useEffect(() => {
        if (maxCols && maxRows) return
        if (!rows || !cols) return
        setMaxRows(rows);
        setMaxCols(cols);
    }, [rows, cols, maxCols, maxRows]);

    const handleSetSpeed = useCallback((newSpeed: number) => {
        setSpeed(-newSpeed);
    }, [])

    const generateFood = useCallback((): SnakeSegment => ({
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
    }), [cols, rows]);

    const [food, setFood] = useState<SnakeSegment>(generateFood());

    const renderSquare = (row: number, col: number) => {
        const isSnake = snake.some((s) => s.x === col && s.y === row);
        const isFood = food.x === col && food.y === row;

        return (
            <div
                key={`${row}-${col}`}
                className={`w-${squareSize} h-${squareSize} ${isSnake ? "bg-green-500" : isFood ? "bg-red-500" : "bg-white"
                    } border border-black`}
                onClick={() => handleCellClick(row, col)}
                style={{ width: squareSize, height: squareSize }}
            />
        );
    };

    const renderBoard = () => (
        <div ref={boardRef} style={{
            maxWidth: `${cols * (squareSize - 1.4)}px`,
            margin: "0 auto",
        }}
            className="w-full">
            {Array.from({ length: rows }, (_, row) => (
                <div key={row} className="flex align-center">
                    {Array.from({ length: cols }, (_, col) => renderSquare(row, col))}
                </div>
            ))}
        </div>
    );

    const startGame = () => setIsRunning(true);
    const pauseGame = () => setIsPaused(true);
    const resumeGame = () => setIsPaused(false);

    const resetGame = useCallback(() => {
        setSnake([{ x: 0, y: 0 }]);
        setDirection("right");
        setScore(0);
        setRows(newRows);
        setCols(newCols);
        setIsRunning(false)
        setIsPaused(false);
        setFood(generateFood());
    }, [generateFood, newRows, newCols]);

    const moveSnake = useCallback(() => {
        if (!isRunning || isPaused) return;

        const head = snake[0];
        let newHead: SnakeSegment;

        switch (direction) {
            case "up":
                newHead = { x: head.x, y: head.y - 1 < 0 ? rows - 1 : head.y - 1 };
                break;
            case "down":
                newHead = { x: head.x, y: (head.y + 1) % rows };
                break;
            case "left":
                newHead = { x: head.x - 1 < 0 ? cols - 1 : head.x - 1, y: head.y };
                break;
            case "right":
                newHead = { x: (head.x + 1) % cols, y: head.y };
                break;
            default:
                newHead = head;
        }

        const newSnake = [newHead, ...snake.slice(0, -1)];

        if (newSnake.slice(1).some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
            setIsRunning(false);
            resetGame();
            return;
        }

        if (newHead.x === food.x && newHead.y === food.y) {
            setFood(generateFood());
            setSnake([...newSnake, snake[snake.length - 1]]);
            const calculateScore = (speed: number, boardSize: number) => {
                const baseScore = 10;
                const speedMultiplier = 0.5;
                const sizeMultiplier = 0.1;

                const speedScore = (speed === 0 ? 500 : -(speed)) * speedMultiplier;
                const sizeScore = boardSize * sizeMultiplier;

                return baseScore + (speedScore / 10) + (sizeScore / 10);
            };
            setScore((prevScore) => +(prevScore + calculateScore(speed, rows * cols)));
        } else {
            setSnake(newSnake);
        }
    }, [direction, food, snake, resetGame, isRunning, cols, rows, isPaused, generateFood, speed]);

    const handleCellClick = useCallback((row: number, col: number) => {
        if (!isRunning) return;

        const head = snake[0];
        const deltaX = col - head.x;
        const deltaY = row - head.y;

        // Check if the new direction is opposite to the current direction or the same as the current direction
        if (
            (deltaX === 1 && direction === "left") ||
            (deltaX === -1 && direction === "right") ||
            (deltaY === 1 && direction === "up") ||
            (deltaY === -1 && direction === "down") ||
            (deltaX === 0 && deltaY === 0)  // The new direction is the same as the current direction
        ) {
            // Ignore the input
            return;
        }

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            setDirection(deltaX > 0 ? "right" : "left");
        } else {
            setDirection(deltaY > 0 ? "down" : "up");
        }

        moveSnake();
    }, [isRunning, moveSnake, snake, direction]);

    const handleSwipe = useCallback((startX: number, startY: number, endX: number, endY: number) => {
        if (!isRunning || isPaused) return;

        const MIN_SWIPE_DISTANCE = 2;
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        if (
            Math.abs(deltaX) > MIN_SWIPE_DISTANCE ||
            Math.abs(deltaY) > MIN_SWIPE_DISTANCE
        ) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                setDirection(deltaX > 0 ? "right" : "left");
            } else {
                // Vertical swipe
                setDirection(deltaY > 0 ? "down" : "up");
            }
        }
    }, [setDirection, isRunning, isPaused]);

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
    }, [setSwipeState, isRunning]);

    const touchEnd = useCallback((event: TouchEvent) => {
        const { changedTouches } = event;

        if (changedTouches.length === 1 && swipeState && boardRef.current && isRunning) {
            event.preventDefault();
            const touch = changedTouches[0];
            const boardRect = boardRef.current.getBoundingClientRect();

            if (
                touch.clientX >= boardRect.left &&
                touch.clientX <= boardRect.right &&
                touch.clientY >= boardRect.top &&
                touch.clientY <= boardRect.bottom
            ) {
                handleCellClick(
                    Math.floor(touch.clientY / squareSize),
                    Math.floor(touch.clientX / squareSize)
                );
                handleSwipe(swipeState.startX, swipeState.startY, touch.clientX, touch.clientY);
                setSwipeState(null);
            }
        }
    }, [handleCellClick, handleSwipe, swipeState, squareSize, isRunning]);

    const handleKeyPress = useCallback((key: string) => {
        if (isRunning) {
            switch (key) {
                case "up":
                case "down":
                case "left":
                case "right":
                    setDirection(key);
                    break;
                default:
                    break;
            }
        }
    }, [isRunning]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
        if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
            event.preventDefault();
            handleKeyPress(key.replace("arrow", ""));
        }
    }, [handleKeyPress]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            moveSnake();
            // Add score based on board size and speed
        }, speed);

        return () => clearInterval(intervalId);
    }, [moveSnake, speed]);

    useEffect(() => {
        // Handle adjustments when window size changes
        const { newRows, newCols } = calculateSizes();
        setRows(newRows);
        setCols(newCols);
        // Additional logic for handling adjustments can be added here

    }, [windowSize, calculateSizes]);

    useEffect(() => {
        setFood(generateFood())
    }, [rows, generateFood])

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

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        if (isRunning) {
            const newRows = Math.floor((windowSize.innerHeight - 165) / squareSize);
            setRows(newRows);
        }
    }, [isRunning, windowSize, squareSize, generateFood])

    return (
        <div className="max-w-screen-md mx-auto p-1 justify-center content-center items-center min-w-full" style={{ height: 'calc(100dvh - 4em)' }}>
            <div className="mb-1 flex flex-col content-center items-center">{renderBoard()}</div>
            <div className="mb-1 font-bold text-center">Score: {score.toFixed(2)}</div>
            {(isRunning || !isPaused) && (
                <div className="flex items-center content-center justify-center ml-2">
                    {!isRunning ? (
                        <button onClick={startGame} className="bg-blue-500 text-white w-20 p-2 mr-2">
                            Start
                        </button>
                    ) : isPaused ? (
                        <button onClick={resumeGame} className="bg-green-500 text-white w-20 p-2 m-2 border border-gray-500">
                            Resume
                        </button>
                    ) : (
                        <button onClick={pauseGame} className="bg-yellow-500 text-white w-20 p-2 m-2 border border-gray-500">
                            Pause
                        </button>
                    )}
                    <button onClick={resetGame} className="bg-green-500 w-20 text-white p-2 mr-2">
                        Reset
                    </button>

                </div>
            )}
            {speed !== undefined && !isRunning && (
                <div className="flex items-center relative mt-2 p-3">
                    <input
                        id="speed"
                        type="range"
                        min="-200"
                        max="100"
                        step="10"
                        value={-speed}
                        onChange={(e) => handleSetSpeed(e.target.valueAsNumber)}
                        className="w-full p-0 ml-2 border border-gray-500 w-2/3"
                        style={{ flexGrow: 1 }}
                    />
                    <div style={{ bottom: -20 }} className="w-full absolute left-0 flex justify-between">
                        {["Super Easy", "Easy", "Normal", "Harder", "Max"].map((level) => (
                            <div key={level}>{level}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SnakeGame;
