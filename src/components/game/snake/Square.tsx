import React, { useEffect, useState } from "react";
import SnakeHeadIcon from '../../../assets/icons/Snake2'

interface SquareProps {
    snake: { x: number; y: number }[];
    food: { x: number; y: number }[];
    obstacles: { x: number; y: number }[];
    col: number;
    row: number;
    squareSize: number;
}

const fruitEmojis = ["🍎", "🍌", "🍇", "🍓", "🍊", "🍍", "🥭", "🍑", "🍉"];
const wallEmojis = ["💀", "☠️"];

const getRandomEmoji = (emojis: string[]) => emojis[Math.floor(Math.random() * emojis.length)];

const Square = ({ snake, food, obstacles, col, row, squareSize }: SquareProps) => {
    const isSnakeHead =
        snake.length > 0 && snake[0].x === col && snake[0].y === row;
    const isSnakeBody = snake.slice(1).some((s) => s.x === col && s.y === row);
    const isFood = food.some((f) => f.x === col && f.y === row);
    const isWall = obstacles.some((o) => o.x === col && o.y === row);
    const [fruitEmoji, setFruitEmoji] = useState<string | null>(null);
    const [wallEmoji, setWallEmoji] = useState<string | null>(null);

    useEffect(() => {
        setWallEmoji(getRandomEmoji(wallEmojis));
        setFruitEmoji(getRandomEmoji(fruitEmojis));
    }, []); // Empty dependency array so that this only runs once

    return (
        <div
            key={`${row}-${col}`}
            className={`flex items-center justify-center shadow-xl relative rounded-full`}
            style={{
                width: squareSize,
                height: squareSize,
                opacity: isSnakeBody ? 0.7 : 1,
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
                        width: squareSize,
                        height: squareSize,
                        fontSize: "1.2em",
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


