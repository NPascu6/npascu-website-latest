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

const fruitEmojis = ["🍎", "🍌", "🍇", "🍓", "🍊", "🍍", "🥭", "🍑", "🍉", "🥝"];
const wallEmojis = ["🧱", "🥅", "💀", "☠️", "⛈️"];

const Square = ({ snake, food, obstacles, col, row, squareSize }: SquareProps) => {
    const isSnakeHead =
        snake.length > 0 && snake[0].x === col && snake[0].y === row;
    const isSnakeBody = snake.slice(1).some((s) => s.x === col && s.y === row);
    const isFood = food.some((f) => f.x === col && f.y === row);
    const isWall = obstacles.some((o) => o.x === col && o.y === row);
    const [fruitEmojy, setFruitEmojy] = useState<any>();
    const [wallEmojy, setWallEmojy] = useState<any>();

    useEffect(() => {
        const randomIndexWalls = Math.floor(Math.random() * wallEmojis.length);
        const randomIndex = Math.floor(Math.random() * fruitEmojis.length);
        setWallEmojy(wallEmojis[randomIndexWalls]);
        setFruitEmojy(fruitEmojis[randomIndex]);
    }, []);


    return (
        <div
            key={`${row}-${col}`}
            className={`shadow-xl relative rounded-full`}
            style={{
                width: squareSize,
                height: squareSize,
                transition: isSnakeHead ? 'none' : "background-color 0.1s ease-in-out"
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
                        fontSize: "1.3em",
                        borderRadius: "50%",
                        //background: "linear-gradient(45deg, #ff8c00, #ffebcd)",
                    }}
                    className="food-pattern"
                >
                    {fruitEmojy}
                </div>
            )}
            {isWall && (
                <div
                    style={{
                        width: squareSize,
                        height: squareSize,
                        border: "1px solid black",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "1.2em",
                        borderRadius: "5px", // Adjust the border radius as needed
                        // Add any additional styling for the wall emoji
                    }}
                    className="brick-pattern shadow-xl"
                >
                    {wallEmojy}
                </div>
            )}
            {isSnakeHead && (
                <div style={{
                    width: squareSize,
                    height: squareSize,
                    marginTop: "4px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <SnakeHeadIcon />
                </div>
            )}
            {isSnakeBody && (
                <div
                    style={{
                        width: squareSize,
                        height: squareSize,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "1em",
                    }}
                >
                    {/* Adjust the font size as needed */}
                    <span role="img" aria-label="snake-body" className="snake-body" />
                </div>)}
        </div>
    );
}

export default React.memo(Square);
