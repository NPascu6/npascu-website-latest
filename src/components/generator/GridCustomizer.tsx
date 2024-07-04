import React, { useState } from "react";
import { ColumnDefinition } from "./DynamicTable";
import { useSelector } from "react-redux";
import CloseIcon from "../../assets/icons/CloseIcon";
import { RootState } from "../../store/store";
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
    columncolId: number
  ) => {
    const { name, value, type, checked } = e.target;
    setColumnDefs((prevDefs) =>
      prevDefs.map((column) =>
        column.colId === columncolId.toString()
          ? { ...column, [name]: type === "checkbox" ? checked : value }
          : column
      )
    );
  };

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  const handleAddColumn = () => {
    setColumnDefs((prevDefs) => [
      ...prevDefs,
      {
        ...newColumn,
        colId: (prevDefs.length + getRandomInt(10000000000000000)).toString(),
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

  const handleRemoveColumn = (columncolId: number) => {
    setColumnDefs((prevDefs) =>
      prevDefs.filter((column) => +column.colId !== columncolId)
    );
  };

  return (
    <div className="flex md:flex-row xs:flex-col items-center w-full justify-center">
      <CollapsibleSection title="Column Customizer">
        <div
          className="p-2 border rounded-md shadow-sm w-full"
          style={{
            overflow: "auto",
          }}
        >
          <div className="mb-4 flex flex-col">
            <input
              type="text"
              name="name"
              placeholder="Column Name"
              value={newColumn.field}
              onChange={(e) =>
                setNewColumn({ ...newColumn, field: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm mb-2 p-2"
            />
            <input
              type="text"
              name="header"
              placeholder="Column Header"
              value={newColumn.headerName}
              onChange={(e) =>
                setNewColumn({ ...newColumn, headerName: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm mb-2 p-2"
            />
            <select
              name="type"
              value={newColumn.type}
              onChange={(e) =>
                setNewColumn({ ...newColumn, type: e.target.value })
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm mb-2 p-2"
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
                  checked={newColumn.filter}
                  onChange={(e) =>
                    setNewColumn({ ...newColumn, filter: e.target.checked })
                  }
                  className="form-checkbox"
                />
                <span className="ml-2">Filter</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="checkbox"
                  name="sortable"
                  checked={newColumn.sortable}
                  onChange={(e) =>
                    setNewColumn({ ...newColumn, sortable: e.target.checked })
                  }
                  className="form-checkbox"
                />
                <span className="ml-2">Sortable</span>
              </label>
            </div>
            <button
              style={{
                justifySelf: "flex-end",
              }}
              onClick={handleAddColumn}
              className="mt-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md w-full"
            >
              Add Column
            </button>
          </div>
        </div>
      </CollapsibleSection>
      <CollapsibleSection title="Existing Columns">
        <div
          className="p-2 border rounded-md shadow-sm w-full"
          style={{
            overflow: "auto",
          }}
        >
          <h3 className="text-md font-semibold mb-2">Existing Columns</h3>
          <div
            style={{
              height: "calc(100dvh - 30em)",
              overflow: "auto",
            }}
          >
            {columnDefs.map((column) => (
              <div
                key={column.colId}
                className="mb-4 p-1 border rounded-md shadow-sm text-black"
              >
                <button
                  onClick={() => handleRemoveColumn(+column.colId)}
                  style={{
                    padding: 0,
                    float: "right",
                  }}
                >
                  <CloseIcon />
                </button>
                <input
                  type="text"
                  name="field"
                  value={column.field}
                  onChange={(e) => handleColumnChange(e, +column.colId)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm mb-2 p-2"
                />
                <input
                  type="text"
                  name="header"
                  value={column.headerName}
                  onChange={(e) => handleColumnChange(e, +column.colId)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm mb-2 p-2"
                />
                <select
                  name="type"
                  value={column.type}
                  onChange={(e) => handleColumnChange(e, +column.colId)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm mb-2 p-2"
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
                      checked={column.filter}
                      onChange={(e) => handleColumnChange(e, +column.colId)}
                      className="form-checkbox"
                    />
                    <span
                      className="ml-2"
                      style={{
                        color: isDarkTheme ? "white" : "black",
                      }}
                    >
                      Filter
                    </span>
                  </label>
                  <label
                    className="inline-flex items-center ml-4"
                    style={{
                      color: isDarkTheme ? "white" : "black",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="sortable"
                      checked={column.sortable}
                      onChange={(e) => handleColumnChange(e, +column.colId)}
                      className="form-checkbox"
                    />
                    <span className="ml-2">Sortable</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>
      <CollapsibleSection title="JSON Representation">
        <div
          className="p-2 border rounded-md shadow-sm w-full"
          style={{
            overflow: "auto",
          }}
        >
          <h3 className="text-md font-semibold">JSON Representation</h3>
          <pre
            className="p-2 rounded-lg overflow-x-auto"
            style={{
              height: "calc(100dvh - 30em)",
              overflow: "auto",
            }}
          >
            {JSON.stringify(columnDefs, null, 2)}
          </pre>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default GrcolIdCustomizer;
