// Game.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Target from './Target';
import Score from './Score';
import Time from './Time';

const colorPoints: any = {
    '#FF5733': { points: 5, timer: 5 },
    '#33FF57': { points: 3, timer: 7 },
    '#3357FF': { points: 1, timer: 10 },
    '#FF33FF': { points: 10, timer: 3 },
    '#FFFF33': { points: 2, timer: 8 },
    '#33FFFF': { points: 4, timer: 6 },
    '#000000': { type: 'bomb', radius: 200, timer: 3 }, // Bomb target
    '#16EA36': { type: 'timeBoost', timer: 3 }, // Time boost target
    '#060606': { type: 'timePenalty', timer: 3 }, // Time penalty target
};

const getRandomColor = () => {
    const colors = Object.keys(colorPoints);
    return colors[Math.floor(Math.random() * colors.length)];
};

interface GameProps {
    setStarted: (started: boolean) => void;
}

const Game = ({ setStarted }: GameProps) => {
    const [score, setScore] = useState(0);
    const [targets, setTargets] = useState([{ id: 1, color: getRandomColor(), position: getRandomPosition() }]);
    const [time, setTime] = useState(10);
    const [start, setStart] = useState(false);

    function getRandomPosition(targetSize = 50) {
        const margin = 10;
        const safeZone = { top: 100, bottom: 50, left: 50, right: 50 };
        const maxX = window.innerWidth - targetSize - margin - safeZone.right;
        const maxY = window.innerHeight - targetSize - margin - safeZone.bottom;
        const minX = margin + safeZone.left;
        const minY = margin + safeZone.top;
        return {
            x: Math.random() * (maxX - minX) + minX,
            y: Math.random() * (maxY - minY) + minY,
        };
    }

    useEffect(() => {
        if (!start) return;

        const interval = setInterval(() => {
            setTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                    endGame('Time is up!'); // Pass reason for game end
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [start]);

    const endGame = useCallback((reason: string) => {
        alert(`Game over! ${reason} Your score is ${score}.`);
        resetGame();
    }, []);

    const resetGame = () => {
        setScore(0);
        setStart(false);
        setStarted(false);
        setTime(10);
        setTargets([{ id: Math.random(), color: getRandomColor(), position: getRandomPosition() }]);
    };

    const addTargetsBasedOnDifficulty = () => {
        const additionalTargets = Math.min(Math.floor(score / 5) + 1, 15);
        setTargets([...Array(additionalTargets)].map(() => ({
            id: Math.random(),
            color: getRandomColor(),
            position: getRandomPosition(),
        })));
    };

    const handleClickTarget = useCallback((id: number, val?: number) => {
        const targetIndex = targets.findIndex(target => target.id === id);

        if (val === 0) {
            setTargets(prevTargets => prevTargets.filter((_, i) => i !== targetIndex));
            return
        }

        if (targetIndex === -1) return; // Target not found

        const target = targets[targetIndex];
        const targetDetails = colorPoints[target.color];

        // Handle special target types
        if (targetDetails.type) {
            switch (targetDetails.type) {
                case 'bomb':
                    // Remove targets within the bomb's radius
                    const bombPosition = target.position;

                    const targetsInRadius = targets.filter(t => {
                        const distance = Math.sqrt(Math.pow(t.position.x - bombPosition.x, 2) + Math.pow(t.position.y - bombPosition.y, 2));
                        return distance <= targetDetails.radius;
                    });

                    const timeValue = targetsInRadius.reduce((acc, t) => {
                        const tDetails = colorPoints[t.color];
                        return acc + tDetails.timer;
                    }, 0);

                    setTime(prevTime => Math.max(0, prevTime + timeValue)); // Ensure time doesn't go below 0


                    setTargets(prevTargets => prevTargets.filter(t => {
                        const distance = Math.sqrt(Math.pow(t.position.x - bombPosition.x, 2) + Math.pow(t.position.y - bombPosition.y, 2));
                        return distance > targetDetails.radius;
                    }));
                    break;
                case 'timeBoost':
                    setTime(prevTime => prevTime + targetDetails.timer);
                    break;
                case 'timePenalty':
                    setTime(prevTime => Math.max(0, prevTime - targetDetails.timer)); // Ensure time doesn't go below 0
                    break;
                default:
                    break; // No action for unknown types
            }
        } else {
            // Regular target
            setScore(prevScore => prevScore + targetDetails.points);
            setTime(prevTime => prevTime + 1); // Adjusting the timer as per your existing logic
        }

        // Remove the clicked target
        setTargets(prevTargets => prevTargets.filter((_, i) => i !== targetIndex));

        // Generate new targets if needed
        if (targets.length - 1 === 0) {
            addTargetsBasedOnDifficulty();
        }
    }, [targets, setTargets, setScore, setTime, addTargetsBasedOnDifficulty]);


    useEffect(() => {
        if (targets.length === 0) {
            addTargetsBasedOnDifficulty();
        }
    }, [targets])

    return (
        <div className="flex flex-col items-center justify-center">
            {!start ? (
                <button onClick={() => {
                    setStart(true)
                    setStarted(true)
                }
                } className="m-4 bg-green-500 text-white p-2 rounded">
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
                            {/* Example: Adjusting styling based on target type */}
                            <Target
                                colorPoints={colorPoints}
                                id={target.id}
                                color={target.color}
                                timer={colorPoints[target.color].timer}
                                onClick={handleClickTarget}
                                // You might need to adjust the Target component to use these props:
                                type={colorPoints[target.color].type}
                            />
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default Game;
