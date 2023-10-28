import React from "react"
import { getCellWidth } from "../../../util/util"
import { ReusableColumn } from "../../../models/common/common"

interface TableBodyProps {
    filteredItems: any
    handleRowClick: any
    columns: ReusableColumn[]
}

const TableBody = ({ filteredItems, handleRowClick, columns }: TableBodyProps) => {
    return filteredItems?.items && filteredItems.items.length > 0 ? <tbody style={{ display: 'block', minHeight: '12em', maxHeight: 'calc(100vh - 16em)', overflow: 'auto' }}>
        {filteredItems?.items?.map((row: any, rowIndex: number) => (
            <tr
                style={{ cursor: 'pointer', display: 'flex' }}
                className='border-b-2 hover:shadow-lg hover:border-gray-400 hover:font-bold'
                key={rowIndex}
                onClick={() => handleRowClick ? handleRowClick(row) : null}>
                {columns.map((column: ReusableColumn, colIndex: number) => (
                    <td style={{
                        width: getCellWidth(columns, column),
                        flexDirection: 'row',
                        float: 'left',
                        paddingLeft: `${colIndex === 0 ? '0.2' : colIndex * 0.05}em`
                    }}
                        className={`flex px-2 py-1.5 `} key={colIndex}>
                        <span style={{
                            overflow: 'hidden',
                            display: 'inline-block',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {column.cellRenderer ? column.cellRenderer(row[column.key]) : row[column.key]}
                        </span>
                    </td>
                ))}
            </tr>
        ))}
    </tbody> : <div style={{ display: 'block', minHeight: '12em', maxHeight: 'calc(100vh - 16em)', overflow: 'auto' }}>
        <div className="flex items-center justify-center h-40 ">
            <p className="text-xl text-gray-600">No data found</p>
        </div>
    </div>
}

export default TableBody