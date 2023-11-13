import React, { useState, useEffect, useCallback } from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import TicTacToeIcon from '../../assets/icons/TicTacToe';

type SquareValue = 'X' | 'O' | null;

interface TicTacToeProps {
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
    setResetButtonPresent?: React.Dispatch<React.SetStateAction<boolean>>;
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
    <div className="text-center shadow-xl">
        <h2 className="text-xl font-bold mb-2">Game Statistics</h2>
        <div className="flex justify-center">
            <div className="border mr-1 p-1" style={{ width: '11em' }}>
                <p>Player 1:</p>
                <p className={`${currentPlayer === player1Stats.currentPlayer ? "font-bold" : ""}`}>Current Player: {player1Stats.currentPlayer}</p>
                <p>Wins: {player1Stats.wins}</p>
                <p>Draws: {player1Stats.draws}</p>
            </div>
            <div className="border ml-1 p-1" style={{ width: '11em' }}>
                <p>Player 2:</p>
                <p className={`${currentPlayer === player2Stats.currentPlayer ? "font-bold" : ""}`}>Current Player: {player2Stats.currentPlayer}</p>
                <p>Wins: {player2Stats.wins}</p>
                <p>Draws: {player2Stats.draws}</p>
            </div>
        </div>
    </div>
);

const TicTacToe: React.FC<TicTacToeProps> = ({
    player1Symbol,
    player2Symbol,
    winner,
    isDraw,
    board,
    currentPlayer,
    setBoard,
    setCurrentPlayer,
    setResetButtonPresent,
    setWinner,
    setIsDraw
}) => {

    const handleClick = (e: any, index: number): void => {
        e.preventDefault();
        e.stopPropagation();

        setResetButtonPresent && setResetButtonPresent(true);

        if (board[index] || winner || isDraw) {
            return;
        }

        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        // Check for the winner after setting the board
        checkWinner(newBoard, currentPlayer);

    };

    const checkWinner = (board: SquareValue[], currentPlayer: SquareValue, winningCondition: number = 3) => {
        const boardSize = Math.sqrt(board.length);

        const isWinningSequence = (sequence: number[]) =>
            sequence.every((index) => board[index] === currentPlayer);

        const checkSequence = (sequence: number[]) => {
            if (sequence.length < winningCondition) {
                return false; // Not enough elements to form a winning sequence
            }

            for (let i = 0; i <= sequence.length - winningCondition; i++) {
                const subsequence = sequence.slice(i, i + winningCondition);
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

            if (checkSequence(row) || checkSequence(column)) {
                return true;
            }
        }

        // Check main diagonal
        const mainDiagonal = Array.from({ length: boardSize }, (_, index) => index * (boardSize + 1));
        if (checkSequence(mainDiagonal)) {
            return true;
        }

        // Check secondary diagonal
        const secondaryDiagonal = Array.from({ length: boardSize }, (_, index) => index * (boardSize - 1) + (boardSize - 1));
        if (checkSequence(secondaryDiagonal)) {
            return true;
        }

        // Check additional diagonals in both directions
        const checkAdditionalDiagonals = (startRow: any, startCol: any, rowIncrement: any, colIncrement: any) => {
            const additionalDiagonal = Array.from(
                { length: winningCondition },
                (_, index) => (startRow + index * rowIncrement) * boardSize + (startCol + index * colIncrement)
            );

            return checkSequence(additionalDiagonal);
        };

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                // Check additional diagonals in both directions
                if (i <= boardSize - winningCondition) {
                    // Check diagonals from left to right
                    if (j <= boardSize - winningCondition) {
                        if (checkAdditionalDiagonals(i, j, 1, 1)) {
                            return true;
                        }
                    }

                    // Check diagonals from right to left
                    if (j >= winningCondition - 1) {
                        if (checkAdditionalDiagonals(i, j, 1, -1)) {
                            return true;
                        }
                    }
                }

                // Check diagonals from top to bottom
                if (j <= boardSize - winningCondition) {
                    if (checkAdditionalDiagonals(i, j, 1, 0)) {
                        return true;
                    }
                }
            }
        }
        const nextPlayer = currentPlayer === player1Symbol ? player2Symbol : player1Symbol;
        setCurrentPlayer(nextPlayer);

        if (board.every((square) => square !== null)) {
            setIsDraw(true);
        }

        return false;
    };

    return <>
        {board.map((_: any, index: number) =>
            <div
                key={index}
                className="border border-gray-400 font-bold flex items-center justify-center focus:outline-none overflow-hidden"
                style={{ height: '100%' }}
                onClick={(e: any) => handleClick(e, index)}
            >
                {board[index] && <span style={{ margin: '-1em' }}> {board[index]}</span>}
            </div>
        )}
    </>
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
    const windowSize = useWindowSize();
    const [resetButtonPresent, setResetButtonPresent] = useState(false);

    const handleReset = useCallback(() => {
        setBoard(initialBoard);
        setCurrentPlayer('X');
        setWinner(null);
        setIsDraw(false);
    }, [initialBoard]);

    const updateGameStats = useCallback(() => {
        if (!currentPlayer) return;

        if (isDraw) return setGameStats({ currentPlayer, wins: gameStats.wins, draws: gameStats.draws + 1 });
        if (currentPlayer === 'X') {
            setPlayer1Stats({ currentPlayer, wins: player1Stats.wins + 1, draws: player1Stats.draws });
            setGameStats({ currentPlayer, wins: player1Stats.wins + 1, draws: gameStats.draws });
        } else {
            setPlayer2Stats({ currentPlayer, wins: player2Stats.wins + 1, draws: player2Stats.draws });
            setGameStats({ currentPlayer, wins: player2Stats.wins + 1, draws: gameStats.draws });
        }
    }, [currentPlayer, player1Stats, player2Stats, gameStats, isDraw]);

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

    const getHeight = useCallback(() => {
        return windowSize.innerHeight - 455;
    }, [windowSize]);

    return (
        <div className="container mx-auto p-2 md:p-4">
            <div className="shadow-xl flex flex-col">
                <div className="p-1 text-center">
                    <h1 className="text-green text-xl md:text-md lg:text-lg font-bold mb-1">Tic Tac Toe</h1>
                    <div className="flex justify-center">
                        <TicTacToeIcon />
                    </div>
                    <div className="m-2">
                        <select
                            className="mt-1 text-sm block w-full p-2 text-black border border-gray-300"
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
                            <option value="6">6x6</option>
                            <option value="7">7x7</option>
                            <option value="8">8x8</option>
                        </select>
                    </div>
                    {currentPlayer && (
                        <GameStatistics
                            currentPlayer={currentPlayer}
                            player1Stats={player1Stats}
                            player2Stats={player2Stats}
                        />
                    )}
                </div>
                <div className="p-2 text-center">
                    <div className="grid shadow-lg mb-2 min-h-max" style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)`, gap: '2px', height: getHeight() }}>
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
                            player1Symbol="X"
                            player2Symbol="O"
                            setResetButtonPresent={setResetButtonPresent}
                        />
                    </div>
                </div>
                {resetButtonPresent && <div className="flex justify-center mt-2 mb-2">
                    <button className="p-2 border-2 font-bold" onClick={handleReset}>
                        Reset
                    </button>
                </div>}
            </div>
        </div>
    );

};

export default TicTacToeContainer;
