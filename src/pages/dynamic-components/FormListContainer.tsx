import React, { useState } from "react";
import { formDb } from "../../assets/formDb";
import CollapsibleSection from "../../components/common/CollapsableSection";
import FormDetail from "../../components/generator/FormDetail";

const FormList: React.FC = () => {
  const [activeForm, setActiveForm] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full">
      <div className="w-full">
        <CollapsibleSection
          title="Dynamic Forms"
          isCollapsed={collapsed}
          setCollapsed={setCollapsed} // Pass setCollapsed
        >
          <div className="w-full p-1 shadow-md">
            <h1 className="text-md font-bold mb-2">Select a Form</h1>
            <ul className="grid grid-cols-1 w-full">
              {formDb?.length > 0 &&
                formDb.map((form) => (
                  <li
                    key={form.id}
                    onClick={() => {
                      setActiveForm(form.id);
                      setCollapsed(true); // Collapse section when selecting a form
                    }}
                    className="flex items-center w-full p-1 border-b border-gray-300 cursor-pointer hover:bg-gray-100 transition-all"
                  >
                    <span className="text-xs">{form.id}. </span>
                    <span className="text-xs text-indigo-600 hover:underline">
                      {form.form_name}
                    </span>
                    f
                  </li>
                ))}
            </ul>
          </div>
        </CollapsibleSection>

        {/* Show FormDetail only if a form is selected */}
        {activeForm !== null && (
          <FormDetail id={activeForm} setActiveForm={setActiveForm} />
        )}
      </div>
    </div>
  );
};

export default FormList;
