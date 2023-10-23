import React from "react"
import { ReusableColumn } from "../../../models/common/common"
import { getCellWidth } from "../../../util/util"

interface TableHeadProps {
    columns: ReusableColumn[]
}

const TableHead = ({ columns }: TableHeadProps) => {
    return <thead style={{ display: 'block' }} className='border-b-2 select-none'>
        <tr style={{ display: 'flex' }}>
            {columns.map((column: ReusableColumn, index: number) => (
                <th style={{ width: getCellWidth(columns, column), paddingLeft: `${0.2}em` }}
                    className={`flex text-left pl-2 p-1 py-1 tooltip
                    ${index > 0 ? "border-l-1" : (index === columns.length - 1) ? "border-r-2" : "border-r-1"} 
                    ${index < columns.length - 1 ? "border-r-2" : ""} 
                    border-sky-gray`}
                    key={index}>
                    <span
                        style={{
                            overflow: 'hidden',
                            display: 'inline-block',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                        {column.header}
                    </span>
                    <div className='tooltiptext'>{column.header}</div>
                </th>
            ))}
        </tr>
    </thead>
}

export default TableHead