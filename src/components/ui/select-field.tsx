import type React from "react"
import { Label } from "@/components/ui/label"
import { forwardRef } from "react"
import { ChevronDown } from "lucide-react"

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { value: string | number; label: string }[]
  placeholder?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, placeholder = "Select an option", className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <Label htmlFor={props.id}>{label}</Label>

        <div className="relative mt-1.5">
          <select
            ref={ref}
             className={`appearance-none border bg-gray-100 rounded-md w-full p-1 pl-3 pr-8 text-sm
              focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${className}`}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* 👇 Icon positioned perfectly */}
          <ChevronDown
            className="absolute right-[13px] top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 h-4 w-4"
          />
        </div>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    )
  },
)

SelectField.displayName = "SelectField"
