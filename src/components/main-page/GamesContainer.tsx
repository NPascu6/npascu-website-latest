import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import GamePage from "../../pages/game/TicTacToeGame";
import SnakeGame from "../../pages/game/SnakeGame";
import SnakeIcon from "../../assets/icons/Snake";
import TicTacToeIcon from "../../assets/icons/TicTacToe";
import ClickTheTargetIcon from "../../assets/icons/ClickTheTargetIcon";
import ClickTheTarget from "../../pages/game/ClickTheTarget";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Dashboard from "../generator/Dashboard";

const GameCard = () => {
    const [isGamesActive, setIsGamesActive] = React.useState(true);
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const handleTabClick = () => {
        setIsGamesActive(!isGamesActive);
    };

    return (
        <div className="game-card shadow-xl">
            <div className="flex items-center justify-center">
                <div
                    className={`cursor-pointer px-4 py-2 border-b-2 ${!isGamesActive
                        ? `${isDarkTheme
                            ? "border-transparent bg-gray-800 text-white"
                            : "border-transparent bg-white text-black"
                        } font-bold opacity-50`
                        : `${isDarkTheme
                            ? "border-gray-600 bg-gray-700 text-white"
                            : "border-gray-300 bg-gray-100 text-black"
                        } font-semibold opacity-100`
                        }`}
                    onClick={() => handleTabClick()}
                >
                    Browser Games
                </div>
                <div
                    className={`cursor-pointer px-2 py-2 border-b-2 ${isGamesActive
                        ? `${isDarkTheme
                            ? "border-transparent bg-gray-800 text-white"
                            : "border-transparent bg-white text-black"
                        } font-bold opacity-50`
                        : `${isDarkTheme
                            ? "border-gray-600 bg-gray-700 text-white"
                            : "border-gray-300 bg-gray-100 text-black"
                        } font-semibold opacity-100`
                        }`}
                    onClick={() => handleTabClick()}
                >
                    Dynamic Components
                </div>
            </div>
            {isGamesActive ? (
                <div className="p-1 flex flex-col text-center items-center align-center">
                    <div className="w-full">
                        <Link
                            to="games/tic-tac-toe"
                            className="flex border shadow-xl p-2 hover:text-black"
                        >
                            <div className="flex align-center justify-between items-center">
                                <h2 className="">Tic Tac Toe</h2>
                                <div className="game-icons">
                                    <TicTacToeIcon />
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="mt-1 w-full">
                        <Link
                            to="games/snake"
                            className="flex border shadow-xl p-2 hover:text-black"
                        >
                            <div className=" flex align-center justify-between items-center">
                                <h2>Snake</h2>
                                <div className="game-icons">
                                    <SnakeIcon />
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="mt-1 w-full">
                        <Link
                            to="games/click-the-target"
                            className="flex border shadow-xl p-2 hover:text-black"
                        >
                            <div className=" flex align-center justify-between items-center">
                                <h2>Click The Target</h2>
                                <div className="game-icons">
                                    <ClickTheTargetIcon />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="p-1 flex md:flex-col text-center items-center align-center ">
                    <Dashboard />
                </div>
            )}
        </div>
    );
};

const GamesCardPage = () => {
    return (
        <div className="">
            <Routes>
                <Route path="*" element={<GameCard />} />
                <Route path="tic-tac-toe" element={<GamePage />} />
                <Route path="snake" element={<SnakeGame />} />
                <Route path="click-the-target" element={<ClickTheTarget />} />
            </Routes>
        </div>
    );
};

export default GamesCardPage;
