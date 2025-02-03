import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import TicTacToeGame from "../../pages/game/TicTacToeGame";
import SnakeGame from "../../pages/game/SnakeGame";
import ClickTheTarget from "../../pages/game/ClickTheTarget";
import TicTacToeIcon from "../../assets/icons/TicTacToe";
import SnakeIcon from "../../assets/icons/Snake";
import ClickTheTargetIcon from "../../assets/icons/ClickTheTargetIcon";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import FormList from "../generator/FormList";

const GameCard: React.FC = () => {
  // Use an explicit tab type
  const [activeTab, setActiveTab] = React.useState<"games" | "components">(
    "games"
  );
  const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

  // Helper function to build tab classes
  const tabClass = (tab: "games" | "components"): string => {
    const isActive = activeTab === tab;
    const base = "cursor-pointer px-4 py-2 border-b-2 transition-colors";
    return isActive
      ? `${base} ${
          isDarkTheme
            ? "border-gray-600 bg-gray-700 text-white font-bold opacity-100"
            : "border-gray-300 bg-gray-100 text-black font-bold opacity-100"
        }`
      : `${base} ${
          isDarkTheme
            ? "border-transparent bg-gray-800 text-white font-semibold opacity-50"
            : "border-transparent bg-white text-black font-semibold opacity-50"
        }`;
  };

  // Game links array to avoid repetition
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
    <div className="game-card shadow-xl rounded-md overflow-hidden">
      <div className="flex items-center justify-center">
        <div
          className={tabClass("games")}
          onClick={() => setActiveTab("games")}
        >
          Browser Games
        </div>
        <div
          className={tabClass("components")}
          onClick={() => setActiveTab("components")}
        >
          Dynamic Components
        </div>
      </div>
      {activeTab === "games" ? (
        <div className="p-4 flex flex-col gap-2 text-center">
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
      ) : (
        <div className="p-4">
          <FormList />
        </div>
      )}
    </div>
  );
};

const GamesCardPage: React.FC = () => {
  return (
    <div className="p-2">
      <Routes>
        <Route path="*" element={<GameCard />} />
        <Route path="tic-tac-toe" element={<TicTacToeGame />} />
        <Route path="snake" element={<SnakeGame />} />
        <Route path="click-the-target" element={<ClickTheTarget />} />
      </Routes>
    </div>
  );
};

export default GamesCardPage;
