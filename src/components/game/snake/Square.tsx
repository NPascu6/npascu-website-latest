import React from "react";

interface SquareProps {
    food: { x: number; y: number }[];
    col: number;
    row: number;
    squareSize: number;
    fruitEmoji: string;
    wallEmoji: string;
    HeadIcon: any;
    isWall: boolean;
    isFood: boolean;
    isSnakeHead: boolean;
    isSnakeBody: boolean;
}

const Square = ({
    isWall,
    isFood,
    isSnakeHead,
    isSnakeBody,
    col,
    row,
    squareSize,
    fruitEmoji,
    wallEmoji,
    HeadIcon,
}: SquareProps) => {
    const getBorderRadius = () => (isSnakeHead ? "50%" : "5px");
    const getFontSize = () => (isSnakeHead ? "1.4em" : "1.2em");
    const getBorder = () => (isWall ? "1px solid transparent" : "none");

    const dynamicStyles = {
        width: squareSize,
        height: squareSize,
        borderRadius: getBorderRadius(),
        fontSize: getFontSize(),
        border: getBorder(),
    };

    const dynamicClass = isWall ? "brick-pattern" : isFood ? "food-pattern" : "";

    return (
        <div
            key={`${row}-${col}`}
            className={`flex items-center justify-center shadow-xl relative rounded-full ${dynamicClass}`}
            style={dynamicStyles}
        >
            {isFood && fruitEmoji}
            {isWall && wallEmoji}
            {isSnakeHead && <HeadIcon />}
            {isSnakeBody && <div className="snake-body"></div>}
        </div>
    );
};

export default React.memo(Square);
