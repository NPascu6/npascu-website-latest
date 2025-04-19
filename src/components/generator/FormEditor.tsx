import React, {useState} from "react";
import {FormField} from "./FormDetail";

interface FormEditorProps {
    onAddField: (field: FormField) => void;
    formFields: FormField[];
    updateField: (field: FormField) => void;
}

const FormEditor: React.FC<FormEditorProps> = ({
                                                   onAddField,
                                                   formFields,
                                                   updateField,
                                               }) => {
    const [newField, setNewField] = useState<FormField>({
        id: 0,
        name: "",
        type: "text",
        placeholder: "",
        options: [],
        required: false,
    });
    const [editingField, setEditingField] = useState<FormField | null>(null);

    const handleFieldChange = (
        e: React.ChangeEvent<
            | HTMLInputElement
            | HTMLSelectElement
            | HTMLTextAreaElement
            | HTMLButtonElement
            | any
        >
    ): void => {
        const {name, value, type, checked} = e.target;
        if (name === "options") {
            // Convert the comma-separated string into an array
            const optionsArray = value
                .split(",")
                .map((opt: any) => opt.trim())
                .filter((opt: any) => opt !== "");
            setNewField((prevField) => ({
                ...prevField,
                options: optionsArray,
            }));
        } else {
            setNewField((prevField) => ({
                ...prevField,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleAddField = (): void => {
        onAddField({...newField, id: Date.now()});
        setNewField({
            id: 0,
            name: "",
            type: "text",
            placeholder: "",
            options: [],
            required: false,
        });
    };

    const handleEditField = (field: FormField): void => {
        setEditingField(field);
        setNewField(field);
    };

    const handleUpdateField = (): void => {
        if (editingField) {
            updateField(newField);
            setEditingField(null);
            setNewField({
                id: 0,
                name: "",
                type: "text",
                placeholder: "",
                options: [],
                required: false,
            });
        }
    };

    return (
        <div
            style={{
                maxHeight: "calc(100dvh - 22em)",
                overflow: "auto",
            }}
        >
            <h2 className="text-lg font-semibold mb-2">
                {editingField ? "Edit Field" : "Add New Field"}
            </h2>
            <div className="p-2">
                <div className="mb-2">
                    <label className="block text-sm font-medium">Field Name</label>
                    <input
                        type="text"
                        name="name"
                        value={newField.name}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full border-gray-300 shadow-sm"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Field Type</label>
                    <select
                        name="type"
                        value={newField.type}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full border-gray-300 shadow-sm"
                    >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="password">Password</option>
                        <option value="textarea">Textarea</option>
                        <option value="select">Select</option>
                        <option value="date">Date</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="radio">Radio</option>
                    </select>
                </div>
                {["select", "radio"].includes(newField.type) && (
                    <div className="mb-2">
                        <label className="block text-sm font-medium">
                            Options (comma separated)
                        </label>
                        <input
                            type="text"
                            name="options"
                            value={newField.options?.join(",") || ""}
                            onChange={handleFieldChange}
                            className="mt-1 block w-full border-gray-300 shadow-sm"
                        />
                    </div>
                )}
                <div className="mb-2">
                    <label className="block text-sm font-medium">Placeholder</label>
                    <input
                        type="text"
                        name="placeholder"
                        value={newField.placeholder}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full border-gray-300 shadow-sm"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Required</label>
                    <input
                        type="checkbox"
                        name="required"
                        checked={newField.required}
                        onChange={handleFieldChange}
                        className="mt-1"
                    />
                </div>
                {editingField ? (
                    <button
                        onClick={handleUpdateField}
                        className="mt-2 w-full bg-indigo-600 text-white font-semibold shadow-md"
                    >
                        Update Field
                    </button>
                ) : (
                    <button
                        onClick={handleAddField}
                        className="mt-2 w-full bg-indigo-600 text-white font-semibold shadow-md"
                    >
                        Add Field
                    </button>
                )}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Existing Fields</h3>
                    {formFields.map((field) => (
                        <div
                            key={field.id}
                            className="flex items-center justify-between mb-2 hover:bg-gray-100 hover:text-black p-2 rounded cursor-pointer transition duration-200"
                        >
              <span>
                {field.name} ({field.type})
              </span>
                            <button
                                onClick={() => handleEditField(field)}
                                className="text-blue-500"
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FormEditor;
