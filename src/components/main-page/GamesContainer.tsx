import React from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import TicTacToeGame from "../../pages/game/TicTacToeGame";
import SnakeGame from "../../pages/game/SnakeGame";
import ClickTheTarget from "../../pages/game/ClickTheTarget";
import TicTacToeIcon from "../../assets/icons/TicTacToe";
import SnakeIcon from "../../assets/icons/Snake";
import ClickTheTargetIcon from "../../assets/icons/ClickTheTargetIcon";
import CloseIcon from "../../assets/icons/CloseIcon";

const GameCard: React.FC = () => {
  // Game links array to avoid repetition
  const nav = useNavigate();
  const gameLinks = [
    { to: "games/tic-tac-toe", label: "Tic Tac Toe", Icon: TicTacToeIcon },
    { to: "games/snake", label: "Snake", Icon: SnakeIcon },
    {
      to: "games/click-the-target",
      label: "Click The Target",
      Icon: ClickTheTargetIcon,
    },
  ];

  return (
    <div
      id="game-card"
      className={`p-2 shadow-xl`}
      style={{ height: "-webkit-fill-available" }}
    >
      <div className="flex justify-between items-center p-2 border-b">
        <div>Demo browser games</div>
        <div onClick={() => nav("/")} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>
      <div className="p-2 flex flex-col gap-2 text-center">
        {gameLinks.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex justify-between items-center border shadow-xl p-2 hover:bg-gray-200 transition-colors"
          >
            <h2 className="text-lg font-semibold">{label}</h2>
            <div className="w-8 h-8">
              <Icon />
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
      <Route path="*" element={<GameCard />} />
      <Route path="tic-tac-toe" element={<TicTacToeGame />} />
      <Route path="snake" element={<SnakeGame />} />
      <Route path="click-the-target" element={<ClickTheTarget />} />
    </Routes>
  );
};

export default GamesCardPage;
