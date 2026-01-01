import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {label && <Label htmlFor={props.id}>{label}</Label>}

        <textarea
          ref={ref}
          className={cn(
            // Matching border [2px] and color #C7CBD2 from Input
            "flex min-h-[120px] w-full bg-white border-[#C7CBD2] border-[2px] px-3 py-3 text-sm shadow-xs outline-none transition-[color,box-shadow]",
            "placeholder:text-muted-foreground mt-1",
            // Matching the specific focus ring from your Input
            "focus-visible:ring-[1px] focus-visible:ring-gray-500 focus-visible:border-gray-500",
            // Error state
            error && "border-destructive ring-destructive/20 dark:aria-invalid:ring-destructive/40",
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />

        {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }