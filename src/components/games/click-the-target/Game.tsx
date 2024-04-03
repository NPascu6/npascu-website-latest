import React, { useState, useEffect } from 'react';
import Target from './Target';
import Score from './Score';
import Time from './Time';

const Game: React.FC = () => {
    const [timeLimit, setTimeLimit] = useState(10); // Initial time limit
    const [score, setScore] = useState(0);
    const [targets, setTargets] = useState([{ id: 1, position: getRandomPosition() }]);
    const [time, setTime] = useState(timeLimit);
    const [start, setStart] = useState(false);

    function getRandomPosition(targetSize = 50) { // Assume a default target size, adjust according to your target component
        const margin = 10; // Margin from the edge of the screen
        const safeZone = { top: 100, bottom: 50, left: 50, right: 50 }; // Adjust based on your UI elements' positions

        // Calculate maximum x and y values considering margin, safeZone, and targetSize
        const maxX = window.innerWidth - targetSize - margin - safeZone.right;
        const maxY = window.innerHeight - targetSize - margin - safeZone.bottom;

        // Calculate minimum x and y values considering margin and safeZone
        const minX = margin + safeZone.left;
        const minY = margin + safeZone.top;

        // Generate and return the position object
        return {
            x: Math.random() * (maxX - minX) + minX,
            y: Math.random() * (maxY - minY) + minY,
        };
    }

    useEffect(() => {
        if (!start) return;
        const interval = setInterval(() => {
            setTime(prevTime => prevTime > 0 ? prevTime - 1 : 0);
        }, 1000);

        return () => clearInterval(interval);
    }, [start]);

    useEffect(() => {
        if (time === 0) {
            endGame();
        }
    }, [time]);

    const endGame = () => {
        alert(`Game over! Your score is ${score}`);
        resetGame();
    };

    const resetGame = () => {
        setScore(0);
        setStart(false);
        setTime(timeLimit);
        setTargets([{ id: 1, position: getRandomPosition() }]);
    };

    const handleClickTarget = (id: number) => {
        setTargets(prevTargets => {
            const newTargets = prevTargets.filter(target => target.id !== id);
            if (newTargets.length === 0) {
                incrementScoreAndAdjustDifficulty();
            }
            return newTargets;
        });
    };

    const incrementScoreAndAdjustDifficulty = () => {
        setScore(score + 1);
        setTime(timeLimit);
        // Adjust difficulty based on current score or other conditions before adding new targets
        adjustDifficulty();
        // Add new target(s) based on the adjusted difficulty
        addTargetsBasedOnDifficulty();
    };

    const adjustDifficulty = () => {
        // Example: Adjust time limit and number of targets more granularly
        const newTimeLimit = Math.max(1, timeLimit - (score / 50)); // Gradually decrease time limit
        setTimeLimit(newTimeLimit);

        // You can also adjust the number of targets here if needed
    };

    const addTargetsBasedOnDifficulty = () => {
        // Adjust the number of new targets based on current difficulty
        const additionalTargets = Math.min(Math.floor(score / 5) + 1, 15); // Example: increase targets gradually
        setTargets([...Array(additionalTargets)].map(() => ({
            id: Math.random(),
            position: getRandomPosition()
        })));
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {!start ? (
                <button onClick={() => setStart(true)} className="m-4 bg-green-500 text-white p-2">
                    Start Game
                </button>
            ) : (
                <>
                    <div className="flex justify-evenly w-full p-4">
                        <Score score={score} />
                        <Time time={time} />
                    </div>
                    {targets.map((target) => (
                        <div key={target.id} style={{ left: `${target.position.x}px`, top: `${target.position.y}px`, position: 'absolute' }}>
                            <Target onClick={() => handleClickTarget(target.id)} />
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default Game;
