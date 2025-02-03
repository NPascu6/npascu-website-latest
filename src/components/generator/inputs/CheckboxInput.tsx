import React from "react";

interface CheckboxInputProps {
  id: string;
  placeholder?: string;
  value: boolean;
  required?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    type: string
  ) => void;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  id,
  placeholder,
  value,
  required,
  onChange,
}) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        name={id}
        id={`checkbox-${id}`}
        checked={value}
        onChange={(e) => onChange(e, id, "checkbox")}
        className="mr-2"
      />
      <label htmlFor={`checkbox-${id}`} className="text-gray-500">
        {placeholder} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
};

export default CheckboxInput;
