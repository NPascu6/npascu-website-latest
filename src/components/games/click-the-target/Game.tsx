import React, {useCallback, useEffect, useState} from "react";
import Target from "./Target";
import Score from "./Score";
import Time from "./Time";

const colorPoints: any = {
    "#FF5733": {points: 5, timer: 5},
    "#33FF57": {points: 3, timer: 3},
    "#3357FF": {points: 1, timer: 1},
    "#FFFF33": {points: 2, timer: 2},
    "#33FFFF": {points: 4, timer: 4},
    "#000000": {type: "bomb", radius: 200, timer: 3}, // Bomb target
    "#16EA36": {type: "timeBoost", timer: 10}, // Time boost target
    "#060606": {type: "timePenalty", timer: 10}, // Time penalty target
};

const getRandomColor = () => {
    const colors = Object.keys(colorPoints);
    return colors[Math.floor(Math.random() * colors.length)];
};

interface GameProps {
    setStarted: (started: boolean) => void;
}

const Game = ({setStarted}: GameProps) => {
    const [score, setScore] = useState(0);
    const [targets, setTargets] = useState([
        {id: 1, color: getRandomColor(), position: getRandomPosition()},
    ]);
    const [time, setTime] = useState(10); // Total game time
    const [start, setStart] = useState(false);

    function getRandomPosition(targetSize = 50) {
        const margin = 10;
        const safeZone = {top: 100, bottom: 50, left: 50, right: 50};
        const maxX = window.innerWidth - targetSize - margin - safeZone.right;
        const maxY = window.innerHeight - targetSize - margin - safeZone.bottom;
        const minX = margin + safeZone.left;
        const minY = margin + safeZone.top;
        return {
            x: Math.random() * (maxX - minX) + minX,
            y: Math.random() * (maxY - minY) + minY,
        };
    }

    // Total game timer decreasing
    useEffect(() => {
        if (!start) return;

        const interval = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 0.1) {
                    clearInterval(interval);
                    endGame("Time is up!");
                }
                return Math.max(0, prevTime - 1); // Decrease by 1 second each interval
            });
        }, 1000); // Global timer decreases every second

        return () => clearInterval(interval);
    }, [start]);

    // End game when time runs out
    const endGame = useCallback(
        (reason: string) => {
            alert(`Game over! ${reason} Your score is ${score}.`);
            resetGame();
        },
        [score]
    );

    const resetGame = () => {
        setScore(0);
        setStart(false);
        setStarted(false);
        setTime(10);
        setTargets([
            {
                id: Math.random(),
                color: getRandomColor(),
                position: getRandomPosition(),
            },
        ]);
    };

    // Add new targets based on difficulty
    const addTargetsBasedOnDifficulty = () => {
        const additionalTargets = Math.min(Math.floor(score / 5) + 1, 15);
        setTargets((prevTargets) => [
            ...prevTargets,
            ...Array(additionalTargets)
                .fill(null)
                .map(() => ({
                    id: Math.random(),
                    color: getRandomColor(),
                    position: getRandomPosition(),
                })),
        ]);
    };

    const handleClickTarget = useCallback(
        (id: number, val?: number) => {
            const targetIndex = targets.findIndex((target) => target.id === id);
            if (targetIndex === -1) return; // Target not found

            const target = targets[targetIndex];
            const targetDetails = colorPoints[target.color];

            if (val === 0) {
                // Remove target if val is 0
                setTargets((prevTargets) =>
                    prevTargets.filter((_, i) => i !== targetIndex)
                );
                return;
            }

            // Handle special target types
            if (targetDetails.type) {
                switch (targetDetails.type) {
                    case "bomb":
                        // Bomb: destroy nearby targets and increase time
                        const bombPosition = target.position;
                        const targetsInRadius = targets.filter((t) => {
                            const distance = Math.sqrt(
                                Math.pow(t.position.x - bombPosition.x, 2) +
                                Math.pow(t.position.y - bombPosition.y, 2)
                            );
                            return distance <= targetDetails.radius;
                        });

                        const timeValue = targetsInRadius.reduce((acc, t) => {
                            const tDetails = colorPoints[t.color];
                            return acc + tDetails.timer;
                        }, 0);

                        setTime((prevTime) => prevTime + timeValue); // Increase time for bomb

                        setTargets((prevTargets) =>
                            prevTargets.filter((t) => {
                                const distance = Math.sqrt(
                                    Math.pow(t.position.x - bombPosition.x, 2) +
                                    Math.pow(t.position.y - bombPosition.y, 2)
                                );
                                return distance > targetDetails.radius;
                            })
                        );
                        break;

                    case "timeBoost":
                        setTime((prevTime) => prevTime + targetDetails.timer); // Time boost
                        break;

                    case "timePenalty":
                        setTime((prevTime) => Math.max(0, prevTime - targetDetails.timer)); // Time penalty
                        break;

                    default:
                        break;
                }
            } else {
                // Regular target: increase score and time
                setScore((prevScore) => prevScore + targetDetails.points);
                setTime((prevTime) => prevTime + 1); // Adjust time for regular targets
            }

            // Remove clicked target
            setTargets((prevTargets) =>
                prevTargets.filter((_, i) => i !== targetIndex)
            );

            // Generate new targets if all are cleared
            if (targets.length - 1 === 0) {
                addTargetsBasedOnDifficulty();
            }
        },
        [targets, setTargets, setScore, setTime, addTargetsBasedOnDifficulty]
    );

    // Add new targets if the target list is empty
    useEffect(() => {
        if (targets.length === 0) {
            addTargetsBasedOnDifficulty();
        }
    }, [targets]);

    return (
        <div
            className="grid items-center justify-center">
            <div className="flex justify-evenly w-full p-4">
                <Score score={score}/>
                <Time time={time}/>
            </div>
            {!start ? (
                <button
                    onClick={() => {
                        setStart(true);
                        setStarted(true);
                    }}
                    className="m-4 bg-green-500 text-white p-2 rounded"
                >
                    Start Game
                </button>
            ) : (
                <div>

                    {targets.map((target) => (
                        <div
                            key={target.id}
                            style={{
                                left: `${target.position.x}px`,
                                top: `${target.position.y}px`,
                                height: "calc(100dvh - 7em)",
                                overflow: "auto",
                            }}
                        >
                            <Target
                                id={target.id}
                                color={target.color}
                                timer={colorPoints[target.color].timer}
                                onClick={handleClickTarget}
                                type={colorPoints[target.color].type}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Game;
