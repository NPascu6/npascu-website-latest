import dayjs from "dayjs";
import {ReusableColumn} from "../models/table";

export const dateFormater = (date: string) => {
    return date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "N/A";
};

export const getCellWidth = (
    columns: ReusableColumn[],
    column: ReusableColumn
) => {
    if (column.key === "id") return "7%";
    if (columns.length > 0) {
        return `${100 / columns.length + 13.5}%`;
    }
    return "100%";
};

export const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const formatFieldToUpperCaseAndBreakCammelCase = (field: string) => {
    return field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
};

interface FormData {
    id: number;
    form_name: string;
    form_definition: any;
}

export const parseCSV = (csvText: string): FormData[] => {
    const lines = csvText.trim().split("\n");
    const headers = lines[0]
        .split(",")
        .map((header) => header.replace(/^"(.*)"$/, "$1").trim());

    const data: FormData[] = lines.slice(1).map((line: string) => {
        const values = line.split(",");
        const obj: any = {};

        headers.forEach((header, index) => {
            if (header) {
                obj[header] = JSON.parse(values[index]);
            } else {
                obj[header] = values[index];
            }
        });

        return obj;
    });

    return data;
};
