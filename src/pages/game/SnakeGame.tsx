import React, { useState, useEffect, useCallback, useRef } from "react";
import classNames from "classnames";
import useWindowSize from "../../hooks/useWindowSize";

const CELL_SIZE = 16;
const BOARD_PADDING = 2 * CELL_SIZE;

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
};

const SnakeGame: React.FC = () => {
    const [state, setState] = useState<State>(initialState);
    const { innerWidth, innerHeight } = useWindowSize();

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

    const getCellStyle = useCallback(
        (x: number, y: number) => {
            const { snake, food } = state;
            const isSnake = snake.some((pos) => pos.x === x && pos.y === y);
            const isFood = food.some((pos) => pos.x === x && pos.y === y);

            return classNames("w-4", "h-4", "inline-block", {
                "bg-green-500": isSnake,
                "bg-red-500": isFood,
            });
        },
        [state]
    );

    const startGame = () => {
        setState((prevState) => ({
            ...prevState,
            running: true,
            score: 0,
        }));
    };

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

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            event.preventDefault(); // Prevent default behavior for the keys

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
            let newHead;

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
    }, [consumeFood, checkSelfCollision, endGame, isCollidingWithFood]);

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
                    <button className="border m-1 p-1" onClick={startGame}>
                        Start
                    </button>
                    <button className="border m-1 p-1" onClick={resetGame}>
                        Reset
                    </button>
                </>
            );
        }
    };

    const handleSwipe = useCallback(
        (direction: Direction) => {
            setState((prevState) => ({
                ...prevState,
                direction,
            }));
        },
        [setState]
    );

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!touchStartX.current || !touchStartY.current) return;

            const deltaX = e.touches[0].clientX - touchStartX.current;
            const deltaY = e.touches[0].clientY - touchStartY.current;

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
        };

        const handleClick = () => {
            // Handle click event here (you can change the direction or perform other actions)
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
            boardSize: { innerWidth: boardWidth, innerHeight: boardHeight - 8 },
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

    return (
        <div className="flex flex-col items-center border shadow-xl p-2">
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
            <div className="mt-4 border" onClick={() => console.log(state)}>
                <div className="score border">Score: {state.score}</div>
                {Array.from({ length: state.boardSize.innerHeight }).map((_, y) => (
                    <div key={y} className="flex">
                        {Array.from({ length: state.boardSize.innerWidth }).map((_, x) => (
                            <div key={x} className={getCellStyle(x, y)}></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SnakeGame;
