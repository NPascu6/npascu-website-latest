import React, {CSSProperties, useCallback, useEffect, useMemo, useRef, useState,} from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./styles/iconStyles.css";
import {FilterChangedEvent, GetRowIdParams, GridApi, GridReadyEvent,} from "ag-grid-community";
import {AgGridReact} from "ag-grid-react";
import "./styles/gridStyles.css";
import {AGGridProps} from "./agProps";
import CustomFilterMenu from "./grid-components/CustomFilterMenu";
import CustomPagination from "./grid-components/CustomPagination";
import CustomTooltip from "./grid-components/CustomTooltip";
import CustomHeader from "./grid-components/CustomHeader";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";

const AGGridComponent = (props: AGGridProps) => {
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const gridRef = useRef<AgGridReact>(null);
    const [gridApi, setGridApi] = useState<GridApi | undefined>();
    const [filters, setFilters] = useState<any>({});
    const [paginationPageSize, setPaginationPageSize] = useState<number>(
        props.defaultRowsPerPage ?? 10
    );
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [paginationTotalPages, setPaginationTotalPages] = useState<number>(0);
    const [lastPageFound, setLastPageFound] = useState<boolean>(false);
    const [, setLastButtonDisabled] = useState<boolean>(false);

    const containerStyle: CSSProperties = useMemo(
        () => ({
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
        }),
        []
    );

    const gridStyle: CSSProperties = useMemo(
        () => ({
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
        }),
        []
    );

    const onColumnResized = useCallback(
        (event: any) => {
            if (gridApi) {
                gridApi.forEachNode((node) => {
                    gridApi.refreshCells({
                        rowNodes: [node],
                        force: true,
                        suppressFlash: true,
                    });
                });
            }
        },
        [gridApi]
    );

    const DefaultColumnDef = {
        enableCellChangeFlash: false,
        sortable: true,
        flex: 1,
        resizable: true,
        filter: CustomFilterMenu,
        cellRenderer: (params: any) => {
            if (!params?.value) return null;

            const cellValue = params.value.toString();
            const cellWidth = params.column?.actualWidth || 0;

            const tempSpan = document.createElement("span");
            tempSpan.innerText = cellValue;
            tempSpan.style.visibility = "hidden";
            document.body.appendChild(tempSpan);

            const cellContentWidth = tempSpan.offsetWidth > cellWidth - 30;

            document.body.removeChild(tempSpan);

            if (cellContentWidth) {
                return (
                    <span>
            <span style={{cursor: "pointer"}}>{cellValue}</span>
          </span>
                );
            } else {
                return <span>{cellValue}</span>;
            }
        },
        tooltipComponent: props.customTooltip ?? CustomTooltip,
        headerComponentParams: {
            filters: filters,
            headerStyle: props.headerComponentStyle ?? {},
            cancelFilterIcon: props.cancelFilterIcon ?? "fa-times",
            showHeaderFilterIcon: props.showHeaderFilterIcon ?? true,
            openFilterMenuOnHeaderClick: props.openFilterMenuOnHeaderClick ?? true,
        },
    };

    const getRowId = useCallback(
        (params: GetRowIdParams) => {
            return params.data[props.rowKey];
        },
        [props]
    );

    const onGridReady = useCallback(
        (params: GridReadyEvent) => {
            setGridApi(params.api);
            if (props.setGridApi) {
                props.setGridApi(params.api);
            }

            return () => {
                setGridApi(undefined);
            };
        },
        [props]
    );

    const onFilterChanged = useCallback((event: FilterChangedEvent) => {
        const existingFilters = event.api.getFilterModel();
        setFilters(existingFilters);
    }, []);

    const onFirstDataRendered = useCallback(
        (params: any) => {
            if (gridApi) {
                gridApi.sizeColumnsToFit();
            }

            return () => {
                if (gridApi) {
                    gridApi.destroy();
                    setGridApi(undefined);
                }
            };
        },
        [gridApi]
    );

    const components = useMemo<{
        [p: string]: any;
    }>(() => {
        return {
            agColumnHeader: props.customHeader ?? CustomHeader,
        };
    }, [props.customHeader]);

    const handleRowClick = useCallback(
        (event: any) => {
            if (props.onRowClick) {
                props.onRowClick(event);
            }
        },
        [props]
    );

    const onPaginationChanged: any = useCallback(() => {
        if (gridRef?.current?.api) {
            const paginationGetTotalPages =
                gridRef.current.api.paginationGetTotalPages();
            const paginationGetCurrentPage =
                gridRef.current.api.paginationGetCurrentPage();
            const paginationIsLastPageFound =
                gridRef.current.api.paginationIsLastPageFound();
            setPaginationTotalPages(paginationGetTotalPages);
            setCurrentPage(paginationGetCurrentPage + 1);
            setLastPageFound(paginationIsLastPageFound);
            setLastButtonDisabled(!paginationIsLastPageFound);
        }
    }, []);

    useEffect(() => {
        if (gridApi) {
            const tempfilters = gridApi.getFilterModel();
            setFilters(tempfilters);
        }
    }, [gridApi]);

    useEffect(() => {
        if (gridRef?.current?.api) {
            gridRef?.current?.api.redrawRows();
        }
    }, [props.selectedItem]);

    return (
        <div
            style={props.containerStyle ?? containerStyle}
            data-testid={"AgGrid-container"}
        >
            <div
                style={props?.gridStyle ?? gridStyle}
                className={isDarkTheme ? "ag-theme-alpine-dark" : "ag-theme-alpine"}
            >
                <AgGridReact
                    ref={gridRef}
                    animateRows={true}
                    ensureDomOrder={true}
                    cellFlashDuration={1}
                    onColumnResized={onColumnResized}
                    tooltipShowDelay={150}
                    getRowId={getRowId}
                    onGridReady={onGridReady}
                    onRowClicked={handleRowClick}
                    onFirstDataRendered={onFirstDataRendered}
                    onFilterChanged={props.onFilterChanged ?? onFilterChanged}
                    suppressMenuHide={props?.showHeaderFilterIcon ?? true}
                    columnDefs={props?.getColumnDefs}
                    rowData={props.items}
                    rowHeight={props.rowHeight ?? 30}
                    pagination={props?.showPagination ?? true}
                    suppressRowHoverHighlight={props?.suppressRowHoverHighlight ?? true}
                    suppressClickEdit={true}
                    suppressFocusAfterRefresh={true}
                    suppressCellFocus={true}
                    stopEditingWhenCellsLoseFocus={true}
                    suppressPaginationPanel={true}
                    paginationPageSize={paginationPageSize}
                    onPaginationChanged={onPaginationChanged}
                    defaultColDef={DefaultColumnDef}
                    components={components}
                    overlayLoadingTemplate={
                        props?.loadingMessage ??
                        '<span class="ag-overlay-loading-center">Please wait, loading...</span>'
                    }
                    overlayNoRowsTemplate={
                        props?.noRowsMessage ??
                        '<span style="padding: 10px;">No data.</span>'
                    }
                ></AgGridReact>
                {gridRef?.current?.api && props.items.length > 10 && (
                    <CustomPagination
                        divRef={gridRef}
                        pageSize={paginationPageSize}
                        setPaginationPageSize={setPaginationPageSize}
                        currentPage={currentPage}
                        totalPages={paginationTotalPages}
                        lastPageFound={lastPageFound}
                    />
                )}
            </div>
        </div>
    );
};

export default AGGridComponent;
