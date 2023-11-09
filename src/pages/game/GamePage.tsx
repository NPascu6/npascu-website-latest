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
    boardStyle,
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

    const [diagonal1, setDiagonal1] = useState<number[]>([]);
    const [diagonal2, setDiagonal2] = useState<number[]>([]);
    const [lines, setLines] = useState<number[][]>([]);

    useEffect(() => {
        const lines: number[][] = [];
        for (let i = 0; i < boardSize; i++) {
            lines.push(Array.from({ length: boardSize }, (_, index) => i * boardSize + index));
            lines.push(Array.from({ length: boardSize }, (_, index) => i + index * boardSize));
        }

        setLines(lines);
    }, [boardSize])

    useEffect(() => {
        const diagonal1 = Array.from({ length: boardSize }, (_, index) => index + index * boardSize);
        const diagonal2 = Array.from({ length: boardSize }, (_, index) => (index + 1) * (boardSize - 1));

        setDiagonal1(diagonal1);
        setDiagonal2(diagonal2);

        // Additional diagonals for larger board sizes
        for (let i = 1; i <= boardSize - 3; i++) {
            diagonal1.push(i * (boardSize + 1)); // Add diagonal from top-left to bottom-right
            diagonal2.push((i + 1) * (boardSize - 1)); // Add diagonal from top-right to bottom-left
        }
    }, [boardSize, setDiagonal1, setDiagonal2]);

    const checkWinner = useCallback((board: any, currentPlayer: any) => {
        for (const line of lines) {
            for (let i = 0; i <= line.length - 3; i++) {
                const row = line.slice(i, i + 3);
                const isWinningRow = row.every((index) => board[index] === currentPlayer);

                if (isWinningRow) {
                    setWinner(currentPlayer);
                    return;
                }
            }
        }

        const isWinningDiagonal1 = diagonal1.slice(0, 3).every((index) => board[index] === currentPlayer);
        const isWinningDiagonal2 = diagonal2.slice(0, 3).every((index) => board[index] === currentPlayer);

        if (isWinningDiagonal1 || isWinningDiagonal2) {
            setWinner(currentPlayer);
            return;
        }

        // Check additional diagonals for larger board sizes
        if (boardSize > 3) {
            for (let i = 0; i <= boardSize - 3; i++) {
                const additionalDiagonal1 = Array.from({ length: 3 }, (_, index) => i * (boardSize + 1) + index);
                const additionalDiagonal2 = Array.from({ length: 3 }, (_, index) => (i + 1) * (boardSize - 1) - index);

                const isWinningAdditionalDiagonal1 = additionalDiagonal1.every((index) => board[index] === currentPlayer);
                const isWinningAdditionalDiagonal2 = additionalDiagonal2.every((index) => board[index] === currentPlayer);

                if (isWinningAdditionalDiagonal1 || isWinningAdditionalDiagonal2) {
                    setWinner(currentPlayer);
                    return;
                }
            }
        }

        if (board.every((square: any) => square !== null)) {
            alert("It's a draw!");
            handleReset();
            return;
        }

        const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
        setCurrentPlayer(nextPlayer);
    }, [diagonal1, diagonal2, lines, boardSize, handleReset, setCurrentPlayer, setWinner]);



    return (
        <div className="flex flex-col">
            <div className={`grid ${boardStyle} shadow-lg mb-4`} style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)`, gap: '5px', padding: '2px' }}>
                {board.map((_: any, index: number) =>
                    <div
                        style={{ minHeight: '40px' }}
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
        <div className="flex flex-col items-center justify-center p-4 align-center">
            <h1 className="text-xl font-bold mb-4">Tic Tac Toe</h1>
            <div className="w-full flex flex-col">
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
                <div className='min-w-full min-h-full'>
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
                        boardStyle="border-2 border-gray-300"
                    />
                </div>
                <div className='min-w-full min-h-full'>
                    {currentPlayer &&
                        <GameStatistics currentPlayer={currentPlayer} player1Stats={player1Stats} player2Stats={player2Stats} />}
                </div>

            </div>
        </div>
    );
};

export default TicTacToeContainer;
