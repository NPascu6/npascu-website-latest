import React, {useCallback, useEffect, useRef, useState} from "react";
import useWindowSize from "../../hooks/useWindowSize";
import {useNavigate} from "react-router-dom";
import CloseIcon from "../../assets/icons/CloseIcon";

const CELL_SIZE = 16;
const BOARD_PADDING = 2 * CELL_SIZE;
const fruitEmojis = ["🍎", "🍌", "🍇", "🍊", "🍓", "🍍"];
const obstacleEmojis = ["🧱"];

enum Direction {
    Up,
    Down,
    Left,
    Right,
}

type Position = { x: number; y: number; emoji?: string };

type State = {
    boardSize: { innerWidth: number; innerHeight: number };
    snake: Position[];
    food: Position[];
    direction: Direction;
    speed: number;
    running: boolean;
    score: number;
    obstacles: Position[];
};

const SnakeGame: React.FC = () => {
    const {innerWidth, innerHeight} = useWindowSize();
    const boardRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const initialState: State = {
        boardSize: {innerWidth: 0, innerHeight: 0},
        score: 0,
        snake: [{x: 5, y: 5}],
        food: [{x: 10, y: 10, emoji: fruitEmojis[0]}],
        direction: Direction.Right,
        speed: 5,
        running: false,
        obstacles: [],
    };

    const [state, setState] = useState<State>(initialState);

    // Swipe Handling
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
        [state.direction]
    );

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!touchStartX.current || !touchStartY.current) return;

            const deltaX = e.touches[0].clientX - touchStartX.current;
            const deltaY = e.touches[0].clientY - touchStartY.current;
            const threshold = 10; // Adjust to avoid accidental swipes

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > threshold) handleSwipe(Direction.Right);
                if (deltaX < -threshold) handleSwipe(Direction.Left);
            } else {
                if (deltaY > threshold) handleSwipe(Direction.Down);
                if (deltaY < -threshold) handleSwipe(Direction.Up);
            }

            touchStartX.current = null;
            touchStartY.current = null;
        };

        const board = boardRef.current;
        if (board) {
            board.addEventListener("touchstart", handleTouchStart, {
                passive: false,
            });
            board.addEventListener("touchmove", handleTouchMove, {passive: false});
        }

        return () => {
            if (board) {
                board.removeEventListener("touchstart", handleTouchStart);
                board.removeEventListener("touchmove", handleTouchMove);
            }
        };
    }, [handleSwipe]);

    // Resize Board on Window Size Change
    useEffect(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const cellSize = CELL_SIZE;
        const boardWidth = Math.floor(
            (innerWidth - BOARD_PADDING) / (isMobile ? cellSize - 1 : cellSize)
        );
        const boardHeight = Math.floor(
            (innerHeight - BOARD_PADDING) / cellSize - 8
        );

        setState((prevState) => ({
            ...prevState,
            boardSize: {innerWidth: boardWidth, innerHeight: boardHeight},
        }));
    }, [innerWidth, innerHeight]);

    return (
        <div
            ref={boardRef}
            className="justify-center items-center flex flex-col"
            style={{touchAction: "none"}} // Prevent system gestures
        >
            <div className="flex flex-col justify-center items-center">
                <div className="flex justify-between w-full">
                    <div className="border p-1 bg-black border-gray-500 w-1/3 text-green-500">
                        Score: {state.score}
                    </div>
                    <div
                        onClick={() => navigate("/")}
                        className="flex cursor-pointer justify-end"
                    >
                        <CloseIcon/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SnakeGame;
