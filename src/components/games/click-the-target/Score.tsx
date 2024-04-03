import React from 'react';

interface ScoreProps {
  score: number;
}

const Score: React.FC<ScoreProps> = ({ score }) => {
  return (
    <div className="m-4 p-2 text-lg font-bold text-white bg-blue-500">
      Score: {score}
    </div>
  );
};

export default Score;
