import React from "react";

interface RadioInputProps {
  id: string;
  placeholder?: string;
  options: string[] | undefined;
  value: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioInput: React.FC<RadioInputProps> = ({
  id,
  placeholder,
  options,
  value,
  required,
  onChange,
}) => {
  return (
    <div>
      <label className="text-gray-500 mb-2">
        {placeholder} {required && <span className="text-red-500">*</span>}
      </label>
      {options?.map((option) => (
        <div key={option} className="flex items-center mb-2">
          <input
            type="radio"
            name={id}
            id={`radio-${id}-${option}`}
            value={option}
            checked={value === option}
            onChange={onChange}
            className="mr-2"
          />
          <label htmlFor={`radio-${id}-${option}`} className="text-gray-500">
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioInput;
