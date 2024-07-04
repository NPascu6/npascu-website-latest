import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CheckboxInput from "./inputs/CheckboxInput";
import RadioInput from "./inputs/RadioInput";
import SelectInput from "./inputs/SelectInput";
import DateInput from "./inputs/DateInput";
import FormEditor from "./FormEditor";
import FormPreview from "./FormPreview";
import { formatFieldToUpperCaseAndBreakCammelCase } from "../../util";
import InputField from "./inputs/InputField";
import CloseIcon from "../../assets/icons/CloseIcon";

export interface FormField {
  id: string;
  name: string;
  type: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

const FormDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [formName, setFormName] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/forms/${id}`)
      .then((response) => {
        setFormName(response.data.form_name);
        setFormFields(response.data.form_definition.fields);
      })
      .catch((error) => {
        console.error("Error fetching form fields:", error);
      });
  }, [id]);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<any> | string,
    key?: any,
    type?: string
  ) => {
    if (typeof e === "string") {
      setFormData({ ...formData, [key]: e });
      return;
    }

    const name = key || e.target.name;
    const value =
      type === "checkbox"
        ? e.target.checked
        : type === "date"
        ? e
        : e.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (!value && formFields.find((field) => field.name === name)?.required) {
      setErrors({
        ...errors,
        [name]: `${name} is required`,
      });
    } else {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    formFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        isValid = false;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field.name]: `${formatFieldToUpperCaseAndBreakCammelCase(
            field.name
          )} is required`,
        }));
      }
    });
    setIsValid(isValid);
  };

  const handleSubmit = (e: React.FormEvent) => {
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

  const renderInput = (field: FormField) => {
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

  const addFieldToForm = (newField: FormField) => {
    setFormFields((prevFields) => [...prevFields, newField]);
  };

  const updateFieldInForm = (updatedField: FormField) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      )
    );
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          border: "1px solid #e2e8f0",
        }}
        className="max-w-2xl mr-6 ml-6 w-full p-8 shadow-md rounded-lg"
      >
        <button
          style={{ alignSelf: "flex-end" }}
          type="button"
          className=" font-semibold rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          onClick={() => navigate(-1)}
        >
          <CloseIcon />
        </button>
        <form onSubmit={handleSubmit} className="flex-1">
          <h1 className="text-xl font-bold mb-4">{formName}</h1>
          <div className="grid grid-cols-2 gap-6 mt-4">
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
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={!isValid}
              className={`py-2 px-4 ${
                isValid
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <FormEditor
        onAddField={addFieldToForm}
        formFields={formFields}
        updateField={updateFieldInForm}
      />
      <FormPreview formFields={formFields} setFormFields={setFormFields} />
    </div>
  );
};

export default FormDetail;
