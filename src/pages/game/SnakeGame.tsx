import React, { useState, useEffect, useCallback, useRef } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface SnakeSegment {
    x: number;
    y: number;
}

interface SwipeState {
    startX: number;
    startY: number;
}

const MIN_SQUARE_SIZE = 10;
const MAX_SQUARE_SIZE = 50;


const SnakeGame: React.FC = () => {
    const windowSize = useWindowSize();
    const boardRef = useRef<HTMLDivElement>(null);

    const calculateSizes = useCallback(() => {
        const squareSize = Math.max(
            MIN_SQUARE_SIZE,
            Math.min(MAX_SQUARE_SIZE, Math.floor(Math.min(windowSize.innerWidth, windowSize.innerHeight) / 26))
        );
        const newRows = Math.floor((windowSize.innerHeight - 235) / squareSize);
        const newCols = Math.floor(windowSize.innerWidth / squareSize);

        return { squareSize, newRows, newCols };
    }, [windowSize]);

    const { squareSize, newRows, newCols } = calculateSizes();

    const [rows, setRows] = useState(newRows);
    const [cols, setCols] = useState(newCols);
    const [snake, setSnake] = useState<SnakeSegment[]>([{ x: 0, y: 0 }]);
    const [direction, setDirection] = useState("right");
    const [score, setScore] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [swipeState, setSwipeState] = useState<SwipeState | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState(200);
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const [maxRows, setMaxRows] = useState<any>();
    const [maxCols, setMaxCols] = useState<any>();

    useEffect(() => {
        if (maxCols && maxRows) return
        if (!rows || !cols) return
        setMaxRows(rows);
        setMaxCols(cols);
    }, [rows, cols, maxCols, maxRows]);

    const handleSetSpeed = useCallback((newSpeed: number) => {
        const adjustedSpeed = newSpeed < 0 ? -newSpeed : newSpeed;

        // Your existing speed-related logic here
        setSpeed(adjustedSpeed);
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
        setFood(generateFood());
        setDirection("right");
        setScore(0);
        setIsRunning(false)
        setIsPaused(false);
    }, [generateFood]);

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
            setScore((prevScore) => prevScore + 1);
        } else {
            setSnake(newSnake);
        }
    }, [direction, food, snake, resetGame, isRunning, cols, rows, isPaused, generateFood]);

    const handleCellClick = useCallback((row: number, col: number) => {
        if (!isRunning) return;

        const head = snake[0];
        const deltaX = col - head.x;
        const deltaY = row - head.y;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            setDirection(deltaX > 0 ? "right" : "left");
        } else {
            setDirection(deltaY > 0 ? "down" : "up");
        }

        moveSnake();
    }, [isRunning, moveSnake, snake]);

    const handleSwipe = useCallback((startX: number, startY: number, endX: number, endY: number) => {
        const MIN_SWIPE_DISTANCE = 50;
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > MIN_SWIPE_DISTANCE) {
                setDirection(deltaX > 0 ? "right" : "left");
            }
        } else {
            if (Math.abs(deltaY) > MIN_SWIPE_DISTANCE) {
                setDirection(deltaY > 0 ? "down" : "up");
            }
        }
    }, [setDirection]);

    const touchStart = useCallback((event: TouchEvent) => {
        event.preventDefault();
        const { touches } = event;

        if (touches.length === 1 && boardRef.current) {
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
    }, []);

    const touchEnd = useCallback((event: TouchEvent) => {
        event.preventDefault();
        const { changedTouches } = event;

        if (changedTouches.length === 1 && swipeState && boardRef.current) {
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
    }, [handleSwipe, swipeState, handleCellClick, squareSize]);

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

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
                event.preventDefault();
                handleKeyPress(key.replace("arrow", ""));
            }
        },
        [handleKeyPress]);

    useEffect(() => {
        const intervalId = setInterval(moveSnake, speed);
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
        const ref = boardRef.current

        if (!ref) return
        ref.addEventListener("touchstart", touchStart, { passive: false });
        ref.addEventListener("touchend", touchEnd, { passive: false });

        return () => {
            ref.removeEventListener("touchstart", touchStart);
            ref.removeEventListener("touchend", touchEnd);
        };
    }, [handleSwipe, swipeState, touchEnd, touchStart]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div className="max-w-screen-md mx-auto p-4 justify-center content-center items-center">
            {!isRunning && (
                <div className="flex text-black justify-center">
                    <div className="mb-4 flex mr-4">
                        <label className={`${isDarkTheme ? "text-white" : "text-black"}`} htmlFor="rows">Rows:</label>
                        <select
                            id="rows"
                            value={rows}
                            onChange={(event) => setRows(parseInt(event.target.value))}
                            className="p-0 ml-2 border border-gray-500 w-1/2"
                            style={{ height: "30px", width: "100px" }}
                        >
                            {Array.from({ length: 5 }, (_, index) => (
                                <option key={index} value={maxRows - (index * 3)}>
                                    {maxRows - (index * 3)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 flex">
                        <label className={`${isDarkTheme ? "text-white" : "text-black"}`} htmlFor="cols">Columns:</label>
                        <select
                            id="cols"
                            value={cols}
                            onChange={(event) => setCols(parseInt(event.target.value))}
                            className="p-0 ml-2 border border-gray-500 w-1/2"
                            style={{ height: "30px", width: "100px" }}
                        >
                            {Array.from({ length: 5 }, (_, index) => (
                                <option key={index} value={maxCols - (index * 3)}>
                                    {maxCols - (index * 3)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

            )}


            <div className="mb-2 flex flex-col content-center items-center">{renderBoard()}</div>
            <div className="mb-2">Score: {score}</div>
            {(isRunning || !isPaused) && (
                <div className="flex items-center content-center justify-center">
                    {!isRunning ? (
                        <button onClick={startGame} className="bg-blue-500 text-white p-2 mr-2">
                            Start
                        </button>
                    ) : isPaused ? (
                        <button onClick={resumeGame} className="bg-green-500 text-white p-2 m-2 border border-gray-500">
                            Resume
                        </button>
                    ) : (
                        <button onClick={pauseGame} className="bg-yellow-500 text-white p-2 m-2 border border-gray-500">
                            Pause
                        </button>
                    )}
                    <button onClick={resetGame} className="bg-green-500 text-white p-2 mr-2">
                        Reset
                    </button>
                    <label htmlFor="speed" className="mx-2">
                        Speed:
                    </label>
                    <div className="flex items-center">
                        <input
                            id="speed"
                            type="range"
                            min="-500"
                            max="0"
                            step="10"
                            value={-speed}
                            onChange={(e) => handleSetSpeed(-e.target.value)}
                            className="p-0 ml-2 border border-gray-500 w-2/3"
                            style={{ flexGrow: 1 }}
                        />
                    </div>

                </div>
            )}

        </div>
    );
};

export default SnakeGame;
