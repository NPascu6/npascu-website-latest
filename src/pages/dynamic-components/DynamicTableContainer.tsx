import { useState } from "react";
import { tables } from "../../assets/tableDb";
import DynamicTable from "../../components/generator/DynamicTable";

const DynamicTableContainer = () => {
  const [useTabs, setUseTabs] = useState<boolean>(false);
  const [selectedTableId, setSelectedTableId] = useState<number | undefined>(1);
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
    <div className="w-full mt-1 md:mt-0">
      <div className="flex justify-center items-center w-full mb-4 text-center">
        <button
          onClick={toggleView}
          className=" text-xs font-semibold  shadow-md"
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
          className="w-full border shadow-sm text-black mt-1 mb-2"
        >
          {tables.map((table) => (
            <option key={table.id} value={table.id}>
              {table.table_name} ({table.data.length} items)
            </option>
          ))}
        </select>
      )}
      {selectedTableId && <DynamicTable tableId={selectedTableId} />}
    </div>
  );
};

export default DynamicTableContainer;
