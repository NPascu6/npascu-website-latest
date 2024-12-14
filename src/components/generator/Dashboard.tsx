import React, { useState } from "react";
import DynamicTable from "./DynamicTable";
import { tables } from "../../assets/tableDb";
import { formDb } from "../../assets/formDb";
import FormDetail from "./FormDetail";
import CollapsibleSection from "../common/CollapsableSection";
import CloseIcon from "../../assets/icons/CloseIcon";

const FormList: React.FC = () => {
  const [loading] = useState(false);
  const [useTabs, setUseTabs] = useState<boolean>(false);
  const [selectedTableId, setSelectedTableId] = useState<number>();
  const [activeForm, setActiveForm] = useState<number | null>(0);

  const handleTabClick = (tableId: number) => {
    setSelectedTableId(tableId);
  };

  const toggleView = () => {
    setUseTabs(!useTabs);
  };

  const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTableId(Number(event.target.value));
  };

  const handleCollapse = () => {
    setSelectedTableId(undefined);
    setActiveForm(null);
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full">
      {!selectedTableId && (
        <div className="w-full">
          <CollapsibleSection
            setCollapsed={handleCollapse}
            title="Dynamic Forms"
          >
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
      )}

      <div className="w-full mt-1 md:mt-0">
        {activeForm !== 0 ? (
          <div style={{ height: "calc(100dvh - 22em)", overflow: "auto" }}>
            <FormDetail id={activeForm} setActiveForm={setActiveForm} />
          </div>
        ) : (
          <CollapsibleSection title="Dynamic Table Data">
            {activeForm === 0 && (
              <div className="flex flex-col md:flex-row justify-between items-center w-full mb-1">
                <h1 className="text-lg font-semibold mr-2 ml-2">
                  Dynamic Tables with AG Grid
                </h1>
                <button
                  onClick={toggleView}
                  className="px-1 text-sm font-semibold rounded-md shadow-md mr-2"
                >
                  {useTabs ? "Switch to Dropdown" : "Switch to Tabs"}
                </button>
                <button
                  style={{ alignSelf: "flex-end", marginBottom: "4em" }}
                  type="button"
                  className="font-semibold rounded-md hover:bg-gray-400 mr-2
                                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  onClick={() => setActiveForm(0)}
                >
                  <CloseIcon />
                </button>
              </div>
            )}
            {activeForm === 0 && (
              <>
                {useTabs ? (
                  <div className="border-b border-gray-200 mb-2">
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
                    className="w-4/6 border shadow-sm text-black"
                  >
                    {tables.map((table) => (
                      <option key={table.id} value={table.id}>
                        {table.table_name}
                        {table.data.length} items in table.
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
            {selectedTableId && <DynamicTable tableId={selectedTableId} />}
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
};

export default FormList;
