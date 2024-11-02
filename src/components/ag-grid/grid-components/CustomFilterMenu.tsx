import React, {useEffect, useRef, useState} from "react";
import {IFilterParams} from "ag-grid-community";
import {dateTimeValueFormatter} from "./helpers";
import {checkIsDate} from "./customFilterMenuComponents/util";
import FilterAscending from "./customFilterMenuComponents/buttons/FilterAscending";
import FilterDescending from "./customFilterMenuComponents/buttons/FilterDescending";

const CustomFilterMenu = (props: IFilterParams) => {
    const [filterText, setFilterText] = useState<string | undefined>(undefined);
    const [filterValues, setFilterValues] = useState<string[]>(["All"]);
    const [localItems, setLocalItems] = useState<any[]>([]);
    const [colId, setColId] = useState<string>("");

    const filterMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (props.colDef?.field) {
            setColId(props.colDef?.field);
        }
    }, [props.colDef.field]);

    useEffect(() => {
        const tempItems: Array<any> = [];
        if (colId) {
            props.api.forEachNode(function (node) {
                const tempItem = {...node.data};
                tempItems.push(tempItem);
            });
            setLocalItems(tempItems);
        }
    }, [props.api, colId]);

    useEffect(() => {
        if (filterText) {
            applyQuickFilter([filterText]);
        } else {
            props.api.setFilterModel(null);
        }
    }, [filterText, props.api]);

    const handleFilterChange = (evt: any, checked: boolean) => {
        evt.preventDefault();
        evt.stopPropagation();

        props.filterChangedCallback();

        if (!filterValues.includes("All") && evt.currentTarget.value === "All") {
            setFilterValues(["All"]);
            props.api.setFilterModel(null);
        } else {
            const newFilterValues = checked
                ? [...filterValues, evt.currentTarget.value]
                : filterValues.filter(
                    (filterValue) => filterValue !== evt.currentTarget.value
                );
            setFilterValues(
                newFilterValues.filter((filterValue) => filterValue !== "All")
            );
            applyQuickFilter(newFilterValues);
        }
    };

    const applyQuickFilter = (filterValues: string[]) => {
        const quickFilterText = filterValues.includes("All")
            ? ""
            : filterValues.join(" ");
        props.api.setFilterModel({
            [colId]: {
                filterType: "text",
                type: "contains",
                filter: quickFilterText,
            },
        });
    };

    const onSortRequested = (
        order: "desc" | "asc" | undefined,
        newColId: string
    ) => {
        props.api.applyColumnState({
            state: [{colId: newColId, sort: order}],
            applyOrder: true,
        });
    };

    const onChange = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        setFilterText(event.target.value);
    };

    const handleClearFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        props.api.applyColumnState({
            state: [{colId: colId, sort: undefined}],
            applyOrder: true,
        });
        setFilterValues([]);
        setFilterText("");
        props.api.setFilterModel(null);
    };

    useEffect(() => {
        if (filterValues?.length === 0 && localItems?.length > 0) {
            props.api.setFilterModel(null);
        }
    }, [filterValues, localItems, props.api]);

    return (
        <div
            ref={filterMenuRef}
            data-testid={"custom-ag-filter-menu"}
            className="custom-ag-filter-menu"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div className="flex items-center justify-between">
                <FilterAscending
                    filterActive={"asc"}
                    hover={""}
                    colId={colId}
                    setHover={() => {
                    }}
                    onSortRequested={onSortRequested}
                />
                <FilterDescending
                    filterActive={"desc"}
                    hover={""}
                    colId={colId}
                    setHover={() => {
                    }}
                    onSortRequested={onSortRequested}
                />
            </div>
            <div className="mt-2">
                <input
                    value={filterText ?? ""}
                    onChange={onChange}
                    placeholder="Search a value..."
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="mt-2">
                <div className="overflow-y-auto max-h-48">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={filterValues.includes("All")}
                            value={"All"}
                            onChange={(e) => handleFilterChange(e, e.target.checked)}
                        />
                        <label className="ml-2">All</label>
                    </div>
                    {props?.colDef?.field !== undefined &&
                        localItems
                            ?.filter(
                                (obj, index) =>
                                    props?.colDef?.field &&
                                    localItems.findIndex(
                                        (item) =>
                                            item[props?.colDef?.field ?? 0] ===
                                            obj[props?.colDef?.field ?? 0]
                                    ) === index
                            )
                            .map((item: any, index) => (
                                <div key={index} className="flex items-center mt-2">
                                    <input
                                        type="checkbox"
                                        checked={filterValues.includes(item[colId])}
                                        value={item[colId]}
                                        onChange={(e) => handleFilterChange(e, e.target.checked)}
                                    />
                                    <label className="ml-2">
                                        {checkIsDate(item[colId])
                                            ? dateTimeValueFormatter({value: item[colId]})
                                            : item[colId]}
                                    </label>
                                </div>
                            ))}
                </div>
            </div>
            <div className="mt-4">
                <button
                    id="filter-menu-button"
                    disabled={!filterText}
                    onClick={handleClearFilter}
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Clear Filter
                </button>
            </div>
        </div>
    );
};

export default CustomFilterMenu;
