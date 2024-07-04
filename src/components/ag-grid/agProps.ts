import { ColDef, ColGroupDef, GridApi, RowStyle, ITooltipParams, FilterChangedEvent, CellEditingStartedEvent, CellEditingStoppedEvent } from "ag-grid-community";
import { CSSProperties } from "react";

/**
 * Aggrid props
 * @param items: any[] - data to be displayed in the grid
 * @param rowStyle?: React.CSSProperties - style for the row
 * @param getColumnDefs: (ColDef | ColGroupDef)[] - column definitions for the grid
 * @param rowKey: string - key for the row
 * @param onRowSelected?: any - callback for row selection
 * @param showPagination?: boolean - show pagination
 * @param defaultRowsPerPage?: number - default rows per page
 * @param loadingMessage?: string - loading message
 * @param gridStyle?: React.CSSProperties - style for the grid
 * @param containerStyle?: React.CSSProperties - style for the container
 * @param tooltipField?: string - field for the tooltip
 * @param rowHeight?: number - row height
 * @param cancelFilterIcon?: any - cancel filter icon
 * @param suppressMenu?: boolean - suppress menu
 * @param showLoadingOverlay?: boolean - show loading overlay
 * @param enableRangeSelection?: boolean - enable range selection
 * @param showHeaderFilterIcon?: boolean - show header filter icon
 * @param noRowsMessage?: string - no rows message
 * @param openFilterMenuOnHeaderClick?: boolean - open filter menu on header click
 * @param customTooltip?: (params: ITooltipParams) => JSX.Element - custom tooltip
 * @param customHeader?: (props: ITooltipParams & { color: string }) => JSX.Element - custom header
 * @param onFilterChanged?: (event: FilterChangedEvent) => void - callback for filter change
 * @param onCellEditingStarted?: (event: CellEditingStartedEvent) => void - callback for cell editing started
 * @param onCellEditingStopped?: (event: CellEditingStoppedEvent) => void - callback for cell editing stopped
 * @param headerComponentStyle?: CSSProperties - style for the header component
 * @param maxBodyHeight?: string - max body height
 */
export interface AGGridProps {
    items: any[];
    getColumnDefs: (ColDef | ColGroupDef)[];
    gridApi?: GridApi;
    setGridApi?: any;
    rowStyle?: RowStyle;
    rowKey: any;
    disableSelection?: boolean;
    onRowSelected?: any
    loading?: boolean;
    enableCellFlash?: boolean;
    showPagination?: boolean;
    defaultRowsPerPage?: number;
    loadingMessage?: string;
    gridStyle?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    tooltipField?: string;
    rowHeight?: number;
    cancelFilterIcon?: any;
    suppressMenu?: boolean;
    showLoadingOverlay?: boolean;
    enableRangeSelection?: boolean;
    showHeaderFilterIcon?: boolean;
    noRowsMessage?: string;
    openFilterMenuOnHeaderClick?: boolean;
    headerComponentStyle?: CSSProperties;
    selectedItem?: any;
    onRowClick?: (event: any) => void;
    customTooltip?: (params: ITooltipParams) => React.JSX.Element;
    customHeader?: (props: ITooltipParams & {
        color: string;
    }) => React.JSX.Element;
    onFilterChanged?: (event: FilterChangedEvent) => void;
    onCellEditingStarted?: (event: CellEditingStartedEvent) => void;
    onCellEditingStopped?: (event: CellEditingStoppedEvent) => void;
    suppressRowHoverHighlight?: boolean;
    maxBodyHeight?: string;
}