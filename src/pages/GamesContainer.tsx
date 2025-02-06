import React from "react";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import SnakeGame from "../pages/game/SnakeGame";
import ClickTheTarget from "../pages/game/ClickTheTarget";
import TicTacToeIcon from "../assets/icons/TicTacToe";
import SnakeIcon from "../assets/icons/Snake";
import ClickTheTargetIcon from "../assets/icons/ClickTheTargetIcon";
import CloseIcon from "../assets/icons/CloseIcon";
import TicTacToeGame from "../pages/game/TicTacToeGame";
import {useSelector} from "react-redux";
import {RootState} from "../store/store";

const GameCard: React.FC = () => {
    const nav = useNavigate();
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const gameLinks = [
        {to: "tic-tac-toe", label: "Tic Tac Toe", Icon: TicTacToeIcon},
        {to: "snake", label: "Snake", Icon: SnakeIcon},
        {
            to: "click-the-target",
            label: "Click The Target",
            Icon: ClickTheTargetIcon,
        },
    ];

    return (
        <div
            style={{
                height: "calc(100vh - 6rem)", overflow: "auto", backgroundColor: isDarkTheme ? "#1a1d24" : "#fff",
                color: isDarkTheme ? "#fff" : "#222"
            }}
            id="game-card"
            className="flex flex-col justify-start items-center"
        >
            <div className="flex justify-between w-full items-center p-2 border-b">
                <div>Demo browser games</div>
                <div onClick={() => nav(-1)} className="cursor-pointer">
                    <CloseIcon/>
                </div>
            </div>
            <div className="p-4 mt-4 flex flex-col gap-2 text-center w-3/4" style={{
                backgroundColor: isDarkTheme ? "#374151" : "#f3f4f6",
                color: isDarkTheme ? "#f3f4f6" : "#374151",
            }}>
                {gameLinks.map(({to, label, Icon}) => (
                    <Link
                        key={to}
                        to={to}
                        className="flex justify-between items-center border shadow-xl p-2 hover:bg-gray-400 hover:text-black transition-colors"
                    >
                        <h2 className="text-lg font-semibold">{label}</h2>
                        <div className="w-8 h-8">
                            <Icon/>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const GamesCardPage: React.FC = () => {
    return (
        <Routes>
            <Route index element={<GameCard/>}/>
            <Route path="tic-tac-toe" element={<TicTacToeGame/>}/>
            <Route path="snake" element={<SnakeGame/>}/>
            <Route path="click-the-target" element={<ClickTheTarget/>}/>
        </Routes>
    );
};

export default GamesCardPage;
