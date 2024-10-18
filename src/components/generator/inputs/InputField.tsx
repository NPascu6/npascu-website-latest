import React, { useEffect, useState } from "react";

interface InputFieldProps {
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | unknown
      | any,
    key?: any,
    type?: string
  ) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    setIsTouched(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);
    }
  }, [id]);

  return (
    <div className="flex flex-col items-baseline relative text-black min-w-24">
      {type !== "textarea" ? (
        <>
          <input
            type={type}
            name={id}
            id={id}
            value={value}
            required={required}
            onChange={(e) => {
              e.persist();
              onChange(e);
            }}
            className="block w-full p-1 border border-gray-300 shadow-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <label
            htmlFor={id}
            className={`absolute left-1 transition-all duration-200 ease-in-out rounded-md ${
              value || isFocused ? "-top-3 text-xs p-1" : "top-1/2 text-sm"
            }`}
            style={{
              pointerEvents: "none",
              lineHeight: "10px",
              backgroundColor: "white",
            }}
          >
            {placeholder}
            {required && <span className="text-red-500"> *</span>}
          </label>
        </>
      ) : (
        <>
          <textarea
            name={id}
            id={id}
            value={value}
            required={required}
            placeholder=" "
            onChange={(e) => {
              e.persist();
              onChange(e);
            }}
            className="block min-h-24 w-full p-1 border border-gray-300 shadow-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <label
            htmlFor={id}
            className={`absolute left-1 transition-all duration-200 ease-in-out rounded-md ${
              value || isFocused ? "-top-2 text-xs p-1" : "top-1 text-md"
            }`}
            style={{
              pointerEvents: "none",
              backgroundColor: "white",
              padding: "0 0.3rem",
            }}
          >
            {placeholder}
            {required && <span className="text-red-500"> *</span>}
          </label>
        </>
      )}
    </div>
  );
};

export default InputField;
