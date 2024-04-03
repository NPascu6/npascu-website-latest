// Target.tsx
import React, { useEffect } from 'react';

interface TargetProps {
  onClick: (id: number, points: number) => void;
  color: string;
  timer: number; // Timer in seconds
  id: number; // Adding ID to identify which target is being clicked
  colorPoints: any;
}

const Target: React.FC<TargetProps> = ({ onClick, color, timer, id, colorPoints }) => {
  const [time, setTime] = React.useState(timer);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onClick(id, 0); // Auto-remove target after timer expires, assigning 0 points
    }, time * 1000);

    return () => clearTimeout(timeout);
  }, [onClick, time, id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <button
      className="w-12 h-12 rounded-full focus:outline-none text-gray-500 text-lg font-bold"
      style={{ backgroundColor: color }}
      onClick={() => onClick(id, colorPoints[color].points)}
    >{time}</button>
  );
};

export default Target;
