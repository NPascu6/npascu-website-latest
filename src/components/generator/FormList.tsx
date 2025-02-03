import React, { useState } from "react";
import DynamicTable from "./DynamicTable";
import { tables } from "../../assets/tableDb";
import { formDb } from "../../assets/formDb";
import FormDetail from "./FormDetail";
import CollapsibleSection from "../common/CollapsableSection";
import CloseIcon from "../../assets/icons/CloseIcon";

const FormList: React.FC = () => {
  const [useTabs, setUseTabs] = useState<boolean>(false);
  const [selectedTableId, setSelectedTableId] = useState<number | undefined>(
    undefined
  );
  const [activeForm, setActiveForm] = useState<number>(0);

  const handleTabClick = (tableId: number): void => {
    setSelectedTableId(tableId);
  };

  const toggleView = (): void => {
    setUseTabs((prev) => !prev);
  };

  const handleTableChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedTableId(Number(e.target.value));
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full">
      {!selectedTableId && (
        <div className="w-full">
          <CollapsibleSection title="Dynamic Forms">
            <div className="w-full p-1 shadow-md rounded-lg">
              <h1 className="text-md font-bold mb-2">Select a Form</h1>
              <ul className="grid grid-cols-1 w-full">
                {formDb?.length > 0 &&
                  formDb.map((form) => (
                    <li
                      key={form.id}
                      onClick={() => setActiveForm(form.id)}
                      className="flex items-center w-full p-1 border-b border-gray-300 cursor-pointer"
                    >
                      <span className="text-xs">{form.id}. </span>
                      <span className="text-xs text-indigo-600 hover:underline">
                        {form.form_name}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </CollapsibleSection>
        </div>
      )}

      <div className="w-full mt-1 md:mt-0">
        {activeForm !== 0 ? (
          <div style={{ height: "calc(100dvh - 13em)", overflow: "auto" }}>
            <FormDetail id={activeForm} setActiveForm={setActiveForm} />
          </div>
        ) : (
          <CollapsibleSection title="Dynamic Table Data">
            <div className="flex flex-col md:flex-row justify-between items-center w-full mb-1">
              <div className="flex items-center">
                <h1 className="text-sm font-semibold mx-2">
                  Dynamic Tables with AG Grid
                </h1>
                {selectedTableId && (
                  <button
                    onClick={() => setSelectedTableId(undefined)}
                    className="p-1 rounded-md shadow-md mx-2"
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>

              <button
                onClick={toggleView}
                className="px-2 mt-2 text-xs font-semibold rounded-md shadow-md mx-2"
              >
                {useTabs ? "Switch to Dropdown" : "Switch to Tabs"}
              </button>
            </div>
            {useTabs ? (
              <div className="border-b border-gray-200 mb-2">
                <ul
                  className="flex space-x-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                  style={{ maxWidth: "100%" }}
                >
                  {tables.map((table) => (
                    <li
                      key={table.id}
                      onClick={() => handleTabClick(table.id)}
                      className={`cursor-pointer px-1 py-1 whitespace-nowrap ${
                        selectedTableId === table.id
                          ? "text-black font-bold bg-gray-400"
                          : "text-gray-500 hover:text-blue-500"
                      }`}
                    >
                      {table.table_name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <select
                onChange={handleTableChange}
                value={selectedTableId}
                className="w-4/6 border shadow-sm text-black p-1 rounded-md"
              >
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.table_name} ({table.data.length} items)
                  </option>
                ))}
              </select>
            )}
            {selectedTableId && <DynamicTable tableId={selectedTableId} />}
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
};

export default FormList;
