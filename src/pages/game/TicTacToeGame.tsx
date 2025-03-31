import React, {useCallback, useEffect, useState} from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import {useNavigate} from 'react-router-dom';
import CloseIcon from '../../assets/icons/CloseIcon';

type SquareValue = 'X' | 'O' | null;

interface TicTacToeProps {
    startGame: boolean;
    setStartGame: React.Dispatch<React.SetStateAction<boolean>>;
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
    startGame: boolean;
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

const GameStatistics: React.FC<GameStatisticsProps> = ({player1Stats, player2Stats, currentPlayer, startGame}) => (
    <div className="text-center shadow-xl mb-2">
        <div className="flex justify-between">
            <div className="border mr-1 p-1" style={{width: '14em'}}>
                {!startGame && <p>Player 1: </p>}
                <p style={{color: currentPlayer === player1Stats.currentPlayer ? 'green' : 'gray'}}
                   className={`${currentPlayer === player1Stats.currentPlayer ? "font-bold" : ""}`}>Current
                    Player: {player1Stats.currentPlayer}</p>
                {!startGame && <p>Wins: {player1Stats.wins}</p>}
                {!startGame && <p>Draws: {player1Stats.draws}</p>}
            </div>
            <div className="border ml-1 p-1" style={{width: '14em'}}>
                {!startGame && <p>Player 2:</p>}
                <p style={{color: currentPlayer === player2Stats.currentPlayer ? 'green' : 'gray'}}
                   className={`${currentPlayer === player2Stats.currentPlayer ? "font-bold" : ""}`}>Current
                    Player: {player2Stats.currentPlayer}</p>
                {!startGame && <p>Wins: {player2Stats.wins}</p>}
                {!startGame && <p>Draws: {player2Stats.draws}</p>}
            </div>
        </div>
    </div>
);

const TicTacToe: React.FC<TicTacToeProps> = ({
                                                 startGame,
                                                 setStartGame,
                                                 player1Symbol,
                                                 player2Symbol,
                                                 winner,
                                                 isDraw,
                                                 board,
                                                 currentPlayer,
                                                 setBoard,
                                                 setCurrentPlayer,
                                                 setWinner,
                                                 setIsDraw
                                             }) => {

    const handleClick = (e: any, index: number): void => {
        e.preventDefault();
        e.stopPropagation();
        setStartGame(true);

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
                    setStartGame(false);
                    return true;
                }
            }
            return false;
        };

        // Check rows and columns
        for (let i = 0; i < boardSize; i++) {
            const row = Array.from({length: boardSize}, (_, index) => i * boardSize + index);
            const column = Array.from({length: boardSize}, (_, index) => i + index * boardSize);

            if (checkSequence(row) || checkSequence(column)) {
                setStartGame(false);

                return true;
            }
        }

        // Check main diagonal
        const mainDiagonal = Array.from({length: boardSize}, (_, index) => index * (boardSize + 1));
        if (checkSequence(mainDiagonal)) {
            setStartGame(false);

            return true;
        }

        // Check secondary diagonal
        const secondaryDiagonal = Array.from({length: boardSize}, (_, index) => index * (boardSize - 1) + (boardSize - 1));
        if (checkSequence(secondaryDiagonal)) {
            setStartGame(false);

            return true;
        }

        // Check additional diagonals in both directions
        const checkAdditionalDiagonals = (startRow: any, startCol: any, rowIncrement: any, colIncrement: any) => {
            const additionalDiagonal = Array.from(
                {length: winningCondition},
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
                            setStartGame(false);

                            return true;
                        }
                    }

                    // Check diagonals from right to left
                    if (j >= winningCondition - 1) {
                        if (checkAdditionalDiagonals(i, j, 1, -1)) {
                            setStartGame(false);

                            return true;
                        }
                    }
                }

                // Check diagonals from top to bottom
                if (j <= boardSize - winningCondition) {
                    if (checkAdditionalDiagonals(i, j, 1, 0)) {
                        setStartGame(false);

                        return true;
                    }
                }
            }
        }
        const nextPlayer = currentPlayer === player1Symbol ? player2Symbol : player1Symbol;
        setCurrentPlayer(nextPlayer);

        if (board.every((square) => square !== null)) {
            setStartGame(false);
            setIsDraw(true);
        }

        return false;
    };

    return <>
        {board.map((_: any, index: number) =>
            <div
                key={index}
                className="border border-gray-400 font-bold flex items-center justify-center focus:outline-none overflow-hidden"
                style={{height: '100%', minHeight: '1.4em', cursor: 'pointer'}}
                onClick={(e: any) => handleClick(e, index)}
            >
                {board[index] && <span style={{margin: '-1em'}}> {board[index]}</span>}
            </div>
        )}
    </>
};

const TicTacToeContainer: React.FC = () => {
    const [boardSize, setBoardSize] = useState(3);
    const initialBoard: SquareValue[] = Array.from({length: boardSize * boardSize}, () => null);
    const [board, setBoard] = useState<SquareValue[]>(initialBoard);
    const [winner, setWinner] = useState<SquareValue | null>(null);
    const [isDraw, setIsDraw] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState<SquareValue>('X');
    const [gameStats, setGameStats] = useState({currentPlayer: 'X', wins: 0, draws: 0});
    const [player1Stats, setPlayer1Stats] = useState({currentPlayer: 'X', wins: 0, draws: 0});
    const [player2Stats, setPlayer2Stats] = useState({currentPlayer: 'O', wins: 0, draws: 0});
    const windowSize = useWindowSize();
    const [startGame, setStartGame] = useState(false);
    const navigate = useNavigate();

    const handleReset = useCallback(() => {
        setBoard(initialBoard);
        setStartGame(false);
        setCurrentPlayer('X');
        setWinner(null);
        setIsDraw(false);
    }, [initialBoard]);

    const updateGameStats = useCallback(() => {
        if (!currentPlayer) return;

        if (isDraw) return setGameStats({currentPlayer, wins: gameStats.wins, draws: gameStats.draws + 1});
        if (currentPlayer === 'X') {
            setPlayer1Stats({currentPlayer, wins: player1Stats.wins + 1, draws: player1Stats.draws});
            setGameStats({currentPlayer, wins: player1Stats.wins + 1, draws: gameStats.draws});
        } else {
            setPlayer2Stats({currentPlayer, wins: player2Stats.wins + 1, draws: player2Stats.draws});
            setGameStats({currentPlayer, wins: player2Stats.wins + 1, draws: gameStats.draws});
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
        setBoard(Array.from({length: boardSize * boardSize}, () => null));
    }, [boardSize]);

    const getHeight = useCallback(() => {
        if (startGame) {
            return windowSize.innerHeight - 190;
        }
        return windowSize.innerHeight - 305;
    }, [windowSize, startGame]);

    return (
        <div className="p-1" style={{
            height: 'calc(100dvh - 6em)',
        }}>
            <div className="shadow-xl flex flex-col">
                {!startGame && <div className="text-center flex w-full">
                    <div className="m-2 w-full">
                        <span>Select Board Size</span>
                        <select
                            className="mt-1 text-sm block w-full p-2 text-black border border-gray-300"
                            onChange={(e) => {
                                const newSize = parseInt(e.target.value, 10);
                                setGameStats({currentPlayer: 'X', wins: 0, draws: 0});
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
                    <div onClick={() => navigate('/games')}>
                        <CloseIcon/>
                    </div>
                </div>}
                {currentPlayer && (
                    <GameStatistics
                        startGame={startGame}
                        currentPlayer={currentPlayer}
                        player1Stats={player1Stats}
                        player2Stats={player2Stats}
                    />
                )}
                <div className="text-center">
                    <div className="grid shadow-lg mb-2 min-h-max"
                         style={{gridTemplateColumns: `repeat(${boardSize}, 1fr)`, gap: '4px', height: getHeight()}}>
                        <TicTacToe
                            startGame={startGame}
                            setStartGame={setStartGame}
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
                        />
                    </div>
                </div>

            </div>
            {startGame && <div className="flex justify-center mt-2 mb-2">
                <button className="p-2 border-2 font-bold" onClick={handleReset}>
                    Reset
                </button>
            </div>}
        </div>
    );

};

export default TicTacToeContainer;
