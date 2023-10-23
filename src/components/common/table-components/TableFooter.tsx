import React from "react";

interface TableFooterProps {
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPreviousPage: () => void;
    onFirstPage: () => void;
    onLastPage: () => void;
    itemsPerPage: number;
    handleChangeItemsPerPage: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TableFooter = ({
    currentPage,
    totalPages,
    onNextPage,
    onPreviousPage,
    onFirstPage,
    onLastPage,
    itemsPerPage,
    handleChangeItemsPerPage
}: TableFooterProps) => {
    return (
        <div className="flex p-1 footer justify-end rounded">
            <div className="flex items-center select-none ">
                <button
                    className="mr-2 px-3 py-0.1 border rounded-lg"
                    onClick={onFirstPage}
                    disabled={currentPage === 1}
                >
                    First
                </button>
                <button
                    className="mr-2 px-2 py-0.1 border rounded-lg"
                    onClick={onPreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="text-gray-500 w-full pl-3" style={{ minWidth: '5em' }}>
                    <span>{currentPage}</span>
                    <span> of </span>
                    <span>{totalPages}</span>
                </span>
                <button
                    className="ml-2 px-2 py-0.1 border rounded-lg"
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
                <button
                    className="ml-2 px-2 py-0.1 border rounded-lg"
                    onClick={onLastPage}
                    disabled={currentPage === totalPages}
                >
                    Last
                </button>
                <select
                    value={itemsPerPage}
                    onChange={item => handleChangeItemsPerPage(item)}
                    className="block m-1 w-full bg-white border border-gray-400 text-gray-700 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                    {[5, 10, 15, 20, 25, 50].map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default TableFooter;