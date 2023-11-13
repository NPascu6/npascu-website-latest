import React from "react";
import { getRandomNumber } from "../../../util";

interface SquareProps {
    snake: { x: number; y: number }[];
    food: { x: number; y: number }[];
    obstacles: { x: number; y: number }[];
    col: number;
    row: number;
    squareSize: number;
}

const Square = ({ snake, food, obstacles, col, row, squareSize }: SquareProps) => {

    const isSnakeHead =
        snake.length > 0 && snake[0].x === col && snake[0].y === row;
    const isSnakeBody = snake.slice(1).some((s) => s.x === col && s.y === row);
    const isFood = food.some((f) => f.x === col && f.y === row);
    const isWall = obstacles.some((o) => o.x === col && o.y === row);
    return (
        <div
            key={`${row}-${col}`}
            className={`w-${squareSize} h-${squareSize} relative 
                ${isSnakeHead ? "bg-green-400 rounded-full" :
                    isSnakeBody ? "bg-green-600 rounded-full" :
                        isFood ? "bg-orange-600 rounded-full" :
                            "bg-gray-800"}`}
            style={{
                width: squareSize,
                height: squareSize,
                transition: "all 0.1s ease-in-out",

            }}
        >
            {isFood && (
                <div
                    style={{ width: "1.5em", height: "1.5em", display: "block" }}
                    className="rounded-full"
                >
                    {Array.from({ length: 5 }, (_, i) => (
                        <div
                            key={i}
                            className="food"
                            style={{
                                top: getRandomNumber(30, 70) + "%",
                                left: getRandomNumber(20, 70) + "%",
                            }}
                        />
                    ))}
                </div>
            )}
            {isWall && <div className="brick-pattern" />}

            {isSnakeHead && (
                <div className="snake-eyes">
                    <div className="snake-eye" />
                    <div className="snake-eye" />
                    <div className="snake-tongue" />
                </div>
            )}
        </div>
    );
}

export default React.memo(Square);