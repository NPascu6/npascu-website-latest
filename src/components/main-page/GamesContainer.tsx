import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import GamePage from '../../pages/game/TicTacToeGame';
import SnakeGame from '../../pages/game/SnakeGame';
import SnakeIcon from '../../assets/icons/Snake';
import TicTacToeIcon from '../../assets/icons/TicTacToe';
import ClickTheTargetIcon from '../../assets/icons/ClickTheTargetIcon';
import ClickTheTarget from '../../pages/game/ClickTheTarget';
// import BrickOutGame from './BrickoutGame';

const GameCard = () => {
    return (
        <div className="game-card shadow-xl">
            <h2>Sample Browser Games</h2>
            <h4>Created with JS/TS and CSS</h4>
            <div className="p-1 flex flex-col button-container text-center items-center align-center ">
                <div className='w-full'>
                    <Link to="games/tic-tac-toe" className="flex items-center text-center game-button border shadow-xl p-10 m-8 w-full mt-4 hover:text-black">
                        <div className="flex align-center justify-between items-center">
                            <h2 className=''>Tic Tac Toe</h2>
                            <div className="game-icons">
                                <TicTacToeIcon />
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="mt-1 w-full">
                    <Link to="games/snake" className="flex items-center text-center game-button border shadow-xl p-10 m-8 w-full mt-4 hover:text-black">
                        <div className=" flex align-center justify-between items-center">
                            <h2>Snake</h2>
                            <div className="game-icons">
                                <SnakeIcon />
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="mt-1 w-full">
                    <Link to="games/click-the-target" className="flex items-center text-center game-button border shadow-xl p-10 m-8 w-full mt-4 hover:text-black">
                        <div className=" flex align-center justify-between items-center">
                            <h2>Click The Target</h2>
                            <div className="game-icons">
                                <ClickTheTargetIcon />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const GamesCardPage = () => {
    return (
        <div className="">
            <Routes>
                {/* Parent route renders GamesCardPage component */}
                <Route path="/*" element={<GameCard />} />
                {/* Child routes */}
                <Route path="tic-tac-toe" element={<GamePage />} />
                <Route path="snake" element={<SnakeGame />} />
                <Route path="click-the-target" element={<ClickTheTarget />} />
                {/* <Route path="brick-out" element={<BrickOutGame />} /> */}
                {/* Add other nested routes as needed */}
            </Routes>
        </div>
    );
};

export default GamesCardPage;
