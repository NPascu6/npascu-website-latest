import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import GamePage from './TicTacToeGame';
import SnakeGame from './SnakeGame';
import SnakeIcon from '../../assets/icons/Snake';
import TicTacToeIcon from '../../assets/icons/TicTacToe';

const GameCard = () => {
    return (
        <div className="game-card shadow-xl m-4">
            <h2>Games</h2>
            <div className="p-4 flex flex-col button-container text-center items-center align-center">
                <Link to="tic-tac-toe" className="game-button border shadow-xl p-10 m-8 w-full">
                    <div className="flex align-center justify-between items-center">
                        <h2 className='mr-4'>Tic Tac Toe</h2>
                        <div className="game-icons">
                            <TicTacToeIcon />
                        </div>
                    </div>
                </Link>
                <Link to="snake" className="flex items-center text-center game-button border shadow-xl p-10 m-8 w-full">
                    <div className=" flex align-center justify-between items-center">
                        <h2>Snake</h2>
                        <div className="game-icons">
                            <SnakeIcon />
                        </div>
                    </div>
                </Link>
            </div>
            <Link to="/" className="back-button">
                Back to Main
            </Link>
        </div>
    );
};

const GamesCardPage = () => {
    return (
        <div className="games-card-page">
            <Routes>
                {/* Parent route renders GamesCardPage component */}
                <Route path="/*" element={<GameCard />} />
                {/* Child routes */}
                <Route path="tic-tac-toe" element={<GamePage />} />
                <Route path="snake" element={<SnakeGame />} />
                {/* Add other nested routes as needed */}
            </Routes>
        </div>
    );
};

export default GamesCardPage;
