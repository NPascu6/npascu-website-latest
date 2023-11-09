import React, { useState, useEffect, useCallback } from 'react';

type SquareValue = 'X' | 'O' | null;

interface TicTacToeProps {
    boardSize: number;
    player1Symbol: SquareValue;
    player2Symbol: SquareValue;
    boardStyle: string;
    winner: SquareValue | null;
    isDraw: boolean;
    board: SquareValue[];
    currentPlayer: SquareValue;
    setBoard: React.Dispatch<React.SetStateAction<SquareValue[]>>;
    setCurrentPlayer: React.Dispatch<React.SetStateAction<SquareValue>>;
    handleReset: () => void;
}

interface GameStatisticsProps {
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

const GameStatistics: React.FC<GameStatisticsProps> = ({ player1Stats, player2Stats }) => (
    <div className=" p-4 shadow-lg rounded-md">
        <h2 className="text-xl font-bold mb-2">Game Statistics</h2>
        <div className="flex">
            <div className="border mr-1 p-2">
                <p>Player 1:</p>
                <p>Current Player: {player1Stats.currentPlayer}</p>
                <p>Wins: {player1Stats.wins}</p>
                <p>Draws: {player1Stats.draws}</p>
            </div>
            <div className="border ml-1 p-2">
                <p>Player 2:</p>
                <p>Current Player: {player2Stats.currentPlayer}</p>
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
    boardStyle,
    winner,
    isDraw,
    board,
    currentPlayer,
    setBoard,
    setCurrentPlayer,
    handleReset,
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

        const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
        setCurrentPlayer(nextPlayer);
    };

    const [diagonal1, setDiagonal1] = useState<number[]>([]);
    const [diagonal2, setDiagonal2] = useState<number[]>([]);

    useEffect(() => {
        const diagonal1 = Array.from({ length: boardSize }, (_, index) => index + index * boardSize);
        const diagonal2 = Array.from({ length: boardSize }, (_, index) => (index + 1) * (boardSize - 1));

        setDiagonal1(diagonal1);
        setDiagonal2(diagonal2);
    }, [boardSize, setDiagonal1, setDiagonal2])

    const checkWinner = useCallback((board: any, currentPlayer: any) => {
        // Check for the winner after the last action
        const lines: number[][] = [];
        for (let i = 0; i < boardSize; i++) {
            lines.push(Array.from({ length: boardSize }, (_, index) => i * boardSize + index));
            lines.push(Array.from({ length: boardSize }, (_, index) => i + index * boardSize));
        }

        lines.push(diagonal1);
        lines.push(diagonal2);

        for (const line of lines) {
            for (let i = 0; i <= line.length - 3; i++) {
                const row = line.slice(i, i + 3);
                const isWinningRow = row.every((index) => board[index] === currentPlayer);

                if (isWinningRow) {
                    alert(`Player ${currentPlayer} wins!`);
                    handleReset();
                    return;
                }
            }
        }

        const isWinningDiagonal1 = diagonal1.every((index) => board[index] === currentPlayer);
        const isWinningDiagonal2 = diagonal2.every((index) => board[index] === currentPlayer);

        if (isWinningDiagonal1 || isWinningDiagonal2) {
            alert(`Player ${currentPlayer} wins!`);
            handleReset();
            return;
        }

        if (board.every((square: any) => square !== null)) {
            alert("It's a draw!");
            handleReset();
        }
    }, [boardSize, handleReset, diagonal1, diagonal2]);

    return (
        <div className="flex flex-col">
            <div className={`grid ${boardStyle} shadow-lg mb-4`} style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)`, gap: '5px', padding: '2px' }}>
                {board.map((_: any, index: number) =>
                    <div
                        style={{ minHeight: '50px' }}
                        key={index}
                        className="h-full w-full min-h-full border border-gray-400 font-bold flex items-center justify-center focus:outline-none"
                        onClick={(e: any) => handleClick(e, index)}
                    >
                        {board[index]}
                    </div>)}
            </div>
            <button className="p-2 rounded bg-blue-500 text-white" onClick={handleReset}>
                Reset
            </button>
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
            handleReset();
            updateGameStats();
        } else if (isDraw) {
            alert("It's a draw!");
            handleReset();
            updateGameStats();
        }
    }, [winner, isDraw, currentPlayer, handleReset, updateGameStats]);

    useEffect(() => {
        setBoard(Array.from({ length: boardSize * boardSize }, () => null));
    }, [boardSize]);

    return (
        <div className=" items-center justify-center p-4" style={{ minHeight: "calc(100dvh - 5em)" }}>
            <h1 className="text-3xl font-bold mb-4">Tic Tac Toe</h1>
            <div className="max-w-md w-full">
                <div className="mb-4">
                    <label className="block text-sm font-medium">Select Board Size:</label>
                    <select
                        className="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md"
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
                <TicTacToe
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
                    boardStyle="border-2 border-gray-300 rounded-md"
                />
                <GameStatistics player1Stats={player1Stats} player2Stats={player2Stats} />
            </div>
        </div>
    );
};

export default TicTacToeContainer;
