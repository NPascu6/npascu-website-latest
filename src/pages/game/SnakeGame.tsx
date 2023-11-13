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
            Math.min(MAX_SQUARE_SIZE, Math.floor(Math.min(windowSize.innerWidth, windowSize.innerHeight) / 22))
        );
        const newRows = Math.floor((windowSize.innerHeight - 210) / squareSize);
        const newCols = Math.floor((windowSize.innerWidth) / squareSize);

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
    const [minNumberOfFood, setMinNumberOfFood] = useState(1);
    const [maxNumberOfFood, setMaxNumberOfFood] = useState(2);
    const [minNumberOfObstacles, setMinNumberOfObstacles] = useState(5);
    const [maxNumberOfObstacles, setMaxNumberOfObstacles] = useState(10);
    const handleSetSpeed = useCallback((newSpeed: number) => {
        setSpeed(-newSpeed);
    }, [])

    const generateFood = useCallback((): SnakeSegment[] => {
        const foodCount = getRandomNumber(minNumberOfFood, maxNumberOfFood) // Adjust the obstacle count as needed
        const food: SnakeSegment[] = [];

        for (let i = 0; i < foodCount; i++) {
            food.push({
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows),
            });
        }

        return food;
    }, [cols, rows, minNumberOfFood, maxNumberOfFood]);

    const generateObstacles = useCallback((): SnakeSegment[] => {
        const obstaclesCount = getRandomNumber(minNumberOfObstacles, maxNumberOfObstacles) // Adjust the obstacle count as needed
        const obstacles: SnakeSegment[] = [];

        for (let i = 0; i < obstaclesCount; i++) {
            obstacles.push({
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows),
            });
        }

        return obstacles;
    }, [cols, rows, minNumberOfObstacles, maxNumberOfObstacles]);

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

    const calculateScore = useCallback((speed: number, difficultyModifier: number) => {
        const baseScore = 0;
        const speedScore = (1 / speed) * 300;
        const sizeScore = difficultyModifier;

        return baseScore + speedScore + sizeScore;
    }, []);

    const handleFoodCollision = useCallback(
        (newSnake: SnakeSegment[], newHead: SnakeSegment) => {
            const remainingFood = food.filter(
                (f) => !(f.x === newHead.x && f.y === newHead.y)
            );

            if (remainingFood.length === food.length) {
                // No food was eaten
                setSnake(newSnake);
            } else {
                // Food was eaten
                setFood(remainingFood);

                // Check if all food is eaten
                if (remainingFood.length === 0) {
                    // Generate new food
                    setFood(generateFood());

                    // Increase score
                    const newScore = calculateScore(speed, 1);
                    setScore((prevScore) => prevScore + newScore);
                } else {
                    // Food was eaten but there are still remaining food
                    setSnake([...newSnake, snake[snake.length - 1]]);
                }
            }
        },
        [food, snake, generateFood, speed, calculateScore]
    );

    const handleGameEnd = useCallback(() => {
        setIsRunning(false);
        if (isRunning) {
            alert(`Game over! Your score is ${score.toFixed(2)}`);
        }
        resetGame();
    }, [isRunning, score, resetGame]);

    const moveSnake = useCallback(() => {
        if (!isRunning || isPaused || !cols || !rows || !snake || !food || !obstacles) {
            return;
        }

        const head = snake[0];
        let newHead: SnakeSegment;

        switch (direction) {
            case "up":
                newHead = { x: head.x, y: (head.y - 1 + rows) % rows };
                break;
            case "down":
                newHead = { x: head.x, y: (head.y + 1) % rows };
                break;
            case "left":
                newHead = { x: (head.x - 1 + cols) % cols, y: head.y };
                break;
            case "right":
                newHead = { x: (head.x + 1) % cols, y: head.y };
                break;
            default:
                newHead = head;
        }

        const newSnake = [newHead, ...snake.slice(0, -1)];

        const hasCollision = newSnake.slice(1).some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
        ) || obstacles.some(
            (o) => o.x === newHead.x && o.y === newHead.y
        );

        if (hasCollision) {
            handleGameEnd();
            return;
        }

        handleFoodCollision(newSnake, newHead);
    }, [direction, food, snake, isRunning, cols, rows, isPaused, obstacles, handleFoodCollision, handleGameEnd]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            moveSnake();
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

    useEffect(() => {
        if (score > 5) {
            setSpeed(prev => prev - 1)
            setMinNumberOfFood(2)
            setMaxNumberOfFood(3)
            setMinNumberOfObstacles(10)
            setMaxNumberOfObstacles(15)
        }
        if (score > 10) {
            setSpeed(prev => prev - 5)
            setMinNumberOfFood(3)
            setMaxNumberOfFood(4)
            setMinNumberOfObstacles(15)
            setMaxNumberOfObstacles(20)
        }
        if (score > 30) {
            setSpeed(prev => prev - 10)
            setMinNumberOfFood(4)
            setMaxNumberOfFood(5)
            setMinNumberOfObstacles(20)
            setMaxNumberOfObstacles(25)
        }
        if (score > 50) {
            setSpeed(prev => prev - 15)
            setMinNumberOfFood(5)
            setMaxNumberOfFood(6)
            setMinNumberOfObstacles(25)
            setMaxNumberOfObstacles(30)
        }
    }, [score])

    useEffect(() => {
        setObstacles(generateObstacles())
    }, [minNumberOfObstacles, maxNumberOfObstacles, generateObstacles])

    useEffect(() => {
        setFood(generateFood())
    }, [minNumberOfFood, maxNumberOfFood, generateFood])

    return (
        <div className="max-w-screen-md mx-auto justify-center content-center items-center min-w-full" style={{ height: 'calc(100dvh - 4em)' }}>
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
                        className="w-full p-0 ml-2 border border-gray-500 w-2/3 mb-2"
                        style={{ flexGrow: 1 }}
                    />
                    <div style={{ bottom: -20 }} className="w-full absolute left-0 flex justify-between p-4">
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
