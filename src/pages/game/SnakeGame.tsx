import React, { useState, useEffect, useCallback } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import Board from "../../components/game/snake/Board";
import { getRandomNumber } from "../../util";

interface SnakeSegment {
    x: number;
    y: number;
}

const MIN_SQUARE_SIZE = 10;
const MAX_SQUARE_SIZE = 20;

const SnakeGame: React.FC = () => {
    const windowSize = useWindowSize();
    const [score, setScore] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const calculateSizes = useCallback(() => {
        const squareSize = Math.max(
            MIN_SQUARE_SIZE,
            Math.min(MAX_SQUARE_SIZE, Math.floor(Math.min(windowSize.innerWidth, windowSize.innerHeight) / 30))
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
        const foodCount = getRandomNumber(2, 4) // Adjust the obstacle count as needed
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
        const obstaclesCount = getRandomNumber(20, 40) // Adjust the obstacle count as needed
        const obstacles: SnakeSegment[] = [];

        for (let i = 0; i < obstaclesCount; i++) {
            obstacles.push({
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows),
            });
        }

        return obstacles;
    }, [cols, rows]);

    const [food, setFood] = useState<SnakeSegment[]>(generateFood());
    const [obstacles, setObstacles] = useState<SnakeSegment[]>(generateObstacles());

    const startGame = () => setIsRunning(true);
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
        setObstacles(generateObstacles());
        setFood(generateFood());
    }, [newRows, newCols, generateObstacles, generateFood]);

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
            <div className="mb-1 flex flex-col content-center items-center">{
                <Board
                    rows={rows}
                    cols={cols}
                    snake={snake}
                    food={food}
                    obstacles={obstacles}
                    squareSize={squareSize}
                    isRunning={isRunning}
                    isPaused={isPaused}
                    direction={direction}
                    stopGame={() => setIsRunning(false)}
                    startGame={startGame}
                    setDirection={setDirection} />
            }
            </div>
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
