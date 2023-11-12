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

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

    const [speed, setSpeed] = useState(250);
    const [maxRows, setMaxRows] = useState<any>();
    const [maxCols, setMaxCols] = useState<any>();

    const handleSetSpeed = useCallback((newSpeed: number) => {
        setSpeed(-newSpeed);
    }, [])

    const generateFood = useCallback((): SnakeSegment[] => {
        const foodCount = getRandomNumber(1, 3) // Adjust the obstacle count as needed
        const food: SnakeSegment[] = [];

        for (let i = 0; i < foodCount; i++) {
            food.push({
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows),
            });
        }

        return food;
    }, [cols, rows]);

    const generateObstacles = useCallback((): SnakeSegment[] => {
        const obstaclesCount = getRandomNumber(30, 50) // Adjust the obstacle count as needed
        const obstacles: SnakeSegment[] = [];

        for (let i = 0; i < obstaclesCount; i++) {
            obstacles.push({
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows),
            });
        }

        return obstacles;
    }, [cols, rows,]);

    const [food, setFood] = useState<SnakeSegment[]>(generateFood());
    const [obstacles,] = useState<SnakeSegment[]>(generateObstacles());
    const renderSquare = (row: number, col: number) => {
        const isSnake = snake.some((s) => s.x === col && s.y === row);
        const isFood = food.some((f) => f.x === col && f.y === row);
        const isWall = obstacles.some((o) => o.x === col && o.y === row);

        return (
            <div
                key={`${row}-${col}`}
                className={`w-${squareSize} h-${squareSize} ${isSnake ? "bg-green-400" : isFood ? "bg-green-600" : isWall ? "bg-gray-900" : "bg-white"
                    } border border-black`}
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

    const startGame = () => {
        setIsRunning(true)
    };
    const pauseGame = () => setIsPaused(true);
    const resumeGame = () => setIsPaused(false);

    const resetGame = useCallback(() => {
        setIsRunning(false)
        setIsPaused(false);
        setSnake([{ x: 0, y: 0 }]);
        setDirection("right");
        setScore(0);
        setRows(newRows);
        setCols(newCols);
    }, [newRows, newCols]);

    const moveSnake = useCallback(() => {
        if (!isRunning || isPaused || !cols || !rows || !snake || !food || !obstacles) {
            return;
        }

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

        if (
            newSnake.slice(1).some((segment) => segment.x === newHead.x && segment.y === newHead.y) ||
            obstacles.some((o) => o.x === newHead.x && o.y === newHead.y)
        ) {
            setIsRunning(false);
            if (isRunning) {
                alert(`Game over! Your score is ${score.toFixed(2)}`);
            }
            resetGame();
            return;
        }

        if (food.some((f) => f.x === newHead.x && f.y === newHead.y)) {
            setFood(generateFood());
            setSnake([...newSnake, snake[snake.length - 1]]);
            const calculateScore = (speed: number, boardSize: number) => {
                const baseScore = 0;
                const difficultyModifier = 0.0;
                const speedScore = +((1 / speed) * 300);
                const sizeScore = boardSize * difficultyModifier;;

                return baseScore + speedScore + sizeScore;
            };
            setScore((prevScore) => +(prevScore + calculateScore(speed, 1)));
        } else {
            setSnake(newSnake);
        }
    }, [direction, food, snake, resetGame, isRunning, cols, rows, isPaused, generateFood, speed, score, obstacles]);


    const handleSwipe = useCallback((startX: number, startY: number, endX: number, endY: number) => {
        if (!isRunning || isPaused) return;

        const MIN_SWIPE_DISTANCE = 20;
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX > MIN_SWIPE_DISTANCE || absDeltaY > MIN_SWIPE_DISTANCE) {
            if (absDeltaX > absDeltaY) {
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
                handleSwipe(swipeState.startX, swipeState.startY, touch.clientX, touch.clientY);
                setSwipeState(null);
            }
        }
    }, [handleSwipe, swipeState, isRunning]);

    const handleKeyPress = useCallback((key: string) => {
        if (isRunning) {
            switch (key) {
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
        }
    }, [isRunning, direction]);

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
    }, [isRunning, windowSize, squareSize])

    useEffect(() => {
        if (maxCols && maxRows) return
        if (!rows || !cols) return
        setMaxRows(rows);
        setMaxCols(cols);
    }, [rows, cols, maxCols, maxRows]);

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
                        min="-300"
                        max="10"
                        step="-100"
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

export default React.memo(SnakeGame);
