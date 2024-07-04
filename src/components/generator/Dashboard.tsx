import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DynamicTable from "./DynamicTable";
import { parseCSV } from "../../util";
import { tables } from "../../assets/tableDb";

interface Form {
  form_id: string;
  form_name: string;
}

const FormList: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);
  const [useTabs, setUseTabs] = useState<boolean>(false);
  const [selectedTableId, setSelectedTableId] = useState<number>(8);

  const handleTabClick = (tableId: number) => {
    ;
    setSelectedTableId(tableId);
  };

  const toggleView = () => {
    setUseTabs(!useTabs);
  };

  useEffect(() => {
    setLoading(true);
    fetch("./csvInPublicFolder.csv")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        setForms(parsedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching forms:", error);
        setLoading(false);
      });
  }, []);

  const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTableId(Number(event.target.value));
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full">
      {/* <div className="w-full md:w-1/3 p-2 shadow-md rounded-lg">
        <h1 className="text-xl font-bold mb-2">Select a Form</h1>
        <ul
          className="grid grid-cols-1"
          style={{ height: "calc(100dvh - 10em)", overflow: "auto" }}
        >
          {forms?.length > 0 &&
            forms?.map((form) => (
              <li key={form.form_id} className="p-1 border-b border-gray-300">
                <span>{form.form_id}. </span>
                <Link
                  to={`/form/${form.form_id}`}
                  className="text-indigo-600 hover:underline"
                >
                  {form.form_name}
                </Link>
              </li>
            ))}
        </ul>
        {loading && <p className="mt-4 text-gray-600">Loading...</p>}
      </div> */}
      <div className="w-full mt-2 md:mt-0 p-1">
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
        <div className="w-full">
          <DynamicTable tableId={selectedTableId} />
        </div>
      </div>
    </div>
  );
};

export default FormList;
