import { Diamond } from "lucide-react"

interface PremiumBadgeProps {
  variant?: "inline" | "block"
  className?: string
}

export function PremiumBadge({ variant = "inline", className = "" }: PremiumBadgeProps) {
  const baseClasses = "inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded"
  const variantClasses = variant === "block" ? "flex ml-auto" : ""

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      <Diamond className="h-3 w-3 fill-current" />
      <span>Premium</span>
    </div>
  )
}
