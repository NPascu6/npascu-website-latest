import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
    const gameInfoStyles = useMemo(() => ({ height: 'calc(100dvh - 4em)' }), []);
    const calculateSizes = useCallback(() => {
        const squareSize = Math.max(
            MIN_SQUARE_SIZE,
            Math.min(MAX_SQUARE_SIZE, Math.floor(Math.min(windowSize.innerWidth, windowSize.innerHeight) / 22))
        );

        const newRows = Math.floor((windowSize.innerHeight - 220) / squareSize);
        const newCols = Math.floor(windowSize.innerWidth / squareSize);

        return { squareSize, newRows, newCols };
    }, [windowSize.innerWidth, windowSize.innerHeight]);

    const initialSizes = useMemo(() => windowSize.innerWidth && windowSize.innerHeight ? calculateSizes() : { squareSize: 0, newRows: 0, newCols: 0 }, [calculateSizes, windowSize])

    const { squareSize, newRows, newCols } = initialSizes;
    const [localRows, setRows] = useState<number>(newRows);
    const [localCols, setCols] = useState<number>(newCols);

    const size = useMemo(() => squareSize, [squareSize])

    const [snake, setSnake] = useState<SnakeSegment[]>([{ x: 0, y: 0 }]);

    const updateSnake = useCallback(
        (newSnake: SnakeSegment[]) => {
            setSnake((prevSnake) => {
                // Update snake logic here, if needed
                return newSnake;
            });
        },
        []
    );

    const [direction, setDirection] = useState("right");

    const [speed, setSpeed] = useState(200);
    const [minNumberOfFood, setMinNumberOfFood] = useState(1);
    const [maxNumberOfFood, setMaxNumberOfFood] = useState(1);
    const [minNumberOfObstacles, setMinNumberOfObstacles] = useState(3);
    const [maxNumberOfObstacles, setMaxNumberOfObstacles] = useState(5);

    const handleSetSpeed = useCallback((newSpeed: number) => {
        setSpeed(-newSpeed);
    }, [])

    const generateNewSegments = useCallback((count: number, position: any) => {
        const newSegments = [];
        let currentSegment = position;

        for (let i = 0; i < count; i++) {
            newSegments.push({ x: currentSegment.x, y: currentSegment.y - i });
            currentSegment = newSegments[i];
        }

        return newSegments;
    }, []);

    const generateObstacles = useCallback((): SnakeSegment[] => {
        const obstaclesCount = getRandomNumber(minNumberOfObstacles, maxNumberOfObstacles);
        const obstacles: SnakeSegment[] = [];

        const isObstacleInRestrictedArea = (x: number, y: number): boolean => {
            // Check if the obstacle is too close to the snake's head
            const isNearSnakeHead =
                Math.abs(snake[0].x - x) <= 4 && Math.abs(snake[0].y - y) <= 3;

            // Check if the obstacle is too close to any part of the snake
            const isNearSnake = snake.some(
                (segment) =>
                    Math.abs(segment.x - x) <= 2 && Math.abs(segment.y - y) <= 2
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
                Math.abs(snake[0].x - x) <= 4 && Math.abs(snake[0].y - y) <= 3;

            // Check if the food is too close to any part of the snake
            const isNearSnake = snake.some(
                (segment) =>
                    Math.abs(segment.x - x) <= 2 && Math.abs(segment.y - y) <= 1
            );

            // Check if the food is too close to any obstacle
            const isNearObstacle = obstacles.some(
                (o) => Math.abs(o.x - x) <= 4 && Math.abs(o.y - y) <= 4
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

        setMaxNumberOfFood(1)
        setMinNumberOfFood(1)
        setMaxNumberOfObstacles(5)
        setMinNumberOfObstacles(3)
        setObstacles(generateObstacles());
        setFood(generateFood());
    }, [generateObstacles, generateFood]);

    const calculateScore = useCallback((speed: number, numberOfFood: number, obstacles: number) => {
        const baseScore = 0;
        const speedScore = (0.5 / Math.abs(speed)) * 400;
        const difficultyModifier = 1 - (numberOfFood / 10 + obstacles / 10) / 2;

        return (baseScore + speedScore + difficultyModifier);
    }, []);

    const handleFoodCollision = useCallback(
        (newSnake: SnakeSegment[], newHead: SnakeSegment, obstacles: SnakeSegment[]) => {
            const remainingFood = food.filter(
                (f) => !(f.x === newHead.x && f.y === newHead.y)
            );

            if (remainingFood.length === food.length) {
                // No food was eaten
                updateSnake(newSnake);
            } else {
                // Food was eaten
                const growthRate = 1;
                const newSegments = generateNewSegments(growthRate, newHead);

                updateSnake([...newSegments, ...newSnake]);

                setFood(remainingFood);

                // Check if all food is eaten
                if (remainingFood.length === 0) {
                    // Generate new food
                    setFood(generateFood());

                    // Increase score
                    const newScore = calculateScore(speed, growthRate, obstacles.length);
                    setScore((prevScore) => prevScore + newScore);
                }
            }
        },
        [food, generateFood, speed, calculateScore, updateSnake, generateNewSegments]
    );

    const handleGameEnd = useCallback(() => {
        setIsRunning(false);
        if (isRunning) {
            alert(`Game over! Your score is ${score.toFixed(2)}`);
        }
        resetGame();
    }, [isRunning, score, resetGame]);

    const moveSnake = useCallback(() => {
        if (!isRunning || isPaused) return;

        setSnake((prevSnake) => {
            const newSnake = [...prevSnake];
            const head = { ...newSnake[0] };

            switch (direction) {
                case "up":
                    head.y = (head.y - 1 + localRows) % localRows;
                    break;
                case "down":
                    head.y = (head.y + 1) % localRows;
                    break;
                case "left":
                    head.x = (head.x - 1 + localCols) % localCols;
                    break;
                case "right":
                    head.x = (head.x + 1) % localCols;
                    break;
                default:
                    break;
            }

            newSnake.unshift(head);
            newSnake.pop();

            const hasCollision = newSnake.slice(1).some(
                (segment) => segment.x === head.x && segment.y === head.y
            ) || obstacles.some(
                (o) => o.x === head.x && o.y === head.y
            );

            if (hasCollision) {
                handleGameEnd();
            } else {
                handleFoodCollision(newSnake, head, obstacles);
            }

            return newSnake;
        });
    }, [direction, localRows, localCols, isRunning, isPaused, obstacles, handleGameEnd, handleFoodCollision]);

    const animationFrameRef = useRef<number>();
    const lastFrameTimeRef = useRef<number>(0);

    const gameLoop = useCallback((timestamp: number) => {
        if (!isRunning) return;
        if (isPaused) return;
        if (!lastFrameTimeRef.current) {
            lastFrameTimeRef.current = timestamp;
        }

        const elapsed = timestamp - lastFrameTimeRef.current;

        if (elapsed > speed) {
            moveSnake();
            lastFrameTimeRef.current = timestamp - (elapsed % speed);
        }

        animationFrameRef.current = requestAnimationFrame(gameLoop);
    }, [moveSnake, speed, isRunning, isPaused]);

    useEffect(() => {
        if (isRunning && !isPaused) {
            animationFrameRef.current = requestAnimationFrame(gameLoop);
        }

        return () => {
            if (animationFrameRef.current)
                cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isRunning, isPaused, gameLoop]);

    useEffect(() => {
        if (score > 5) {
            if (speed < 540) {
                setSpeed(prev => prev - 5)
            }
            setMinNumberOfFood(1)
            setMaxNumberOfFood(2)
            setMinNumberOfObstacles(3)
            setMaxNumberOfObstacles(5)
        }
        if (score > 10) {
            if (speed < 540) {
                setSpeed(prev => prev - 4)
            }

            setMinNumberOfFood(2)
            setMaxNumberOfFood(3)
            setMinNumberOfObstacles(5)
            setMaxNumberOfObstacles(10)
        }
        if (score > 30) {
            if (speed < 540) {
                setSpeed(prev => prev - 3)
            }

            setMinNumberOfFood(3)
            setMaxNumberOfFood(4)
            setMinNumberOfObstacles(10)
            setMaxNumberOfObstacles(15)
        }
        if (score > 50) {
            if (speed < 540) {
                setSpeed(prev => prev - 2)
            }

            setMinNumberOfFood(4)
            setMaxNumberOfFood(6)
            setMinNumberOfObstacles(20)
            setMaxNumberOfObstacles(30)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [score])

    useEffect(() => {
        if (minNumberOfObstacles) {
            setObstacles(generateObstacles())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minNumberOfObstacles])

    useEffect(() => {
        const newRows = Math.floor((windowSize.innerHeight - (isRunning ? 165 : 220)) / squareSize);
        setRows(newRows);

        const newCols = Math.floor(windowSize.innerWidth / squareSize);
        setCols(newCols);
    }, [windowSize, squareSize, isPaused, isRunning]);

    const memoizedSnake = useMemo(() => snake, [snake]);

    return (
        <div className="justify-center content-center items-center" style={gameInfoStyles}>
            <div className="mb-1 flex flex-col content-center items-center">{
                <Board
                    rows={localRows}
                    cols={localCols}
                    snake={memoizedSnake}
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
                        min="-640"
                        max="-80"
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
