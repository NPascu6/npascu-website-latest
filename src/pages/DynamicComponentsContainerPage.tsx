import React, {useState} from "react";
import DynamicTableContainer from "./dynamic-components/DynamicTableContainer";
import FormList from "./dynamic-components/FormListContainer";
import {useSelector} from "react-redux";
import {RootState} from "../store/store";
import CloseIcon from "../assets/icons/CloseIcon";
import {useNavigate} from "react-router-dom";

const DynamicComponentsContainerPage = () => {
    const [activeTab, setActiveTab] = useState("form");
    const isDarkTheme = useSelector((state: RootState) => state.app.isDarkTheme);
    const navigate = useNavigate();
    return (
        <div
            style={{
                height: "calc(100vh - 6rem)",
                overflow: "auto",
                display: "flex",
            }}
            className={` flex flex-col justify-start items-center transition-colors ${
                isDarkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
            }`}
        >
            <div className="flex justify-between items-center p-2 w-full">
                <h2 className="text-2xl font-semibold p-1"></h2>
                <div className="cursor-pointer" onClick={() => navigate("/")}>
                    <CloseIcon/>
                </div>
            </div>
            <div
                style={{width: "94%"}}
                className={`  shadow-xl  ${isDarkTheme ? "bg-gray-800" : "bg-white"}`}
            >
                {/* Tab Navigation */}
                <div className="flex">
                    <button
                        onClick={() => setActiveTab("form")}
                        className={`flex-1 py-3 text-center font-semibold transition ${
                            activeTab === "form"
                                ? "border-b-2"
                                : "text-gray-400 hover:text-gray-300"
                        }`}
                    >
                        📝 Form List
                    </button>
                    <button
                        onClick={() => setActiveTab("table")}
                        className={`flex-1 py-3 text-center font-semibold transition ${
                            activeTab === "table"
                                ? "border-b-2"
                                : "text-gray-400 hover:text-gray-300"
                        }`}
                    >
                        📊 Data Table
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-1">
                    {activeTab === "form" ? <FormList/> : <DynamicTableContainer/>}
                </div>
            </div>
        </div>
    );
};

export default DynamicComponentsContainerPage;
