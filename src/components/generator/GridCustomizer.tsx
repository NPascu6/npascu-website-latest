import React, {useState} from "react";
import {ColumnDefinition} from "./DynamicTable";
import {useSelector} from "react-redux";
import CloseIcon from "../../assets/icons/CloseIcon";
import {RootState} from "../../store/store";
import CollapsibleSection from "../common/CollapsableSection";

interface GrcolIdCustomizerProps {
    columnDefs: ColumnDefinition[];
    setColumnDefs: React.Dispatch<React.SetStateAction<ColumnDefinition[]>>;
}

const GrcolIdCustomizer: React.FC<GrcolIdCustomizerProps> = ({
                                                                 columnDefs,
                                                                 setColumnDefs,
                                                             }) => {
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const [newColumn, setNewColumn] = useState<ColumnDefinition>({
        colId: (columnDefs.length + 1).toString(),
        field: "",
        headerName: "",
        filter: false,
        sortable: false,
    });

    const handleColumnChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | any
        >,
        columnId: number
    ): void => {
        const {name, value, type, checked} = e.target;
        setColumnDefs((prevDefs) =>
            prevDefs.map((column) =>
                column.colId === columnId.toString()
                    ? {...column, [name]: type === "checkbox" ? checked : value}
                    : column
            )
        );
    };

    const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

    const handleAddColumn = (): void => {
        setColumnDefs((prevDefs) => [
            ...prevDefs,
            {
                ...newColumn,
                colId: (prevDefs.length + getRandomInt(1e16)).toString(),
            },
        ]);
        setNewColumn({
            colId: (columnDefs.length + 20).toString(),
            field: "",
            headerName: "",
            filter: false,
            sortable: false,
        });
    };

    const handleRemoveColumn = (columnId: number): void => {
        setColumnDefs((prevDefs) =>
            prevDefs.filter((column) => +column.colId !== columnId)
        );
    };

    return (
        <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-1 items-center justify-center ">
            <CollapsibleSection
                isCollapsed={true}
                title="Column Customizer"
                className="w-full h-full"
            >
                <div className="overflow-auto h-[calc(100dvh-26em)]">
                    <input
                        type="text"
                        name="field"
                        placeholder="Column Name"
                        value={newColumn.field}
                        onChange={(e) =>
                            setNewColumn({...newColumn, field: e.target.value})
                        }
                        className="mt-1 block w-full border-gray-300  shadow-sm mb-2 p-2"
                    />
                    <input
                        type="text"
                        name="headerName"
                        placeholder="Column Header"
                        value={newColumn.headerName}
                        onChange={(e) =>
                            setNewColumn({...newColumn, headerName: e.target.value})
                        }
                        className="mt-1 block w-full border-gray-300  shadow-sm mb-2 p-2"
                    />
                    <select
                        name="type"
                        value={newColumn.type || ""}
                        onChange={(e) =>
                            setNewColumn({...newColumn, type: e.target.value})
                        }
                        className="mt-1 block w-full border-gray-300  shadow-sm mb-2 p-2"
                    >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="date">Date</option>
                    </select>
                    <div className="flex items-center mb-2">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                name="filter"
                                checked={newColumn.filter || false}
                                onChange={(e) =>
                                    setNewColumn({...newColumn, filter: e.target.checked})
                                }
                                className="form-checkbox"
                            />
                            <span className="">Filter</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                name="sortable"
                                checked={newColumn.sortable || false}
                                onChange={(e) =>
                                    setNewColumn({...newColumn, sortable: e.target.checked})
                                }
                                className="form-checkbox"
                            />
                            <span className="ml-2">Sortable</span>
                        </label>
                    </div>
                    <button
                        onClick={handleAddColumn}
                        className="mt-2 bg-indigo-600 text-white font-semibold  shadow-md w-full"
                    >
                        Add Column
                    </button>
                </div>
            </CollapsibleSection>
            <CollapsibleSection
                isCollapsed={true}
                title="Existing Columns"
                className="w-full h-full"
            >
                <div className="overflow-auto h-[calc(100dvh-26em)]">
                    {columnDefs.map((column) => (
                        <div
                            key={column.colId}
                            className="mb-2 ml-1 border  shadow-sm text-black"
                        >
                            <button
                                onClick={() => handleRemoveColumn(+column.colId)}
                                className="float-right p-0"
                            >
                                <CloseIcon/>
                            </button>
                            <input
                                type="text"
                                name="field"
                                value={column.field}
                                onChange={(e) => handleColumnChange(e, +column.colId)}
                                className="mt-1 block w-full border-gray-300  shadow-sm mb-2 p-2"
                            />
                            <input
                                type="text"
                                name="headerName"
                                value={column.headerName}
                                onChange={(e) => handleColumnChange(e, +column.colId)}
                                className="mt-1 block w-full border-gray-300  shadow-sm mb-2 p-2"
                            />
                            <select
                                name="type"
                                value={column.type || ""}
                                onChange={(e) => handleColumnChange(e, +column.colId)}
                                className="mt-1 block w-full border-gray-300  shadow-sm mb-2 p-2"
                            >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="email">Email</option>
                                <option value="date">Date</option>
                            </select>
                            <div className="flex items-center mb-2">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="filter"
                                        checked={column.filter || false}
                                        onChange={(e) => handleColumnChange(e, +column.colId)}
                                        className="form-checkbox"
                                    />
                                    <span
                                        className="ml-2"
                                        style={{color: isDarkTheme ? "white" : "black"}}
                                    >
                    Filter
                  </span>
                                </label>
                                <label
                                    className="inline-flex items-center ml-4"
                                    style={{color: isDarkTheme ? "white" : "black"}}
                                >
                                    <input
                                        type="checkbox"
                                        name="sortable"
                                        checked={column.sortable || false}
                                        onChange={(e) => handleColumnChange(e, +column.colId)}
                                        className="form-checkbox"
                                    />
                                    <span className="ml-2">Sortable</span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </CollapsibleSection>
            <CollapsibleSection
                isCollapsed={true}
                title="JSON Representation"
                className="w-full h-full"
            >
        <pre className="overflow-auto h-[calc(100dvh-26em)]">
          {JSON.stringify(columnDefs, null, 2)}
        </pre>
            </CollapsibleSection>
        </div>
    );
};

export default GrcolIdCustomizer;
