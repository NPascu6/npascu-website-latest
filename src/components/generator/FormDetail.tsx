import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CheckboxInput from "./inputs/CheckboxInput";
import RadioInput from "./inputs/RadioInput";
import SelectInput from "./inputs/SelectInput";
import DateInput from "./inputs/DateInput";
import FormEditor from "./FormEditor";
import FormPreview from "./FormPreview";
import { formatFieldToUpperCaseAndBreakCammelCase } from "../../util";
import InputField from "./inputs/InputField";
import CloseIcon from "../../assets/icons/CloseIcon";
import { formDb } from "../../assets/formDb";
import CollapsibleSection from "../common/CollapsableSection";

export interface FormField {
  id: number | null;
  name: string;
  type: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface FormDetailProps {
  id: number | null;
  setActiveForm: (id: number | null) => void;
}

const FormDetail: React.FC<FormDetailProps> = ({ id, setActiveForm }) => {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [formName, setFormName] = useState<string>("");

  useEffect(() => {
    const form = formDb.find((f) => f.id === id);
    if (form) {
      setFormName(form.form_name);
      setFormFields(form.form_definition.fields);
    }
  }, [id]);

  useEffect(() => {
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<any> | string,
    key?: string,
    type?: string
  ): void => {
    if (typeof e === "string") {
      setFormData({ ...formData, [key!]: e });
      return;
    }
    const name: string = key || e.target.name;
    const value =
      type === "checkbox"
        ? e.target.checked
        : type === "date"
        ? e
        : e.target.value;

    setFormData({ ...formData, [name]: value });

    const field = formFields.find((f) => f.name === name);
    if (field?.required && !value) {
      setErrors({ ...errors, [name]: `${name} is required` });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): void => {
    let valid = true;
    formFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        valid = false;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field.name]: `${formatFieldToUpperCaseAndBreakCammelCase(
            field.name
          )} is required`,
        }));
      }
    });
    setIsValid(valid);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!isValid) {
      setValidationMessage("Please fill all required fields.");
      return;
    }
    axios
      .post(`/api/forms/${id}/submit`, formData)
      .then((response) => {
        console.log("Form submitted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  const renderInput = (field: FormField): JSX.Element | null => {
    const value = formData[field.name] || "";
    const commonProps = {
      id: field.name,
      field,
      type: field.type,
      placeholder: field.placeholder,
      options: field.options,
      value,
      required: field.required,
      onChange: handleChange,
    };

    switch (field.type) {
      case "text":
      case "number":
      case "email":
      case "password":
        return <InputField {...commonProps} />;
      case "textarea":
        return <InputField {...commonProps} type="textarea" />;
      case "select":
        return <SelectInput {...commonProps} />;
      case "date":
        return <DateInput {...commonProps} />;
      case "checkbox":
        return <CheckboxInput {...commonProps} />;
      case "radio":
        return <RadioInput {...commonProps} />;
      default:
        return null;
    }
  };

  const addFieldToForm = (newField: FormField): void => {
    setFormFields((prevFields) => [...prevFields, newField]);
  };

  const updateFieldInForm = (updatedField: FormField): void => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      )
    );
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      {id && (
        <div className="w-full p-2 shadow-md border border-gray-300 mx-2">
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">{formName}</h1>
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="self-end p-1  hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5 mt-4">
              {formFields.map((field) => (
                <div key={field.id} className="relative">
                  {renderInput(field)}
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {validationMessage && (
              <p className="text-red-500 text-xs mt-1">{validationMessage}</p>
            )}
            {id && (
              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`py-2 px-4 text-white font-semibold  shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isValid
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit
                </button>
              </div>
            )}
          </form>
        </div>
      )}
      <div className="flex flex-row w-full mt-4">
        {id && (
          <CollapsibleSection
            className="w-full mr-4"
            title="Form Builder"
            isCollapsed={true}
          >
            <FormEditor
              onAddField={addFieldToForm}
              formFields={formFields}
              updateField={updateFieldInForm}
            />
          </CollapsibleSection>
        )}
        {id && (
          <CollapsibleSection
            className="w-full"
            title="Form Preview"
            isCollapsed={true}
          >
            <FormPreview
              formFields={formFields}
              setFormFields={setFormFields}
            />
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
};

export default FormDetail;
