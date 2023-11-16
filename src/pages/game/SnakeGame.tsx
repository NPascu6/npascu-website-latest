import React, { useState, useEffect, useCallback, useRef } from "react"
import useWindowSize from "../../hooks/useWindowSize";

const CELL_SIZE = 16;
const BOARD_PADDING = 2 * CELL_SIZE;
const fruitEmojis = ["🍎", "🍌", "🍇", "🍊", "🍓", "🍍"];

enum Direction {
    Up,
    Down,
    Left,
    Right,
}

type Position = {
    x: number;
    y: number;
};

type State = {
    boardSize: {
        innerWidth: number;
        innerHeight: number;
    };
    snake: Position[];
    food: Position[];
    direction: Direction;
    speed: number;
    running: boolean;
    score?: number;
    foodCount?: number;
    obstacles?: Position[];
};

const initialState: State = {
    boardSize: {
        innerWidth: 0,
        innerHeight: 0,
    },
    score: 0,
    snake: [{ x: 0, y: 0 }],
    food: [{ x: 10, y: 10 }],
    direction: Direction.Right,
    speed: 5,
    running: false,
    foodCount: 1,
    obstacles: [],
};

const SnakeGame: React.FC = () => {
    const [state, setState] = useState<State>(initialState);
    const { innerWidth, innerHeight } = useWindowSize();
    const randomFruitRef = useRef<string | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const isCollidingWithFood = useCallback(
        (snake: Position[]) => {
            const { food } = state;
            const head = snake[snake.length - 1];
            return food.some((f) => f.x === head.x && f.y === head.y);
        },
        [state]
    );

    const generateFood = useCallback(() => {
        const { boardSize } = state;
        const { foodCount } = state;
        if (!foodCount) return null;
        const newFood: Position[] = [];
        for (let i = 0; i < foodCount; i++) {
            const x = Math.floor(Math.random() * boardSize.innerWidth);
            const y = Math.floor(Math.random() * boardSize.innerHeight);
            newFood.push({ x, y });
        }
        setState((prevState) => ({ ...prevState, food: newFood }));
    }, [state]);

    const consumeFood = useCallback(
        (newSnake: Position[]) => {
            generateFood();
            setState((prevState) => {
                const { score } = prevState;
                let newScore = score ? score + 1 : 1;
                // Increase the number of food when reaching score milestones
                let newFoodCount = prevState.foodCount || 1;
                if (newScore === 2 || newScore === 5 || newScore === 8) {
                    newFoodCount++;
                }
                return {
                    ...prevState,
                    snake: newSnake,
                    score: newScore,
                    foodCount: newFoodCount,
                };
            });
        },
        [generateFood]
    );

    const handleObstacleCollision = useCallback(() => {
        const { snake, obstacles } = state;
        const head = snake[snake.length - 1];
        return obstacles?.some((pos) => pos.x === head.x && pos.y === head.y);
    }, [state]);

    const renderFood = useCallback((x: number, y: number) => {
        const { food } = state;
        const isFood = food.some((pos) => pos.x === x && pos.y === y);

        if (isFood && randomFruitRef.current) {
            return (
                <div className="flex items-center justify-center h-full emoji-row">
                    <div className="rounded-full bg-transparent-400 p-1">{randomFruitRef.current}</div>
                </div>
            );
        }
        return null;
    }, [state]);

    const getCellStyle = useCallback(
        (x: number, y: number) => {
            const { snake, food, direction } = state;
            const isSnakeHead =
                snake.length > 0 && snake[snake.length - 1].x === x && snake[snake.length - 1].y === y;
            const isSnakeBody = snake.slice(0, -1).some((pos) => pos.x === x && pos.y === y);
            const isFood = food.some((pos) => pos.x === x && pos.y === y);

            let styleClass = "border-dotted border-2 border-gray-500 w-4 h-4 inline-block ";

            if (isSnakeHead) {
                // Add styling for the snake's head
                switch (direction) {
                    case Direction.Down:
                        styleClass += "rounded-b-full border-t-0 ";
                        break;
                    case Direction.Up:
                        styleClass += "rounded-t-full border-b-0 ";
                        break;
                    case Direction.Right:
                        styleClass += "rounded-r-full border-l-0 ";
                        break;
                    case Direction.Left:
                        styleClass += "rounded-l-full border-r-0 ";
                        break;
                }
                // Add eyes and mouth
                styleClass += "bg-green-500 relative";
            } else if (isSnakeBody) {
                // Styling for the snake's body
                styleClass += "bg-green-500 ";
            } else if (isFood) {
                // Styling for the food
                styleClass += "text-xl font-bold "; // You can adjust the font size and weight
            }

            return styleClass;
        },
        [state]
    );

    const startGame = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            running: true,
            score: 0,
        }));
    }, []);

    const resetGame = useCallback(() => {
        setState((prevState) => ({
            ...initialState,
            boardSize: prevState.boardSize, // Preserve boardSize
        }));
    }, []);

    const stopGame = () => {
        setState((prevState) => ({ ...prevState, running: false }));
    };

    const pauseGame = useCallback(() => {
        setState((prevState) => ({ ...prevState, running: !prevState.running }));
    }, []);

    const checkSelfCollision = useCallback(() => {
        const { snake } = state;
        const head = snake[snake.length - 1];
        return snake.slice(0, -1).some((pos) => pos.x === head.x && pos.y === head.y);
    }, [state]);

    const endGame = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            running: false,
        }));
    }, []);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        event.preventDefault(); // Prevent default behavior for the keys
        event.stopPropagation();

        switch (event.key) {
            case "ArrowUp":
                setState((prevState) => ({
                    ...prevState,
                    direction: Direction.Up,
                }));
                break;
            case "ArrowDown":
                setState((prevState) => ({
                    ...prevState,
                    direction: Direction.Down,
                }));
                break;
            case "ArrowLeft":
                setState((prevState) => ({
                    ...prevState,
                    direction: Direction.Left,
                }));
                break;
            case "ArrowRight":
                setState((prevState) => ({
                    ...prevState,
                    direction: Direction.Right,
                }));
                break;
            case " ":
                // Space key - start/pause the game
                pauseGame();
                break;
            case "Escape":
                // Escape key - reset the game
                resetGame();
                break;
        }
    },
        [pauseGame, resetGame]
    );

    const moveSnake = useCallback(() => {
        setState((prevState) => {
            const newSnake = [...prevState.snake];
            const head = newSnake[newSnake.length - 1];
            let newHead: Position;

            switch (prevState.direction) {
                case Direction.Up:
                    newHead = { x: head.x, y: head.y - 1 };
                    break;
                case Direction.Down:
                    newHead = { x: head.x, y: head.y + 1 };
                    break;
                case Direction.Left:
                    newHead = { x: head.x - 1, y: head.y };
                    break;
                case Direction.Right:
                    newHead = { x: head.x + 1, y: head.y };
                    break;
            }

            // Wrap around logic
            if (newHead.x < 0) {
                newHead.x = prevState.boardSize.innerWidth - 1;
            } else if (newHead.x >= prevState.boardSize.innerWidth) {
                newHead.x = 0;
            }

            if (newHead.y < 0) {
                newHead.y = prevState.boardSize.innerHeight - 1;
            } else if (newHead.y >= prevState.boardSize.innerHeight) {
                newHead.y = 0;
            }

            newSnake.push(newHead);

            if (checkSelfCollision() || handleObstacleCollision()) {
                endGame();
                return prevState;
            }

            if (checkSelfCollision()) {
                endGame();
                return prevState;
            }

            if (isCollidingWithFood(newSnake)) {
                consumeFood(newSnake);
            } else {
                newSnake.shift();
            }

            return { ...prevState, snake: newSnake, score: newSnake.length - 1 };
        });
    }, [consumeFood, checkSelfCollision, endGame, isCollidingWithFood, handleObstacleCollision]);

    const renderControls = () => {
        if (state.running) {
            return (
                <>
                    <button className="border m-1 p-1" onClick={stopGame}>
                        Stop
                    </button>
                    <button className="border m-1 p-1" onClick={pauseGame}>
                        {state.running ? "Pause" : "Resume"}
                    </button>
                </>
            );
        } else {
            return (
                <>
                    {<button className="border m-1 p-1" onClick={startGame}>
                        Start
                    </button>}
                    <button className="border m-1 p-1" onClick={resetGame}>
                        Reset
                    </button>
                </>
            );
        }
    };

    const handleSwipe = useCallback((direction: Direction) => {
        setState((prevState) => ({
            ...prevState,
            direction,
        }));
    },
        [setState]
    );

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            e.preventDefault()
            e.stopPropagation()
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!touchStartX.current || !touchStartY.current) return;

            const deltaX = e.touches[0].clientX - touchStartX.current;
            const deltaY = e.touches[0].clientY - touchStartY.current;

            const deltaThreshold = 10; // Adjust this threshold as needed

            if (Math.abs(deltaX) > deltaThreshold || Math.abs(deltaY) > deltaThreshold) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 0) {
                        handleSwipe(Direction.Right);
                    } else {
                        handleSwipe(Direction.Left);
                    }
                } else {
                    if (deltaY > 0) {
                        handleSwipe(Direction.Down);
                    } else {
                        handleSwipe(Direction.Up);
                    }
                }

                touchStartX.current = null;
                touchStartY.current = null;
            }
        };

        const handleClick = (e: any) => {

        };

        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("click", handleClick);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("click", handleClick);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleSwipe, handleKeyDown]);

    useEffect(() => {
        const boardWidth = Math.floor((innerWidth - BOARD_PADDING) / CELL_SIZE);
        const boardHeight = Math.floor((innerHeight - BOARD_PADDING) / CELL_SIZE);
        setState((prevState) => ({
            ...prevState,
            boardSize: { innerWidth: boardWidth, innerHeight: boardHeight - 10 },
        }));
    }, [innerWidth, innerHeight]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (state.running) {
            intervalId = setInterval(() => {
                moveSnake();
            }, 1000 / state.speed);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [state, moveSnake]);

    useEffect(() => {
        // Generate a random fruit emoji when the component mounts
        randomFruitRef.current = fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)];
    }, []);

    const renderObstacles = useCallback((x: number, y: number) => {
        const { obstacles } = state;
        const isObstacle = obstacles?.some((pos) => pos.x === x && pos.y === y);

        if (isObstacle) {
            return (
                <div className="bg-gray-700 w-4 h-4 inline-block"></div>
            );
        }

        return null;
    }, [state]);

    return (
        <div className="container p-2">
            <div className="flex flex-col justify-center items-center mt-4 border" onClick={() => console.log(state)}>
                <div className="score border">Score: {state.score}</div>
                {Array.from({ length: state.boardSize.innerHeight }).map((_, y) => (
                    <div key={y} className="flex">
                        {Array.from({ length: state.boardSize.innerWidth }).map((_, x) => (
                            <div key={x} className={getCellStyle(x, y)}>
                                {renderFood(x, y)}
                                {renderObstacles(x, y)}</div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex items-center border">
                {renderControls()}
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={state.speed}
                    onChange={(event) =>
                        setState((prevState) => ({
                            ...prevState,
                            speed: parseInt(event.target.value),
                        }))
                    }
                />
            </div>
        </div>
    );
};

export default SnakeGame;
