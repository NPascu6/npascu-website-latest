import dayjs from "dayjs";
import { ReusableColumn } from "./models/table";

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

export const parseCSV = (csvText: string) => {
  const lines = csvText.split("\n");
  const headers = lines[0].split(",").map((header: string) => header.trim());
  const data = lines.slice(1).map((line: string) => {
    const values = line.split(",").map((value: string) => value.trim());
    const entry: any = {};
    headers.forEach((header: any, index) => {
      entry[header] = values[index];
    });
    return entry;
  });
  return data;
};
