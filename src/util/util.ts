import dayjs from "dayjs"
import { ReusableColumn } from "../models/common/common"

export const dateFormater = (date: string) => {
    return dayjs(date).format("YYYY-MM-DD HH:mm")
}

export const getCellWidth = (columns: ReusableColumn[], column: ReusableColumn) => {
    if (column.key === 'id') return '7%'
    if (columns.length > 0) {
        return `${100 / columns.length + 13.5}%`
    }
    return '100%'
}