import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import GamePage from './TicTacToeGame';

const GameCard = () => {
    return (
        <div className="game-card">
            <h2>Game Card</h2>
            <div className="button-container">
                <Link to="tic-tac-toe" className="game-button">
                    Tic Tac Toe
                </Link>
                {/* Add other game buttons as needed */}
            </div>
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
                {/* Add other nested routes as needed */}
            </Routes>
        </div>
    );
};

export default GamesCardPage;
