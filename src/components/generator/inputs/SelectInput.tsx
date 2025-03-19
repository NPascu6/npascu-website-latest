import React from "react";
import CloseIcon from "../../../assets/icons/CloseIcon";

interface SelectInputProps {
    id: string;
    placeholder?: string;
    options: string[] | null;
    value: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({
                                                     id,
                                                     placeholder,
                                                     options,
                                                     value,
                                                     required,
                                                     onChange,
                                                 }) => {
    return (
        <div className="relative text-black">
            {value && (
                <label
                    htmlFor={id}
                    className={`absolute left-1 transition-all duration-200  ${
                        value ? "-top-3 text-xs p-1" : "top-1/2 text-md"
                    }`}
                    style={{pointerEvents: "none", backgroundColor: "white"}}
                >
                    {placeholder} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                id={id}
                name={id}
                value={value}
                required={required}
                onChange={onChange}
                style={{height: "2.5rem", border: "1px solid #e2e8f0"}}
                className="mt-1 block w-full  border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
                <option value="" disabled hidden>
                    {placeholder}
                </option>
                {options?.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {value && (
                <button
                    type="button"
                    className="absolute right-5 top-3 text-gray-500"
                    onClick={() =>
                        onChange({
                            target: {name: id, value: ""},
                        } as React.ChangeEvent<HTMLSelectElement>)
                    }
                >
                    <CloseIcon/>
                </button>
            )}
        </div>
    );
};

export default SelectInput;
