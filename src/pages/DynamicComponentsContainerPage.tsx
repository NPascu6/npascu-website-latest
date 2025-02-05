import React, { useState } from "react";
import DynamicTableContainer from "./dynamic-components/DynamicTableContainer";
import FormList from "./dynamic-components/FormListContainer";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import CloseIcon from "../assets/icons/CloseIcon";

const DynamicComponentsContainerPage = () => {
  const [activeTab, setActiveTab] = useState("form");
  const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);

  return (
    <div
      style={{ height: "calc(100vh - 6rem)", overflow: "auto" }}
      className={` flex flex-col transition-colors ${
        isDarkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center p-2 border-b">
        <h2 className="text-2xl font-semibold p-2">Dynamic Components</h2>
        <div className="cursor-pointer" onClick={() => window.history.back()}>
          <CloseIcon />
        </div>
      </div>
      <div
        className={` shadow-xl transition-colors ${
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
        <div
          className="p-6"
          style={{ height: "calc(100vh - 14rem)", overflow: "auto" }}
        >
          {activeTab === "form" ? <FormList /> : <DynamicTableContainer />}
        </div>
      </div>
    </div>
  );
};

export default DynamicComponentsContainerPage;
