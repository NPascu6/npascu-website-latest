import React, { useEffect, useState } from 'react';

interface TargetProps {
  onClick: (id: number, val?: number) => void; // Simplified to only require ID for the click handler
  color: string;
  timer: number; // Timer in seconds for auto-removal and display
  id: number; // Target ID
  colorPoints: any; // Contains details about points and potentially type
  type: string; // Type of target
}

const Target: React.FC<TargetProps> = ({ onClick, color, timer, id, colorPoints, type }) => {
  const [time, setTime] = useState(timer);

  // Determine if the target is special based on its color
  const targetType = type

  useEffect(() => {
    const timeout = setTimeout(() => {
      onClick(id, 0); // Auto-remove target after timer expires
    }, time * 1000);

    return () => clearTimeout(timeout);
  }, [onClick, time, id]);

  useEffect(() => {
    // Regular decrement for the timer, could be adjusted based on type if needed
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime > 0 ? prevTime - 1 : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (targetType) {
      case 'bomb':
        return '💣';
      case 'timeBoost':
        return '⏳';
      case 'timePenalty':
        return '☢️';
      default:
        return time; // Show remaining time for regular targets
    }
  };

  return (
    <button
      className={`w-12 h-12 rounded-full focus:outline-none text-lg font-bold ${
        targetType ? 'text-white' : 'text-gray-500'
      }`}
      style={{ backgroundColor: color }}
      onClick={() => onClick(id)}
    >
      {renderContent()}
    </button>
  );
};

export default Target;
