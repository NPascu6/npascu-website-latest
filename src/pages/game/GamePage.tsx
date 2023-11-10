import React, { useState, useEffect, useCallback } from 'react';

type SquareValue = 'X' | 'O' | null;

interface TicTacToeProps {
    boardSize: number;
    player1Symbol: SquareValue;
    player2Symbol: SquareValue;
    winner: SquareValue | null;
    isDraw: boolean;
    board: SquareValue[];
    currentPlayer: SquareValue;
    setBoard: React.Dispatch<React.SetStateAction<SquareValue[]>>;
    setCurrentPlayer: React.Dispatch<React.SetStateAction<SquareValue>>;
    handleReset: () => void;
    setWinner: React.Dispatch<React.SetStateAction<SquareValue | null>>;
    setIsDraw: React.Dispatch<React.SetStateAction<boolean>>;
}

interface GameStatisticsProps {
    currentPlayer: string;
    player1Stats: {
        currentPlayer: string;
        wins: number;
        draws: number;
    };
    player2Stats: {
        currentPlayer: string;
        wins: number;
        draws: number;
    };
}

const GameStatistics: React.FC<GameStatisticsProps> = ({ player1Stats, player2Stats, currentPlayer }) => (
    <div className="text-center p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-2">Game Statistics</h2>
        <div className="flex justify-center">
            <div className="border mr-1 p-2">
                <p>Player 1:</p>
                <p className={`${currentPlayer === player1Stats.currentPlayer ? "font-bold" : ""}`}>Current Player: {player1Stats.currentPlayer}</p>
                <p>Wins: {player1Stats.wins}</p>
                <p>Draws: {player1Stats.draws}</p>
            </div>
            <div className="border ml-1 p-2">
                <p>Player 2:</p>
                <p className={`${currentPlayer === player2Stats.currentPlayer ? "font-bold" : ""}`}>Current Player: {player2Stats.currentPlayer}</p>
                <p>Wins: {player2Stats.wins}</p>
                <p>Draws: {player2Stats.draws}</p>
            </div>
        </div>
    </div>
);

const TicTacToe: React.FC<TicTacToeProps> = ({
    boardSize,
    player1Symbol,
    player2Symbol,
    winner,
    isDraw,
    board,
    currentPlayer,
    setBoard,
    setCurrentPlayer,
    handleReset,
    setWinner,
    setIsDraw
}) => {

    const handleClick = (e: any, index: number): void => {
        e.preventDefault();
        e.stopPropagation();
        if (board[index] || winner || isDraw) {
            return;
        }

        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        // Check for the winner after setting the board
        checkWinner(newBoard, currentPlayer);
    };

    const checkWinner = useCallback((board: any, currentPlayer: any) => {
        const isWinningSequence = (sequence: number[]) =>
            sequence.every((index) => board[index] === currentPlayer);

        const checkSequence = (sequence: number[], winningLength: number) => {
            if (sequence.length < winningLength) {
                return false; // Not enough elements to form a winning sequence
            }

            for (let i = 0; i <= sequence.length - winningLength; i++) {
                const subsequence = sequence.slice(i, i + winningLength);
                if (isWinningSequence(subsequence)) {
                    setWinner(currentPlayer);
                    return true;
                }
            }
            return false;
        };

        // Check rows and columns
        for (let i = 0; i < boardSize; i++) {
            const row = Array.from({ length: boardSize }, (_, index) => i * boardSize + index);
            const column = Array.from({ length: boardSize }, (_, index) => i + index * boardSize);

            if (checkSequence(row, 3) || checkSequence(column, 3)) {
                return;
            }
        }

        // Check main diagonals
        const mainDiagonal = Array.from({ length: boardSize }, (_, index) => index * (boardSize + 1));
        const antiDiagonal = Array.from({ length: boardSize }, (_, index) => (index + 1) * (boardSize - 1));

        if (checkSequence(mainDiagonal, 3) || checkSequence(antiDiagonal, 3)) {
            return;
        }

        // Check additional diagonals in both directions
        for (let i = 0; i < boardSize; i++) {
            // Top-left to bottom-right
            const diagonal1 = Array.from({ length: boardSize - i }, (_, index) => (i + index) * (boardSize + 1));

            // Top-right to bottom-left
            const diagonal2 = Array.from({ length: boardSize - i }, (_, index) => (i + index + 1) * (boardSize - 1));

            if (checkSequence(diagonal1, 3) || checkSequence(diagonal2, 3)) {
                return;
            }
        }

        // Check additional diagonals in both directions for larger matrices
        for (let i = 0; i <= boardSize - 3; i++) {
            const additionalDiagonals: number[][] = [];

            // Top-left to bottom-right
            additionalDiagonals.push(Array.from({ length: boardSize - i }, (_, index) => (i + index) * (boardSize + 1)));

            // Top-right to bottom-left
            additionalDiagonals.push(Array.from({ length: boardSize - i }, (_, index) => (i + index) * (boardSize - 1)));

            for (const diagonal of additionalDiagonals) {
                if (checkSequence(diagonal, 3)) {
                    return;
                }
            }
        }

        // Check for a draw
        if (board.every((square: any) => square !== null)) {
            setIsDraw(true);
            return;
        }

        // Switch to the next player
        const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
        setCurrentPlayer(nextPlayer);
    }, [boardSize, setIsDraw, setCurrentPlayer, setWinner]);


    return (
        <div className="flex flex-col mt-4">
            <div className={`grid shadow-lg mb-4`} style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)`, gap: '5px', padding: '2px' }}>
                {board.map((_: any, index: number) =>
                    <div
                        style={{ minHeight: '60px' }}
                        key={index}
                        className="h-full w-full min-h-full border border-gray-400 font-bold flex items-center justify-center focus:outline-none"
                        onClick={(e: any) => handleClick(e, index)}
                    >
                        {board[index]}
                    </div>)}
            </div>
        </div>
    );
};

const TicTacToeContainer: React.FC = () => {
    const [boardSize, setBoardSize] = useState(3);
    const initialBoard: SquareValue[] = Array.from({ length: boardSize * boardSize }, () => null);
    const [board, setBoard] = useState<SquareValue[]>(initialBoard);
    const [winner, setWinner] = useState<SquareValue | null>(null);
    const [isDraw, setIsDraw] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState<SquareValue>('X');
    const [gameStats, setGameStats] = useState({ currentPlayer: 'X', wins: 0, draws: 0 });
    const [player1Stats, setPlayer1Stats] = useState({ currentPlayer: 'X', wins: 0, draws: 0 });
    const [player2Stats, setPlayer2Stats] = useState({ currentPlayer: 'O', wins: 0, draws: 0 });

    const handleReset = useCallback(() => {
        setBoard(initialBoard);
        setCurrentPlayer('X');
        setWinner(null);
        setIsDraw(false);
    }, [initialBoard]);

    const updateGameStats = useCallback(() => {
        if (!currentPlayer) return;

        if (currentPlayer === 'X') {
            setPlayer1Stats({ currentPlayer, wins: player1Stats.wins + 1, draws: player1Stats.draws });
            setGameStats({ currentPlayer, wins: player1Stats.wins + 1, draws: gameStats.draws });
        } else {
            setPlayer2Stats({ currentPlayer, wins: player2Stats.wins + 1, draws: player2Stats.draws });
            setGameStats({ currentPlayer, wins: player2Stats.wins + 1, draws: gameStats.draws });
        }
    }, [currentPlayer, player1Stats, player2Stats, gameStats]);

    useEffect(() => {
        if (winner) {
            alert(`Player ${currentPlayer} wins!`);
            updateGameStats();
            handleReset();

        } else if (isDraw) {
            alert("It's a draw!");
            updateGameStats();
            handleReset();
        }
    }, [winner, isDraw, currentPlayer, handleReset, updateGameStats]);

    useEffect(() => {
        setBoard(Array.from({ length: boardSize * boardSize }, () => null));
    }, [boardSize]);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto rounded-lg shadow-xl">
                <div className="p-4 md:p-8 text-center">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">Tic Tac Toe</h1>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Select Board Size:</label>
                        <select
                            className="mt-1 block w-full p-2 text-black border border-gray-300"
                            onChange={(e) => {
                                const newSize = parseInt(e.target.value, 10);
                                setGameStats({ currentPlayer: 'X', wins: 0, draws: 0 });
                                setBoardSize(newSize);
                                handleReset();
                            }}
                        >
                            <option value="3">3x3</option>
                            <option value="4">4x4</option>
                            <option value="5">5x5</option>
                        </select>
                    </div>
                    <div>
                        {currentPlayer && (
                            <GameStatistics
                                currentPlayer={currentPlayer}
                                player1Stats={player1Stats}
                                player2Stats={player2Stats}
                            />
                        )}
                    </div>
                    <div>
                        <TicTacToe
                            setIsDraw={setIsDraw}
                            setWinner={setWinner}
                            handleReset={handleReset}
                            setCurrentPlayer={setCurrentPlayer}
                            setBoard={setBoard}
                            currentPlayer={currentPlayer}
                            board={board}
                            isDraw={isDraw}
                            winner={winner}
                            boardSize={boardSize}
                            player1Symbol="X"
                            player2Symbol="O"
                        />
                    </div>
                    <div className="flex justify-center mt-4">
                        <button className="p-2 bg-blue-500 text-white" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default TicTacToeContainer;
