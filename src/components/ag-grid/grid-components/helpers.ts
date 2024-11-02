import {ValueFormatterParams} from "ag-grid-community";
import dayjs from "dayjs";

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin

dayjs.extend(utc)
dayjs.extend(timezone)

export const dateTimeValueFormatter = (params: ValueFormatterParams | { value: string }) => {
    const dt = new Date();
    let diffTZ = dt.getTimezoneOffset();
    const date = new Date(params.value)

    date.setMinutes(date.getMinutes() - diffTZ)

    if (!params.value) {
        return '';
    }

    return dayjs(date).format('DD.MM.YYYY - HH:mm');
};