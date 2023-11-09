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
    setWinner
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

        // Check rows and columns
        for (let i = 0; i < boardSize; i++) {
            const row = Array.from({ length: boardSize }, (_, index) => i * boardSize + index);
            const column = Array.from({ length: boardSize }, (_, index) => i + index * boardSize);

            if (isWinningSequence(row) || isWinningSequence(column)) {
                setWinner(currentPlayer);
                return;
            }
        }

        // Check main diagonals
        const mainDiagonal = Array.from({ length: boardSize }, (_, index) => index * (boardSize + 1));
        const antiDiagonal = Array.from({ length: boardSize }, (_, index) => (index + 1) * (boardSize - 1));

        if (isWinningSequence(mainDiagonal) || isWinningSequence(antiDiagonal)) {
            setWinner(currentPlayer);
            return;
        }

        // Check additional diagonals, rows, and columns for larger board sizes
        if (boardSize > 3) {
            for (let i = 0; i <= boardSize - 3; i++) {
                const additionalDiagonal1 = Array.from({ length: boardSize }, (_, index) => i * (boardSize + 1) + index);
                const additionalDiagonal2 = Array.from({ length: boardSize }, (_, index) => (i + 1) * (boardSize - 1) - index);
                const additionalRow = Array.from({ length: boardSize }, (_, index) => i * boardSize + index);
                const additionalColumn = Array.from({ length: boardSize }, (_, index) => i + index * boardSize);

                if (
                    isWinningSequence(additionalDiagonal1) ||
                    isWinningSequence(additionalDiagonal2) ||
                    isWinningSequence(additionalRow) ||
                    isWinningSequence(additionalColumn)
                ) {
                    setWinner(currentPlayer);
                    return;
                }
            }
        }

        // Check for a draw
        if (board.every((square: any) => square !== null)) {
            alert("It's a draw!");
            handleReset();
            return;
        }

        // Switch to the next player
        const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
        setCurrentPlayer(nextPlayer);
    }, [boardSize, handleReset, setCurrentPlayer, setWinner]);

    return (
        <div className="flex flex-col">
            <div className={`grid shadow-lg mb-4`} style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)`, gap: '5px', padding: '2px' }}>
                {board.map((_: any, index: number) =>
                    <div
                        style={{ minHeight: '40px' }}
                        // key={index}
                        className="h-full w-full min-h-full border border-gray-400 font-bold flex items-center justify-center focus:outline-none"
                        onClick={(e: any) => handleClick(e, index)}
                    >
                        {board[index]}
                    </div>)}
            </div>
            <div className='items-center flex w-full justify-center'>
                <button className="p-2 bg-blue-500 text-white" onClick={handleReset}>
                    Reset
                </button>
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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full flex flex-col text-center">
                <h1 className="text-xl font-bold mb-4">Tic Tac Toe</h1>
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
                <div >
                    {currentPlayer &&
                        <GameStatistics currentPlayer={currentPlayer} player1Stats={player1Stats} player2Stats={player2Stats} />}
                </div>
                <div>
                    <TicTacToe
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
            </div>
        </div>
    );
};

export default TicTacToeContainer;
