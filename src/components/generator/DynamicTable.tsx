import React, { useEffect, useState } from "react";
import GridCustomizer from "./GridCustomizer";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import AGGridComponent from "../ag-grid/AGGridComponent";
import { tables } from "../../assets/tableDb";
import CollapsibleSection from "../common/CollapsableSection";

export interface ColumnDefinition {
  colId: string;
  field: string;
  type?: string;
  headerName: string;
  filter?: boolean; // Adding optional filter property
  sortable?: boolean; // Adding optional sortable property
  actions?: boolean; // Adding optional actions property
}

export interface TableDefinition {
  id: number;
  table_name: string;
  table_definition: {
    columns: ColumnDefinition[];
  };
  data: any[];
}

interface DynamicTableProps {
  tableId: number;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ tableId }) => {
  const [columnDefs, setColumnDefs] = useState<ColumnDefinition[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);
  const [rowKey, setRowKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTableDefinition = () => {
      try {
        const response: any = tables.find((table) => table.id === tableId);

        setTimeout(() => {
          if (response) {
            const tableDefinition: TableDefinition = response;
            const columns = tableDefinition.table_definition.columns.map(
              (column: any) => ({
                colId: column.id,
                field: column.name,
                headerName: column.header,
                sortable: column.sortable || false,
                editable: column.type !== "text" ? true : false,
                cellRenderer: column.actions ? actionCellRenderer : undefined,
              })
            );
            const idColumn = columns.find((col) =>
              col.field.toLowerCase().includes("id")
            );
            setRowKey(idColumn ? idColumn.field : null);
            setColumnDefs(columns);
            setRowData(tableDefinition.data);
          } else {
            console.error("Failed to load table definition");
          }
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching table definition:", error);
      }
    };
    setColumnDefs([]);
    setRowData([]);
    setLoading(true);
    fetchTableDefinition();
  }, [tableId]);

  const actionCellRenderer = (params: any) => {
    return (
      <button onClick={() => alert(`Row data: ${JSON.stringify(params.data)}`)}>
        Action
      </button>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <div className="ag-theme-alpine">
          <AGGridComponent
            getColumnDefs={columnDefs}
            items={rowData}
            rowKey={rowKey}
            loading={loading}
          />
        </div>
      </div>
      <CollapsibleSection title="Column Customizing">
        <GridCustomizer columnDefs={columnDefs} setColumnDefs={setColumnDefs} />
      </CollapsibleSection>
    </div>
  );
};

export default DynamicTable;
