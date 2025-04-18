import React, {useCallback, useEffect, useRef, useState} from "react";
import useWindowSize from "../../../hooks/useWindowSize";
import {useNavigate} from "react-router-dom";
import CloseIcon from "../../../assets/icons/CloseIcon";

const CELL_SIZE = 16;
const BOARD_PADDING = 2 * CELL_SIZE;
const fruitEmojis = ["🍎", "🍌", "🍇", "🍊", "🍓", "🍍"];
const obstacleEmojis = ["🧱"];

interface SnakeBoardProps {
    boardSize: {
        innerWidth: number;
        innerHeight: number;
    };
    getCellStyle: (x: number, y: number) => string;
    renderFood: (x: number, y: number) => React.ReactNode;
    renderObstacle: (x: number, y: number) => React.ReactNode;
}

const SnakeBoard: React.FC<SnakeBoardProps> = ({
                                                   boardSize,
                                                   getCellStyle,
                                                   renderFood,
                                                   renderObstacle,
                                               }) => {
    return (
        <div
            className="border border-gray-600 mt-1"
            style={{background: "#2C3E50"}}
        >
            {Array.from({length: boardSize.innerHeight}).map((_, y) => (
                <div key={y} className="flex">
                    {Array.from({length: boardSize.innerWidth}).map((_, x) => (
                        <div key={x} className={getCellStyle(x, y)}>
                            {renderFood(x, y)}
                            {renderObstacle(x, y)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

enum Direction {
    Up,
    Down,
    Left,
    Right,
}

type Position = {
    x: number;
    y: number;
    emoji?: string; // Add the emoji property here
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
    score: number;
    foodCount: number;
    obstaclesCount: number;
    obstacles: Position[];
};

const SnakeGame: React.FC = () => {
    const {innerWidth, innerHeight} = useWindowSize();
    const randomFruitRef = useRef<string | null>(null);
    const randomObstacleRef = useRef<string | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const boardRef = useRef<any>(null);
    const navigate = useNavigate();

    const initialState: State = {
        boardSize: {
            innerWidth: 0,
            innerHeight: 0,
        },
        score: 0,
        snake: [{x: 0, y: 0}],
        food: [{x: 10, y: 10}],
        direction: Direction.Right,
        speed: 5,
        running: false,
        foodCount: 1,
        obstaclesCount: 10,
        obstacles: [],
    };

    const [state, setState] = useState<State>(initialState);

    const isCollidingWithFood = useCallback(
        (snake: Position[]) => {
            const {food} = state;
            const head = snake[snake.length - 1];
            return food.some((f) => f.x === head.x && f.y === head.y);
        },
        [state]
    );

    const generateFood = useCallback((prevState: State) => {
        const boardSize = prevState.boardSize;
        const newFood = prevState.food;

        for (let i = 0; i < prevState.foodCount; i++) {
            const x = Math.floor(Math.random() * boardSize.innerWidth);
            const y = Math.floor(Math.random() * boardSize.innerHeight);
            const randomEmoji =
                fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)];

            newFood.push({x, y, emoji: randomEmoji});
        }

        return {...prevState, food: newFood};
    }, []);

    const generateObstacles = useCallback((prevState: State) => {
        const obstacles: any = [];

        for (let i = 0; i < prevState.obstaclesCount; i++) {
            const x = Math.floor(Math.random() * prevState.boardSize.innerWidth);
            const y = Math.floor(Math.random() * prevState.boardSize.innerHeight);
            const randomEmoji =
                obstacleEmojis[Math.floor(Math.random() * obstacleEmojis.length)];

            obstacles.push({x, y, emoji: randomEmoji});
        }

        return {...prevState, obstacles};
    }, []);

    const consumeFood = useCallback((newSnake: Position[]) => {
        setState((prevState) => {
            const {food, score} = prevState;
            const head = newSnake[newSnake.length - 1];
            const consumedFoodIndex = food.findIndex(
                (pos) => pos.x === head.x && pos.y === head.y
            );
            const obstacles = [...prevState.obstacles];
            let obstacleCount = prevState.obstaclesCount;
            let increaseObstacles = false;

            if (consumedFoodIndex !== -1) {
                const newFood = [...food];
                newFood.splice(consumedFoodIndex, 1);

                let newScore = score + 1;
                let newFoodCount =
                    prevState.foodCount - 1 === 0 ? 1 : prevState.foodCount - 1;

                if (newScore === 5 || newScore === 15 || newScore === 30) {
                    increaseObstacles = true;
                    obstacleCount += 5;
                    newFoodCount++;
                }

                if (increaseObstacles) {
                    for (let i = 0; i < obstacleCount; i++) {
                        const x = Math.floor(
                            Math.random() * prevState.boardSize.innerWidth
                        );
                        const y = Math.floor(
                            Math.random() * prevState.boardSize.innerHeight
                        );
                        const randomEmoji =
                            obstacleEmojis[Math.floor(Math.random() * obstacleEmojis.length)];

                        obstacles.push({x, y, emoji: randomEmoji});
                    }
                }

                const newState = generateFood({
                    ...prevState,
                    snake: newSnake,
                    score: newScore,
                    foodCount: newFoodCount,
                    food: newFood,
                    obstacles: increaseObstacles ? obstacles : prevState.obstacles,
                });

                increaseObstacles = false;

                return newState;
            }

            return prevState;
        });
    }, []);

    const handleObstacleCollision = useCallback(() => {
        const snake = state.snake;
        const obstacles = state.obstacles;
        const head = snake[snake.length - 1];
        return obstacles?.some((pos) => pos.x === head.x && pos.y === head.y);
    }, [state.snake, state.obstacles]);

    const getCellStyle = useCallback(
        (x: number, y: number) => {
            const {snake, food, direction} = state;
            const isSnakeHead =
                snake.length > 0 &&
                snake[snake.length - 1].x === x &&
                snake[snake.length - 1].y === y;
            const isSnakeBody = snake
                .slice(0, -1)
                .some((pos) => pos.x === x && pos.y === y);
            const isFood = food.some((pos) => pos.x === x && pos.y === y);

            let styleClass = "w-4 h-4 inline-block ";

            if (isSnakeHead) {
                switch (direction) {
                    case Direction.Down:
                        styleClass += "rounded-b-full border-t-0 ";
                        break;
                    case Direction.Up:
                        styleClass += "rounded-full border-b-0 ";
                        break;
                    case Direction.Right:
                        styleClass += "rounded-r-full border-l-0 ";
                        break;
                    case Direction.Left:
                        styleClass += "rounded-l-full border-r-0 ";
                        break;
                }
                styleClass += "bg-green-500 relative";
            } else if (isSnakeBody) {
                styleClass += "bg-green-500 ";
            } else if (isFood) {
                styleClass += "text-xl font-bold ";
            }

            return styleClass;
        },
        [state]
    );

    const startGame = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            running: true,
            obstacles:
                prevState.obstacles.length === 0
                    ? generateObstacles(prevState).obstacles
                    : prevState.obstacles,
        }));
    }, []);

    const resetGame = useCallback(() => {
        setState((prevState) => ({
            ...initialState,
            boardSize: prevState.boardSize,
            foodCount: 1,
        }));
    }, []);

    const stopGame = useCallback(() => {
        setState((prevState) => ({...prevState, running: false}));
    }, []);

    const pauseGame = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            running: !prevState.running,
            obstacles:
                prevState.obstacles.length === 0
                    ? generateObstacles(prevState).obstacles
                    : prevState.obstacles,
        }));
    }, []);

    const checkSelfCollision = useCallback(() => {
        const snake = state.snake;
        const head = snake[snake.length - 1];
        return snake
            .slice(0, -1)
            .some((pos) => pos.x === head.x && pos.y === head.y);
    }, [state.snake]);

    const endGame = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            running: false,
        }));
        alert(`Game over! Your score is ${state.score}`);
        resetGame();
    }, [state.score, resetGame]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            event.preventDefault();
            event.stopPropagation();

            const oppositeDirections = {
                [Direction.Up]: Direction.Down,
                [Direction.Down]: Direction.Up,
                [Direction.Left]: Direction.Right,
                [Direction.Right]: Direction.Left,
            };

            switch (event.key) {
                case "ArrowUp":
                    if (state.direction !== oppositeDirections[Direction.Up]) {
                        setState((prevState) => ({
                            ...prevState,
                            direction: Direction.Up,
                        }));
                    }
                    break;
                case "ArrowDown":
                    if (state.direction !== oppositeDirections[Direction.Down]) {
                        setState((prevState) => ({
                            ...prevState,
                            direction: Direction.Down,
                        }));
                    }
                    break;
                case "ArrowLeft":
                    if (state.direction !== oppositeDirections[Direction.Left]) {
                        setState((prevState) => ({
                            ...prevState,
                            direction: Direction.Left,
                        }));
                    }
                    break;
                case "ArrowRight":
                    if (state.direction !== oppositeDirections[Direction.Right]) {
                        setState((prevState) => ({
                            ...prevState,
                            direction: Direction.Right,
                        }));
                    }
                    break;
                case " ":
                    pauseGame();
                    break;
                case "Escape":
                    resetGame();
                    break;
            }
        },
        [state, pauseGame, resetGame]
    );

    const handleSwipe = useCallback(
        (direction: Direction) => {
            const oppositeDirections = {
                [Direction.Up]: Direction.Down,
                [Direction.Down]: Direction.Up,
                [Direction.Left]: Direction.Right,
                [Direction.Right]: Direction.Left,
            };

            if (state.direction !== oppositeDirections[direction]) {
                setState((prevState) => ({
                    ...prevState,
                    direction,
                }));
            }
        },
        [setState, state]
    );

    const moveSnake = useCallback(() => {
        setState((prevState) => {
            const newSnake = [...prevState.snake];
            const head = newSnake[newSnake.length - 1];
            let newHead: Position;

            switch (prevState.direction) {
                case Direction.Up:
                    newHead = {x: head.x, y: head.y - 1};
                    break;
                case Direction.Down:
                    newHead = {x: head.x, y: head.y + 1};
                    break;
                case Direction.Left:
                    newHead = {x: head.x - 1, y: head.y};
                    break;
                case Direction.Right:
                    newHead = {x: head.x + 1, y: head.y};
                    break;
            }

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

            return {...prevState, snake: newSnake, score: newSnake.length - 1};
        });
    }, [
        consumeFood,
        checkSelfCollision,
        endGame,
        isCollidingWithFood,
        handleObstacleCollision,
    ]);

    const renderFood = useCallback(
        (x: number, y: number) => {
            const food = [...state.food];
            const currentFood = food.find((pos) => pos.x === x && pos.y === y);

            if (currentFood) {
                return (
                    <div
                        className="flex items-center justify-center h-full emoji-row"
                        key={`${x}-${y}`}
                    >
                        {currentFood.emoji ?? randomFruitRef.current}
                    </div>
                );
            }
            return null;
        },
        [state.food]
    );

    const renderObstacle = useCallback(
        (x: number, y: number) => {
            const obstacles = [...state.obstacles];
            if (obstacles.length === 0) return null;
            const currentObstacle = obstacles.find(
                (pos) => pos.x === x && pos.y === y
            );

            if (currentObstacle) {
                return (
                    <div
                        className="flex items-center justify-center h-full emoji-row"
                        key={`${x}-${y}`}
                    >
                        {currentObstacle.emoji ?? randomObstacleRef.current}
                    </div>
                );
            }

            return null;
        },
        [state.obstacles]
    );

    const renderControls = useCallback(() => {
        if (state.running) {
            return (
                <div className="flex ml-3 mt-1">
                    <button
                        style={{color: "red"}}
                        className="bg-black border border-gray-500 p-0.5"
                        onClick={stopGame}
                    >
                        Stop
                    </button>
                    <button
                        style={{color: "green"}}
                        className="bg-black border border-gray-500 ml-1 p-0.5"
                        onClick={pauseGame}
                    >
                        {state.running ? "Pause" : "Resume"}
                    </button>
                </div>
            );
        } else {
            return (
                <div className="flex ml-3 mt-1">
                    {
                        <button
                            style={{color: "green"}}
                            className="bg-black border border-gray-500 p-0.5"
                            onClick={startGame}
                        >
                            Start
                        </button>
                    }
                    <button
                        style={{color: "orange"}}
                        className="bg-black border border-gray-500 ml-1 p-0.5"
                        onClick={resetGame}
                    >
                        Reset
                    </button>
                </div>
            );
        }
    }, [state.running, startGame, stopGame, pauseGame, resetGame]);

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            e.stopPropagation();
            e.preventDefault();
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!touchStartX.current || !touchStartY.current) return;

            const deltaX = e.touches[0].clientX - touchStartX.current;
            const deltaY = e.touches[0].clientY - touchStartY.current;

            const deltaThreshold = 10;

            if (
                Math.abs(deltaX) > deltaThreshold ||
                Math.abs(deltaY) > deltaThreshold
            ) {
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

        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleSwipe, handleKeyDown]);

    useEffect(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const cellSize = CELL_SIZE;
        const boardWidth = Math.floor(
            (innerWidth - BOARD_PADDING) / (!isMobile ? cellSize : cellSize - 1)
        );
        const boardHeight = Math.floor(
            (innerHeight - BOARD_PADDING) / cellSize - 8
        );

        setState((prevState) => ({
            ...prevState,
            boardSize: {innerWidth: boardWidth, innerHeight: boardHeight},
        }));
    }, [innerWidth, innerHeight]);

    useEffect(() => {
        let intervalId: ReturnType<typeof setTimeout>;

        if (state.running) {
            intervalId = setInterval(() => {
                moveSnake();
            }, 500 / state.speed);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [state.running, state.speed, moveSnake]);

    useEffect(() => {
        randomFruitRef.current =
            fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)];
        randomObstacleRef.current =
            obstacleEmojis[Math.floor(Math.random() * obstacleEmojis.length)];
    }, []);

    return (
        <div
            style={{
                height: 'calc(100dvh - 6em)',
            }}
            className="justify-center items-center align-center flex flex-col border-gray-500"
            ref={boardRef}
        >
            <div className="flex flex-col justify-center items-center">
                <div className="flex justify-between w-full">
                    <div
                        className="border p-1 bg-black border-gray-500 w-1/3"
                        style={{color: "green"}}
                    >
                        Score: {state.score}
                    </div>
                    <div
                        onClick={() => navigate("/games/")}
                        className="flex cursor-pointer justify-end mt-2"
                    >
                        <CloseIcon/>
                    </div>
                </div>

                <SnakeBoard
                    boardSize={state.boardSize}
                    getCellStyle={getCellStyle}
                    renderFood={renderFood}
                    renderObstacle={renderObstacle}
                />
            </div>
            <div className="flex items-center border-gray-500 justify-between w-full">
                <span className="">{renderControls()}</span>
                <input
                    style={{color: "green", backgroundColor: "black"}}
                    className="bg-gray-800 mr-2 border border-gray-500 w-1/3"
                    type="range"
                    min="1"
                    max="40"
                    step="1"
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
