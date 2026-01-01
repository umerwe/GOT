import * as React from "react"
import { Label } from "@/components/ui/label"
import { forwardRef } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { value: string | number; label: string }[]
  placeholder?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, placeholder = "Select an option", className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <Label htmlFor={props.id}>{label}</Label>}

        <div className="relative mt-1">
          <select
            ref={ref}
            className={cn(
              // Base styling matched to Input
              "flex w-full bg-white border-[#C7CBD2] border-[2px] text-sm shadow-xs outline-none transition-[color,box-shadow]",
              // Exact height and padding matched to Input
              "h-[48px] pl-3 pr-10 appearance-none", 
              // Focus states matched to Input
              "focus-visible:ring-[1px] focus-visible:ring-gray-500 focus-visible:border-gray-500",
              // Error states matched to Input
              error && "border-destructive ring-destructive/20",
              // Disabled states
              "disabled:pointer-events-none disabled:opacity-50",
              className
            )}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Icon positioned to match the right-side padding logic */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
      </div>
    )
  },
)

SelectField.displayName = "SelectField"