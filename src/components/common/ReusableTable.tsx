import React, { useCallback, useEffect, useState } from 'react';
import TableFooter from './table-components/TableFooter';
import SearchBar from './table-components/SearchBar';
import TableBody from './table-components/TableBody';
import TableHead from './table-components/TableHead';
import Loading from '../../pages/generic/Loading';
import { ReusableColumn } from '../../models/table';

interface TableProps {
    columns: ReusableColumn[];
    data: any
    rowAction?: any;
    paged?: boolean;
    changePage?: any;
    currentPage?: number;
    loading?: boolean;
    hasSearchBar?: boolean;
    title?: string
    changeNumberOfItemsPerPage?: any
    itemsPerPage?: number,
}

const ReusableTable = ({
    columns,
    data,
    rowAction,
    paged,
    changePage,
    currentPage,
    loading,
    hasSearchBar = true,
    changeNumberOfItemsPerPage,
    itemsPerPage,
    title }: TableProps) => {
    const [filteredItems, setFilteredItems] = useState(data)
    const [searchTerm, setSearchTerm] = useState<string>('')

    const changePageFunc = useCallback((dest: string) => {
        if (currentPage) {
            if (dest === 'prev') {
                if (currentPage > 0) {
                    changePage((prev: any) => (prev - 1))
                }
                return
            }
            if (dest === 'next') {
                changePage((prev: any) => (prev + 1))
                return
            }
            if (dest === 'first') {
                changePage(() => 1)
                return
            }
            if (dest === 'last') {
                changePage(() => (data.totalPages))
                return
            }
        }

    }, [data?.totalPages, currentPage, changePage])

    useEffect(() => {
        let filtered
        if (paged && data?.items?.length > 0) {
            filtered = data.items.filter((item: any) => {
                return Object.values(item).join('').toLowerCase().includes(searchTerm.toLowerCase())
            })
        }

        if (!paged && data?.length > 0) {
            filtered = data.filter((item: any) => {
                return Object.values(item).join('').toLowerCase().includes(searchTerm.toLowerCase())
            })
        }

        setFilteredItems({ items: filtered, totalPages: data?.totalPages })
    }, [searchTerm, data, paged])

    return (
        <div className="flex-column m-2 p-2" style={{ minHeight: '8em' }}>
            {hasSearchBar && <SearchBar setSerchTerm={setSearchTerm} />}
            {title && <h1 className='text-xl font-bold mb-4'>{title}</h1>}
            {loading ? (
                <Loading />
            ) : (
                <table className='block min-w-full'>
                    <TableHead columns={columns} />
                    <TableBody
                        filteredItems={filteredItems}
                        handleRowClick={rowAction}
                        columns={columns} />
                </table>)}
            {paged && itemsPerPage && (
                <TableFooter
                    currentPage={currentPage ? currentPage : 0}
                    totalPages={data.totalPages}
                    itemsPerPage={itemsPerPage}
                    handleChangeItemsPerPage={(e) => {
                        changeNumberOfItemsPerPage(+e.target.value)
                    }}
                    onNextPage={() => changePageFunc('next')}
                    onPreviousPage={() => changePageFunc('prev')}
                    onFirstPage={() => changePageFunc('first')}
                    onLastPage={() => changePageFunc('last')}
                />
            )}
        </div >
    );
}

export default ReusableTable;