import React, {useState} from "react";
import {FormField} from "./FormDetail";

interface FormJSONEditorProps {
    formFields: FormField[];
    setFormFields: React.Dispatch<React.SetStateAction<FormField[]>>;
}

const FormJSONEditor: React.FC<FormJSONEditorProps> = ({
                                                           formFields,
                                                           setFormFields,
                                                       }) => {
    const [editingField, setEditingField] = useState<FormField | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        fieldId: number | null
    ): void => {
        const {name, value} = e.target;
        setFormFields((prevFields) =>
            prevFields.map((field) =>
                field.id === fieldId ? {...field, [name]: value} : field
            )
        );
    };

    const handleSaveField = (): void => {
        setEditingField(null);
    };

    const handleEditField = (field: FormField): void => {
        setEditingField(field);
    };

    return (
        <div className="shadow-md  border border-gray-300 h-[calc(100dvh-8em)] overflow-auto w-full">
            <h2 className="text-md font-semibold mb-2">Form JSON Editor</h2>
            <pre className="p-2  overflow-x-auto">
        {JSON.stringify({fields: formFields}, null, 2)}
      </pre>
            {formFields.map((field) => (
                <div key={field.id} className="mt-2">
                    {editingField?.id === field.id ? (
                        <div>
                            <label className="block text-sm font-medium">
                                Edit Field: {field.name}
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={field.name}
                                onChange={(e) => handleChange(e, field.id)}
                                className="mt-1 block w-full border-gray-300  shadow-sm"
                            />
                            <input
                                type="text"
                                name="placeholder"
                                value={field.placeholder}
                                onChange={(e) => handleChange(e, field.id)}
                                className="mt-1 block w-full border-gray-300  shadow-sm"
                            />
                            <input
                                type="text"
                                name="type"
                                value={field.type}
                                onChange={(e) => handleChange(e, field.id)}
                                className="mt-1 block w-full border-gray-300  shadow-sm"
                            />
                            {(field.type === "select" || field.type === "radio") && (
                                <textarea
                                    name="options"
                                    value={field.options?.join(",") || ""}
                                    onChange={(e) => handleChange(e, field.id)}
                                    className="mt-1 block w-full border-gray-300  shadow-sm"
                                />
                            )}
                            <button
                                onClick={handleSaveField}
                                className="mt-2 py-2 px-4 bg-indigo-600 text-white font-semibold  shadow-md"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div>
              <span>
                {field.name} ({field.type})
              </span>
                            <button
                                onClick={() => handleEditField(field)}
                                className="ml-2 text-blue-500"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FormJSONEditor;
