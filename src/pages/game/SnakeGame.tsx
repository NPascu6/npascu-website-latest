import React, { useState, useEffect, useCallback, useMemo } from "react";
import useWindowSize from "../../hooks/useWindowSize";
import Board from "../../components/game/snake/Board";
import { getRandomNumber } from "../../util";

interface SnakeSegment {
    x: number;
    y: number;
}

const MIN_SQUARE_SIZE = 10;
const MAX_SQUARE_SIZE = 40;

const SnakeGame: React.FC = () => {
    const windowSize = useWindowSize();
    const [score, setScore] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const calculateSizes = useCallback(() => {
        const squareSize = Math.max(
            MIN_SQUARE_SIZE,
            Math.min(MAX_SQUARE_SIZE, Math.floor(Math.min(windowSize.innerWidth, windowSize.innerHeight) / 20))
        );

        const newRows = Math.floor((windowSize.innerHeight - 220) / squareSize);
        const newCols = Math.floor(windowSize.innerWidth / squareSize);

        return { squareSize, newRows, newCols };
    }, [windowSize.innerWidth, windowSize.innerHeight]);

    const { squareSize, newRows, newCols } = calculateSizes()
    const [lastDirectionChangeTime, setLastDirectionChangeTime] = useState<number>(0);
    const directionChangeDebounceTime = 100; // Adjust the debounce time as needed

    const [localRows, setRows] = useState<number>(newRows);
    const [localCols, setCols] = useState<number>(newCols);

    const size = useMemo(() => squareSize, [squareSize])

    const [snake, setSnake] = useState<SnakeSegment[]>([{ x: 0, y: 0 }]);
    const [direction, setDirection] = useState("right");

    const [speed, setSpeed] = useState(250);
    const [minNumberOfFood, setMinNumberOfFood] = useState(1);
    const [maxNumberOfFood, setMaxNumberOfFood] = useState(2);
    const [minNumberOfObstacles, setMinNumberOfObstacles] = useState(5);
    const [maxNumberOfObstacles, setMaxNumberOfObstacles] = useState(10);

    const handleSetSpeed = useCallback((newSpeed: number) => {
        setSpeed(-newSpeed);
    }, [])

    const generateObstacles = useCallback((): SnakeSegment[] => {
        const obstaclesCount = getRandomNumber(minNumberOfObstacles, maxNumberOfObstacles);
        const obstacles: SnakeSegment[] = [];

        const isObstacleInRestrictedArea = (x: number, y: number): boolean => {
            // Check if the obstacle is too close to the snake's head
            const isNearSnakeHead =
                Math.abs(snake[0].x - x) <= 4 && Math.abs(snake[0].y - y) <= 5;

            // Check if the obstacle is too close to any part of the snake
            const isNearSnake = snake.some(
                (segment) =>
                    Math.abs(segment.x - x) <= 2 && Math.abs(segment.y - y) <= 5
            );

            return isNearSnakeHead || isNearSnake;
        };

        const generateSingleObstacle = (): SnakeSegment => ({
            x: Math.floor(Math.random() * localCols),
            y: Math.floor(Math.random() * localRows),
        });

        const generateValidObstacle = (): SnakeSegment => {
            const newObstacle = generateSingleObstacle();

            if (isObstacleInRestrictedArea(newObstacle.x, newObstacle.y)) {
                // If the generated obstacle is in the restricted area, try again
                return generateValidObstacle();
            }

            return newObstacle;
        };

        for (let i = 0; i < obstaclesCount; i++) {
            obstacles.push(generateValidObstacle());
        }

        return obstacles;
    }, [localCols, localRows, minNumberOfObstacles, maxNumberOfObstacles, snake]);
    const [obstacles, setObstacles] = useState<SnakeSegment[]>(generateObstacles());

    const generateFood = useCallback((): SnakeSegment[] => {
        const foodCount = getRandomNumber(minNumberOfFood, maxNumberOfFood);
        const food: SnakeSegment[] = [];

        const isFoodInRestrictedArea = (x: number, y: number): boolean => {
            // Check if the food is too close to the snake's head
            const isNearSnakeHead =
                Math.abs(snake[0].x - x) <= 4 && Math.abs(snake[0].y - y) <= 10;

            // Check if the food is too close to any part of the snake
            const isNearSnake = snake.some(
                (segment) =>
                    Math.abs(segment.x - x) <= 2 && Math.abs(segment.y - y) <= 2
            );

            // Check if the food is too close to any obstacle
            const isNearObstacle = obstacles.some(
                (o) => Math.abs(o.x - x) <= 2 && Math.abs(o.y - y) <= 2
            );

            return isNearSnakeHead || isNearSnake || isNearObstacle;
        };

        const generateSingleFood = (): SnakeSegment => ({
            x: Math.floor(Math.random() * localCols),
            y: Math.floor(Math.random() * localRows),
        });

        const attemptToGenerateFood = (): SnakeSegment | null => {
            const newFood = generateSingleFood();

            if (
                !isFoodInRestrictedArea(newFood.x, newFood.y) &&
                newFood.x < localCols &&
                newFood.y < localRows
            ) {
                return newFood;
            }

            return null;
        };

        let attempts = 0;

        while (food.length < foodCount && attempts < 1000) {
            const newFood = attemptToGenerateFood();

            if (newFood !== null) {
                food.push(newFood);
            }

            attempts++;
        }

        return food;
    }, [localCols, localRows, minNumberOfFood, maxNumberOfFood, snake, obstacles]);

    const [food, setFood] = useState<SnakeSegment[]>(generateFood());

    const startGame = () => {
        setIsRunning(true)
        setIsPaused(false)
    };

    const pauseGame = () => {
        setIsPaused(true)
    };
    const resumeGame = () => {
        setIsPaused(false)
    };

    const resetGame = useCallback(() => {
        setIsRunning(false)
        setIsPaused(false)
        setSnake([{ x: 0, y: 0 }]);
        setDirection("right");
        setScore(0);
        setObstacles(generateObstacles());
        setFood(generateFood());
        setMaxNumberOfFood(2)
        setMinNumberOfFood(1)
        setMaxNumberOfObstacles(10)
        setMinNumberOfObstacles(5)
    }, [generateObstacles, generateFood]);

    const calculateScore = useCallback((speed: number, numberOfFood: number, obstacles: number) => {
        const baseScore = 0;
        const speedScore = (0.25 / Math.abs(speed)) * 400;
        const difficultyModifier = 1 - (numberOfFood / 10 + obstacles / 20) / 2;
        debugger
        return (baseScore + speedScore + difficultyModifier);
    }, []);

    const handleFoodCollision = useCallback((newSnake: SnakeSegment[], newHead: SnakeSegment, obstacles: any[]) => {
        const remainingFood = food.filter(
            (f) => !(f.x === newHead.x && f.y === newHead.y)
        );

        if (remainingFood.length === food.length) {
            // No food was eaten
            setSnake(newSnake);
        } else {
            // Food was eaten
            setFood(remainingFood);
            setSnake([...newSnake, newHead]);

            // Check if all food is eaten
            if (remainingFood.length === 0) {
                // Generate new food
                setFood(generateFood());

                // Increase score
                const newScore = calculateScore(speed, 1, obstacles.length);
                setScore((prevScore) => prevScore + newScore);
            }
        }
    }, [food, generateFood, speed, calculateScore]);

    const handleGameEnd = useCallback(() => {
        setIsRunning(false);
        if (isRunning) {
            alert(`Game over! Your score is ${score.toFixed(2)}`);
        }
        resetGame();
    }, [isRunning, score, resetGame]);

    const moveSnake = useCallback(() => {
        if (!isRunning) return;
        if (isPaused) return;

        const head = snake[0];
        let newHead: SnakeSegment;

        const currentTime = Date.now();
        const timeSinceLastDirectionChange = currentTime - lastDirectionChangeTime;

        switch (direction) {
            case "up":
                newHead = { x: head.x, y: (head.y - 1 + localRows) % localRows };
                break;
            case "down":
                newHead = { x: head.x, y: (head.y + 1) % localRows };
                break;
            case "left":
                newHead = { x: (head.x - 1 + localCols) % localCols, y: head.y };
                break;
            case "right":
                newHead = { x: (head.x + 1) % localCols, y: head.y };
                break;
            default:
                newHead = head;
        }

        // Check if the new direction is opposite to the current direction
        const isOppositeDirection =
            (direction === "up" && newHead.y === (head.y + 1) % localRows) ||
            (direction === "down" && newHead.y === (head.y - 1 + localRows) % localRows) ||
            (direction === "left" && newHead.x === (head.x + 1) % localCols) ||
            (direction === "right" && newHead.x === (head.x - 1 + localCols) % localCols);

        if (isOppositeDirection || timeSinceLastDirectionChange < directionChangeDebounceTime) {
            // If opposite direction or within the debounce time, ignore the input
            return;
        }

        setLastDirectionChangeTime(currentTime);

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

        handleFoodCollision(newSnake, newHead, obstacles);
    }, [direction, snake, localCols, localRows, obstacles, handleFoodCollision, handleGameEnd, isRunning, isPaused, lastDirectionChangeTime]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            moveSnake();
        }, speed);

        return () => clearInterval(intervalId);
    }, [moveSnake, speed]);

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
        if (minNumberOfObstacles) {
            setObstacles(generateObstacles())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minNumberOfObstacles])

    useEffect(() => {
        if (isRunning) {
            const newRows = Math.floor((windowSize.innerHeight - 165) / squareSize);
            setRows(newRows)

            const newCols = Math.floor((windowSize.innerWidth) / squareSize);
            setCols(newCols)
        }
        else if (!isRunning) {
            const newRows = Math.floor((windowSize.innerHeight - 220) / squareSize);
            setRows(newRows)

            const newCols = Math.floor((windowSize.innerWidth) / squareSize);
            setCols(newCols)
        }
    }, [windowSize, squareSize, isPaused, isRunning])

    const [initialWindowSizes, setInitialWindowSizes] = useState({ width: windowSize.innerWidth, height: windowSize.innerHeight })

    useEffect(() => {

        if (windowSize.innerWidth !== initialWindowSizes.width || windowSize.innerHeight !== initialWindowSizes.height) {
            setFood(generateFood())
            setObstacles(generateObstacles())
            setInitialWindowSizes({ width: windowSize.innerWidth, height: windowSize.innerHeight })
        }
    }, [windowSize.innerHeight, windowSize.innerWidth, initialWindowSizes, generateFood, generateObstacles])

    return (
        <div className="justify-center content-center items-center" style={{ height: 'calc(100dvh - 4em)' }}>
            <div className="mb-1 flex flex-col content-center items-center">{
                <Board
                    rows={localRows}
                    cols={localCols}
                    snake={snake}
                    food={food}
                    obstacles={obstacles}
                    squareSize={size}
                    isRunning={isRunning}
                    isPaused={isPaused}
                    direction={direction}
                    stopGame={() => setIsPaused(true)}
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
                <div className="flex flex-col items-center relative">
                    <input
                        id="speed"
                        type="range"
                        min="-400"
                        max="10"
                        step="10"
                        value={-speed}
                        onChange={(e) => handleSetSpeed(e.target.valueAsNumber)}
                        className="h-10 p-0 ml-2 border border-gray-500 w-4/5"
                        style={{ flexGrow: 1 }}
                    />
                    <div className="w-4/5 left-0 flex justify-between pl-2 pr-2">
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
