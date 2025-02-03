import React, { useEffect, useState } from "react";

interface InputFieldProps {
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus = (): void => setIsFocused(true);
  const handleBlur = (): void => setIsFocused(false);

  useEffect(() => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);
    }
    return () => {
      if (input) {
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("blur", handleBlur);
      }
    };
  }, [id]);

  return (
    <div className="flex flex-col relative text-black min-w-[6rem]">
      {type !== "textarea" ? (
        <>
          <input
            type={type}
            name={id}
            id={id}
            value={value}
            required={required}
            onChange={onChange}
            className="block w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <label
            htmlFor={id}
            className={`absolute left-1 transition-all duration-200 ${
              value || isFocused ? "-top-3 text-xs p-1" : "top-1/2 text-sm"
            }`}
            style={{
              pointerEvents: "none",
              backgroundColor: "white",
              lineHeight: "10px",
            }}
          >
            {placeholder} {required && <span className="text-red-500">*</span>}
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
            onChange={onChange}
            className="block w-full min-h-[6rem] p-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <label
            htmlFor={id}
            className={`absolute left-1 transition-all duration-200 ${
              value || isFocused ? "-top-2 text-xs p-1" : "top-1 text-md"
            }`}
            style={{
              pointerEvents: "none",
              backgroundColor: "white",
              padding: "0 0.3rem",
            }}
          >
            {placeholder} {required && <span className="text-red-500">*</span>}
          </label>
        </>
      )}
    </div>
  );
};

export default InputField;
