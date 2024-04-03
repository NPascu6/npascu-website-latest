import React from 'react';

interface TargetProps {
  onClick: () => void;
}

const Target: React.FC<TargetProps> = ({ onClick }) => {
  return (
    <button
      className="w-12 h-12 bg-red-500 rounded-full focus:outline-none"
      onClick={onClick}
    ></button>
  );
};

export default Target;
