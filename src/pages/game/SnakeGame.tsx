import React, { useState, useEffect, useCallback } from "react";

const ROWS = 20;
const COLS = 20;
const SQUARE_SIZE = 17;

const SnakeGame = () => {
    const generateFood = () => {
        return {
            x: Math.floor(Math.random() * COLS),
            y: Math.floor(Math.random() * ROWS),
        };
    };

    const [rows, setRows] = useState(ROWS);
    const [cols, setCols] = useState(COLS);
    const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
    const [food, setFood] = useState(generateFood());
    const [direction, setDirection] = useState("right");
    const [score, setScore] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const resetGame = useCallback(() => {
        setSnake([{ x: 0, y: 0 }]);
        setFood(generateFood());
        setDirection("right");
        setScore(0);
    }, []);

    const moveSnake = useCallback(() => {
        if (!isRunning) return;

        const head = snake[0];
        let newHead: any;

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
        }

        const newSnake = [newHead, ...snake.slice(0, -1)];

        // Check if snake collides with itself
        if (newSnake.slice(1).some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
            setIsRunning(false);
            resetGame();
            return;
        }

        // Check if snake consumes food
        if (newHead.x === food.x && newHead.y === food.y) {
            setFood(generateFood());
            setSnake([...newSnake, snake[snake.length - 1]]);
            setScore(score + 1);
        } else {
            setSnake(newSnake);
        }
    }, [direction, food, snake, resetGame, score, isRunning, cols, rows]);

    useEffect(() => {
        const intervalId = setInterval(moveSnake, 100);

        return () => {
            clearInterval(intervalId);
        };
    }, [moveSnake]);

    const renderSquare = (row: number, col: number) => {
        const isSnake = snake.some((s) => s.x === col && s.y === row);
        const isFood = food.x === col && food.y === row;

        return (
            <div
                style={{ width: SQUARE_SIZE, height: SQUARE_SIZE }}
                key={`${row}-${col}`}
                className={`w-${SQUARE_SIZE} h-${SQUARE_SIZE} ${isSnake ? "bg-green-500" : isFood ? "bg-red-500" : "bg-white"
                    } border border-black`}
            />
        );
    };

    const renderBoard = () => {
        const board = [];

        for (let row = 0; row < rows; row++) {
            const rowSquares = [];

            for (let col = 0; col < cols; col++) {
                rowSquares.push(renderSquare(row, col));
            }

            board.push(
                <div key={row} className="flex align-center">
                    {rowSquares}
                </div>
            );
        }

        return board;
    };

    const startGame = () => {
        setIsRunning(true);
    };

    const stopGame = () => {
        setIsRunning(false);
    };

    const resetAndStartGame = () => {
        resetGame();
        startGame();
    };

    const handleButtonClick = (newDirection: string) => {
        // Avoid reversing the snake immediately
        if ((direction === "up" && newDirection === "down") ||
            (direction === "down" && newDirection === "up") ||
            (direction === "left" && newDirection === "right") ||
            (direction === "right" && newDirection === "left")) {
            return;
        }

        setDirection(newDirection);
    };

    return (
        <div className="max-w-screen-md mx-auto p-4 justify-center content-center items-center">
            <div className="flex">
                <div className="mb-4">
                    <label htmlFor="rows" className="">
                        Rows:
                    </label>
                    <input
                        id="rows"
                        type="number"
                        value={rows}
                        onChange={(event) => setRows(parseInt(event.target.value))}
                        className="p-0 ml-2 border border-gray-500 w-1/2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="cols" className="">
                        Columns:
                    </label>
                    <input
                        id="cols"
                        type="number"
                        value={cols}
                        onChange={(event) => setCols(parseInt(event.target.value))}
                        className="p-0 ml-2 border border-gray-500 w-1/2"
                    />
                </div>
            </div>

            <div className="mb-4 flex flex-col content-center items-center">{renderBoard()}</div>
            <div className="mb-4">Score: {score}</div>
            <div className="flex mb-4 items-center content-center justify-center">
                <button onClick={startGame} className="bg-blue-500 text-white p-2 mr-2">
                    Start
                </button>
                <button onClick={stopGame} className="bg-red-500 text-white p-2 mr-2">
                    Stop
                </button>
                <button onClick={resetAndStartGame} className="bg-green-500 text-white p-2 mr-2">
                    Reset and Start
                </button>
            </div>
            <div className="flex flex-col">
                <button onClick={() => handleButtonClick("up")} className="p-2 m-2 border border-gray-500">
                    Up
                </button>
                <div className="flex justify-between">
                    <button onClick={() => handleButtonClick("left")} className="p-2 m-2 border border-gray-500 w-full">
                        Left
                    </button>
                    <button onClick={() => handleButtonClick("right")} className="p-2 m-2 border border-gray-500 w-full">
                        Right
                    </button>
                </div>

                <button onClick={() => handleButtonClick("down")} className="p-2 m-2 border border-gray-500">
                    Down
                </button>

            </div>
        </div>
    );
};

export default SnakeGame;
