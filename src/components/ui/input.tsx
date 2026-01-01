import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  showIcon?: boolean
  iconPosition?: "left" | "right"
  isSearch?: boolean
  onIconClick?: () => void
  clasname ?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      className = "text-sm",
      type = "text",
      showIcon = false,
      iconPosition = "left",
      isSearch = false,
      onIconClick,
      ...props
    },
    ref,
  ) => {
    const icon =
      isSearch && type !== "number" ? (
        <Search
          onClick={onIconClick}
          className={
            iconPosition === "left"
              ? "h-4 w-4 text-muted-foreground cursor-pointer"
              : "h-6 w-6 text-white cursor-pointer"
          }
        />
      ) : null

    const baseClasses = cn(
      `file:text-foreground bg-white placeholder:text-muted-foreground mt-1`,
      "dark:bg-input/30 border-[#C7CBD2] flex h-[40px] w-full border-[2px] pl-3 h-[48px] text-sm shadow-xs transition-[color,box-shadow] outline-none",
      "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "focus-visible:ring-[1px] focus-visible:ring-gray-500 focus-visible:border-gray-500",
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      type === "number" && "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
      // icon padding
      showIcon && iconPosition === "left" && type !== "email" && type !== "number" && "pl-9 pr-4",
      showIcon && iconPosition === "right" && type !== "email" && type !== "number" && "pl-7 pr-9",
      className,
    )

    return (
      <div className="relative w-full">
        {label && <Label htmlFor={props.id}>{label}</Label>}

        {showIcon && icon && iconPosition === "left" && type !== "email" && type !== "number" && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}

        {showIcon && icon && iconPosition === "right" && type !== "email" && type !== "number" && (
          <span className="absolute right-7 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}

        <input
          type={type}
          data-slot="input"
          className={baseClasses}
          ref={ref}
          {...props}
        />

        {!showIcon && error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
      </div>
    )
  },
)

Input.displayName = "Input"

export { Input }
