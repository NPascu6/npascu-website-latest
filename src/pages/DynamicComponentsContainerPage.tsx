import React, { useState } from "react";
import DynamicTableContainer from "./dynamic-components/DynamicTableContainer";
import FormList from "./dynamic-components/FormListContainer";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const DynamicComponentsContainerPage = () => {
  const [activeTab, setActiveTab] = useState("form");
  const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-1 transition-colors ${
        isDarkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full rounded-lg shadow-xl transition-colors ${
          isDarkTheme ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-600">
          <button
            onClick={() => setActiveTab("form")}
            className={`flex-1 py-3 text-center font-semibold transition ${
              activeTab === "form"
                ? "border-b-4 border-indigo-500 text-indigo-400"
                : "text-gray-400 hover:text-indigo-300"
            }`}
          >
            📝 Form List
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`flex-1 py-3 text-center font-semibold transition ${
              activeTab === "table"
                ? "border-b-4 border-indigo-500 text-indigo-400"
                : "text-gray-400 hover:text-indigo-300"
            }`}
          >
            📊 Data Table
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "form" ? <FormList /> : <DynamicTableContainer />}
        </div>
      </div>
    </div>
  );
};

export default DynamicComponentsContainerPage;
