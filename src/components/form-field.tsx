import type { LucideIcon } from "lucide-react";
import React from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  Icon?: LucideIcon;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = "text",
  register,
  error,
  Icon,
  ...props
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex gap-2 items-center jtext-sm font-medium text-gray-700"
      >
        {Icon && <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
        {label}
      </label>

      <input
        id={id}
        type={type}
        {...register}
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default FormField;
