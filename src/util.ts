import dayjs from "dayjs"
import { ReusableColumn } from "./models/table"

export const dateFormater = (date: string) => {
    return date ? dayjs(date).format("YYYY-MM-DD HH:mm") : 'N/A'
}

export const getCellWidth = (columns: ReusableColumn[], column: ReusableColumn) => {
    if (column.key === 'id') return '7%'
    if (columns.length > 0) {
        return `${100 / columns.length + 13.5}%`
    }
    return '100%'
}

export const getRandomNumber =(min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}