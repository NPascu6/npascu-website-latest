import React, { useState } from "react";
import DynamicTable from "./DynamicTable";
import { tables } from "../../assets/tableDb";
import { formDb } from "../../assets/formDb";
import FormDetail from "./FormDetail";
import CollapsibleSection from "../common/CollapsableSection";

const FormList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [useTabs, setUseTabs] = useState<boolean>(false);
  const [selectedTableId, setSelectedTableId] = useState<number>(8);
  const [activeForm, setActiveForm] = useState<number>(0);

  const handleTabClick = (tableId: number) => {
    setSelectedTableId(tableId);
  };

  const toggleView = () => {
    setUseTabs(!useTabs);
  };

  const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTableId(Number(event.target.value));
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full">
      <div className="w-full">
        <CollapsibleSection title="Select a Form">
          <div className="w-full p-1 shadow-md rounded-lg">
            <h1 className="text-md font-bold mb-2">Select a Form</h1>
            <ul className="grid grid-cols-1 w-full">
              {formDb?.length > 0 &&
                formDb?.map((form) => (
                  <li
                    onClick={() => setActiveForm(form.id)}
                    key={form.id}
                    className="flex items-center w-full p-1 border-b border-gray-300"
                  >
                    <span className="text-xs">{form.id}. </span>
                    <span className="text-xs text-indigo-600 hover:underline">
                      {form.form_name}
                    </span>
                  </li>
                ))}
            </ul>
            {loading && <p className="mt-4 text-gray-600">Loading...</p>}
          </div>
        </CollapsibleSection>
      </div>

      <div className="w-full mt-2 md:mt-0 p-1 ml-1">
        {activeForm === 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
            <h1 className="text-xl font-semibold mr-2">
              Dynamic Tables with AG Grid
            </h1>
            <button
              onClick={toggleView}
              className="px-2 py-1 font-semibold rounded-md shadow-md"
            >
              {useTabs ? "Switch to Dropdown" : "Switch to Tabs"}
            </button>
          </div>
        )}
        {activeForm === 0 && (
          <>
            {useTabs ? (
              <div className="border-b border-gray-200 mb-4">
                <ul
                  className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                  style={{ maxWidth: "100%" }}
                >
                  {tables.map((table) => (
                    <li
                      key={table.id}
                      className={`cursor-pointer px-2 py-2 whitespace-nowrap ${
                        selectedTableId === table.id
                          ? "text-black font-bold bg-gray-400"
                          : "text-gray-500 hover:text-blue-500"
                      }`}
                      onClick={() => handleTabClick(table.id)}
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
                className="mb-4 border rounded-md shadow-sm w-full text-black"
              >
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.table_name}
                    <span>: {table.data.length} items in table.</span>
                  </option>
                ))}
              </select>
            )}
          </>
        )}

        {activeForm !== 0 ? (
          <div style={{ height: "calc(100dvh - 13em)", overflow: "auto" }}>
            <FormDetail id={activeForm} setActiveForm={setActiveForm} />
          </div>
        ) : (
          <div className="w-full">
            <DynamicTable tableId={selectedTableId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormList;
