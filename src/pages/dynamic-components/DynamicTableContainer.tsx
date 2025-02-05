import { useState } from "react";
import CloseIcon from "../../assets/icons/CloseIcon";
import { tables } from "../../assets/tableDb";
import CollapsibleSection from "../../components/common/CollapsableSection";
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
      {
        <CollapsibleSection title="Dynamic Table Data">
          <div className="flex justify-center items-center w-full mb-4 text-center">
            <button
              onClick={toggleView}
              className="px-2 mt-2 text-xs font-semibold  shadow-md mx-2"
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
              className="w-4/6 border shadow-sm text-black p-1 "
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
      }
    </div>
  );
};

export default DynamicTableContainer;
