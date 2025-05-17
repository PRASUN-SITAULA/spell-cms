import type { LucideIcon } from 'lucide-react'
import React from 'react'
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface FormFieldProps {
  label: string
  id: string
  type?: string
  register: UseFormRegisterReturn
  error?: FieldError
  Icon?: LucideIcon
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = 'text',
  register,
  error,
  Icon,
  ...props
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="jtext-sm flex items-center gap-2 font-medium text-gray-700"
      >
        {Icon && <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
        {label}
      </label>

      <input
        id={id}
        type={type}
        {...register}
        className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  )
}

export default FormField
