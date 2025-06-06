import React from "react";
import Datepicker, {DateValueType} from "react-tailwindcss-datepicker";

interface DateInputProps {
    id: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
    onChange: (value: string, key?: string, type?: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({
                                                 id,
                                                 placeholder,
                                                 required,
                                                 value,
                                                 onChange,
                                             }) => {


    const handleChange = (value: any, date: any) => {
        if (date.startDate === null) return;
        onChange(date.startDate.toString(), id, "date");
    }


    return (
        <div className="flex flex-col w-full relative text-black">
            <label
                htmlFor={id}
                className={`absolute left-1 transition-all duration-200 ${
                    value ? "-top-3 text-xs" : "top-1 text-md"
                }`}
                style={{zIndex: 1, pointerEvents: "none", backgroundColor: "white"}}
            >
                {placeholder} {required && <span className="text-red-500">*</span>}
            </label>
            <Datepicker
                useRange={false}
                asSingle={true}
                inputClassName="p-1 w-full border border-gray-300 shadow-sm  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={
                    {
                        startDate: value ? new Date(value) : null,
                        endDate: value ? new Date(value) : null,
                    } as DateValueType
                }
                onChange={(date: any) => handleChange(value, date)}
            />
        </div>
    );
};

export default DateInput;
