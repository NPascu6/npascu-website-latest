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
    <div className="">
      <label className="text-gray-500 mb-2">
        {placeholder}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {options?.map((option) => (
        <div key={option} className="flex items-center mb-2">
          <input
            type="radio"
            name={id}
            value={option}
            checked={value === option}
            onChange={onChange}
            className="mr-2"
            id={`radio-${id}-${option}`}
          />
          <label
            htmlFor={`radio-${id}-${option}`}
            className={`text-gray-500 transition-all duration-200 ease-in-out ${
              value === option || value === "" ? "text-md" : "text-sm"
            }`}
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioInput;
