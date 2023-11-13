import React, { useCallback } from "react";

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

    const getBackgroundColor = useCallback(() => {
        if (isSnakeHead) return "bg-green-400";
        if (isSnakeBody) return "bg-green-600";
        if (isFood) return "bg-orange-600";
        if (isWall) return "bg-gray-800";
        return "";
    }, [isSnakeHead, isSnakeBody, isFood, isWall]);

    return (
        <div
            key={`${row}-${col}`}
            className={`w-${squareSize} h-${squareSize} shadow-xl relative rounded-full ${getBackgroundColor()}`}
            style={{
                width: squareSize,
                height: squareSize,
                //add transition effect to mask redrawing of snake
                transition: isSnakeHead ? 'none' : "background-color 0.2s ease-in-out"
            }}
        >
            {isFood && (
                <div
                    style={{ width: "1.5em", height: "1.5em", display: "block" }}
                    className="rounded-full"
                >
                </div>
            )}
            {isWall && <div className="brick-pattern" />}

            {isSnakeHead && (
                <div className="snake-eyes" style={{ transition: 'none' }}>
                    <div className="snake-eye" />
                    <div className="snake-eye" />
                    <div className="snake-tongue" />
                </div>
            )}
        </div>
    );
}

export default React.memo(Square);
