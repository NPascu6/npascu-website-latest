import React, { useMemo } from "react";
import SnakeHeadIcon from '../../../assets/icons/Snake2'

interface SquareProps {
    snake: { x: number; y: number }[];
    food: { x: number; y: number }[];
    obstacles: { x: number; y: number }[];
    col: number;
    row: number;
    squareSize: number;
    fruitEmoji: string;
    wallEmoji: string;
}





const Square = ({ snake, food, obstacles, col, row, squareSize, fruitEmoji, wallEmoji }: SquareProps) => {
    const isSnakeHead =
        useMemo(() => snake.length > 0 && snake[0].x === col && snake[0].y === row, [snake, row, col])
    const isSnakeBody = useMemo(() => snake.slice(1).some((s) => s.x === col && s.y === row), [col, row, snake])


    const isFood = useMemo(() => food.some((f) => f.x === col && f.y === row), [col, row, food])
    const isWall = useMemo(() => obstacles.some((o) => o.x === col && o.y === row), [col, row, obstacles]);



    return (
        <div
            key={`${row}-${col}`}
            className={`flex items-center justify-center shadow-xl relative rounded-full`}
            style={{
                width: squareSize,
                height: squareSize
            }}
        >
            {isFood && (
                <div
                    style={{
                        width: squareSize,
                        height: squareSize,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "1.2em",
                        borderRadius: "5px",
                    }}
                    className="food-pattern shadow-xl"
                >
                    {fruitEmoji}
                </div>
            )}
            {isWall && (
                <div
                    style={{
                        width: squareSize,
                        height: squareSize,
                        border: "1px solid transparent", // Set border color to transparent
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "1.2em",
                        borderRadius: "5px",
                    }}
                    className="brick-pattern shadow-xl"
                >
                    {wallEmoji}
                </div>
            )}
            {isSnakeHead && (
                <div
                    style={{
                        width: squareSize + 10,
                        height: squareSize + 10,
                        fontSize: "1.4em",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                    }}
                >
                    <SnakeHeadIcon />
                </div>
            )}
            {isSnakeBody && (
                <div style={{
                    height: '0.8em',
                    width: '0.8em',
                    borderRadius: '50%',
                    backgroundColor: "#6ea632",
                }}></div>
            )}
        </div>
    );
}

export default React.memo(Square);


