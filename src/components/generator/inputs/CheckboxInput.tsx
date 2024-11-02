import React from "react";

interface CheckboxInputProps {
    id: string;
    placeholder?: string;
    value: any;
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
        <div className="flex items-center relative">
            <input
                type="checkbox"
                name={id}
                checked={value}
                onChange={(e) => onChange(e, id, "checkbox")}
                className="mr-2"
                id={`checkbox-${id}`}
            />
            <label
                htmlFor={`checkbox-${id}`}
                className={`text-gray-500 transition-all duration-200 ease-in-out ${
                    value && value !== false ? "text-md" : "text-sm"
                }`}
            >
                {placeholder}
                {required && <span className="text-red-500"> *</span>}
            </label>
        </div>
    );
};

export default CheckboxInput;
