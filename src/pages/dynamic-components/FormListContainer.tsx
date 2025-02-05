import React, { useState } from "react";
import { formDb } from "../../assets/formDb";
import CollapsibleSection from "../../components/common/CollapsableSection";
import FormDetail from "../../components/generator/FormDetail";

const FormList: React.FC = () => {
  const [activeForm, setActiveForm] = useState<number>(0);

  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full">
      <div className="w-full">
        <CollapsibleSection title="Dynamic Forms">
          <div className="w-full p-1 shadow-md ">
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
        {activeForm !== 0 && (
          <div style={{ height: "calc(100dvh - 13em)", overflow: "auto" }}>
            <FormDetail id={activeForm} setActiveForm={setActiveForm} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormList;
