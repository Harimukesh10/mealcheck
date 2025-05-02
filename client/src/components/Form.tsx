import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiAccountCircleFill } from "react-icons/ri";
import { MdLogin } from "react-icons/md";
import { MdError } from "react-icons/md";

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "dropdown" | "textarea";
  options?: string[]; // For dropdowns
  placeholder?: string;
  validation?: (value: string) => string | null; // Validation function
}

interface FormProps {
  fields: FormField[];
  onSubmit: (formData: Record<string, string>) => void;
  submitButtonLabel?: string;
  formLabel: string;
  formWidth: string;
}

const Form: React.FC<FormProps> = ({ fields, onSubmit, submitButtonLabel = "Submit", formLabel = 'Login', formWidth = '400px' }) => {
  const formDataRef = useRef<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    formDataRef.current[name] = value;

    // Validate the field on change
    const field = fields.find((f) => f.name === name);
    if (field?.validation) {
      const error = field.validation(value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors: Record<string, string | null> = {};
    fields.forEach((field) => {
      if (field.validation) {
        const error = field.validation(formDataRef.current[field.name] || "");
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== null);
    if (!hasErrors) {
      onSubmit(formDataRef.current);
    }
  };

  useEffect(() => {
    const hasErrors = Object.values(errors).some((error) => error !== null);
    const allFieldsFilled = fields.every((field) => formDataRef.current[field.name] && formDataRef.current[field.name] !== "");
    setIsButtonDisabled(hasErrors || !allFieldsFilled);
  }, [errors, fields]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-[${formWidth}] mx-auto p-6 bg-white shadow-md rounded-md space-y-4 border-3 border-black`}
    >
      <RiAccountCircleFill style={{ height: "40px", width: "50px", margin: "auto" }} />
      <h2 className="text-xl text-center font-semibold text-gray-800">{formLabel}</h2>
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label htmlFor={field.name} className="mb-2 text-sm font-medium text-gray-700">
            {field.label}
          </label>
          {field.type === "dropdown" ? (
            <select
              id={field.name}
              name={field.name}
              onChange={handleChange}
              className={`p-2 border ${
                errors[field.name] ? "border-red-500" : "border-gray-500"
              } rounded-md focus:outline-none focus:ring-2 ${
                errors[field.name] ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              onChange={handleChange}
              className={`p-2 border ${
                errors[field.name] ? "border-red-500" : "border-gray-500"
              } rounded-md focus:outline-none focus:ring-2 ${
                errors[field.name] ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              autoComplete="false"
              onChange={handleChange}
              className={`p-2 border ${
                errors[field.name] ? "border-red-500" : "border-gray-500"
              } rounded-md focus:outline-none focus:ring-2 ${
                errors[field.name] ? "focus:ring-red-500" : "focus:ring-orange-500"
              }`}
            />
          )}
          {errors[field.name] && (
            <p className="text-red-500 flex items-center text-sm mt-1"><MdError style={{ marginRight: '5px' }} />{errors[field.name]}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className={`w-full rounded p-2 flex items-center justify-center ${isButtonDisabled ? 'bg-gray-200 text-gray cursor-not-allowed ' : 'bg-orange-400 text-white hover:bg-orange-600' } transition`}
        disabled={isButtonDisabled}
      >
        <MdLogin style={{ marginRight: "10px "}} />
        {submitButtonLabel}
      </button>
      <Link to={submitButtonLabel === 'Login' ? "/register" : '/'} className="text-orange-500 hover:text-orange-700 text-sm">{submitButtonLabel === 'Login' ? "New here? Create account here" : "Already have an account? Login here"}</Link>
    </form>
  );
};

export default Form;