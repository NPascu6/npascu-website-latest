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
        const newRows = Math.floor((windowSize.innerHeight - 220) / squareSize);
        const newCols = Math.floor((windowSize.innerWidth) / squareSize);

        return { squareSize, newRows, newCols };
    }, [windowSize]);

    const { squareSize, newRows, newCols } = calculateSizes()
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
        const foodCount = getRandomNumber(minNumberOfFood, maxNumberOfFood);
        const food: SnakeSegment[] = [];

        const isFoodInRestrictedArea = (x: number, y: number): boolean => {
            // Check if the food is too close to the snake's head
            const isNearSnakeHead =
                Math.abs(snake[0].x - x) <= 10 && Math.abs(snake[0].y - y) <= 10;

            return isNearSnakeHead;
        };

        const generateSingleFood = (): SnakeSegment => ({
            x: Math.floor(Math.random() * newCols),
            y: Math.floor(Math.random() * newRows),
        });

        const generateValidFood = (): SnakeSegment => {
            const newFood = generateSingleFood();

            if (isFoodInRestrictedArea(newFood.x, newFood.y)) {
                // If the generated food is in the restricted area, try again
                return generateValidFood();
            }

            return newFood;
        };

        for (let i = 0; i < foodCount; i++) {
            food.push(generateValidFood());
        }

        return food;
    }, [newCols, newRows, minNumberOfFood, maxNumberOfFood, snake]);


    const generateObstacles = useCallback((): SnakeSegment[] => {
        const obstaclesCount = getRandomNumber(minNumberOfObstacles, maxNumberOfObstacles);
        const obstacles: SnakeSegment[] = [];

        const isObstacleInRestrictedArea = (x: number, y: number): boolean => {
            // Check if the obstacle is too close to the snake's head
            const isNearSnakeHead =
                Math.abs(snake[0].x - x) <= 10 && Math.abs(snake[0].y - y) <= 10;

            // Check if the obstacle is too close to any part of the snake
            const isNearSnake = snake.some(
                (segment) =>
                    Math.abs(segment.x - x) <= 10 && Math.abs(segment.y - y) <= 10
            );

            return isNearSnakeHead || isNearSnake;
        };

        const generateSingleObstacle = (): SnakeSegment => ({
            x: Math.floor(Math.random() * newCols),
            y: Math.floor(Math.random() * newRows),
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
    }, [newCols, newRows, minNumberOfObstacles, maxNumberOfObstacles, snake]);


    const [food, setFood] = useState<SnakeSegment[]>(generateFood());
    const [obstacles, setObstacles] = useState<SnakeSegment[]>(generateObstacles());

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
        setSnake([{ x: 0, y: 0 }]);
        setDirection("right");
        setScore(0);
        setObstacles(generateObstacles());
        setFood(generateFood());
    }, [generateObstacles, generateFood]);

    const calculateScore = useCallback((speed: number, difficultyModifier: number) => {
        const baseScore = 0;
        const speedScore = (1 / speed) * 300;
        const sizeScore = difficultyModifier;

        return baseScore + speedScore + sizeScore;
    }, []);

    const handleFoodCollision = useCallback((newSnake: SnakeSegment[], newHead: SnakeSegment) => {
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
                const newScore = calculateScore(speed, 1);
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
        if (!isRunning) return
        if (isPaused) return
        const head = snake[0];
        let newHead: SnakeSegment;

        switch (direction) {
            case "up":
                newHead = { x: head.x, y: (head.y - 1 + newRows) % newRows };
                break;
            case "down":
                newHead = { x: head.x, y: (head.y + 1) % newRows };
                break;
            case "left":
                newHead = { x: (head.x - 1 + newCols) % newCols, y: head.y };
                break;
            case "right":
                newHead = { x: (head.x + 1) % newCols, y: head.y };
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
    }, [direction, snake, newCols, newRows, obstacles, handleFoodCollision, handleGameEnd, isRunning, isPaused]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            moveSnake();
        }, speed);

        return () => clearInterval(intervalId);
    }, [moveSnake, speed]);

    useEffect(() => {
        if (maxCols && maxRows) return
        if (!newRows || !newCols) return
        setMaxRows(newRows);
        setMaxCols(newCols);
    }, [newRows, newCols, maxCols, maxRows]);

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

    return (
        <div className="max-w-screen-md mx-auto justify-center content-center items-center min-w-full" style={{ height: 'calc(100dvh - 4em)' }}>
            <div className="mb-1 flex flex-col content-center items-center">{
                <Board
                    rows={newRows}
                    cols={newCols}
                    snake={snake}
                    food={food}
                    obstacles={obstacles}
                    squareSize={squareSize}
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
                <div className="flex items-center relative p-3 pb-0">
                    <input
                        id="speed"
                        type="range"
                        min="-300"
                        max="10"
                        step="-100"
                        value={-speed}
                        onChange={(e) => handleSetSpeed(e.target.valueAsNumber)}
                        className="h-10 w-full p-0 ml-2 border border-gray-500 w-2/3 mb-2"
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
