"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  /**
   * The color of the progress indicator
   * @default "primary"
   */
  color?: "primary" | "default"
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, color = "primary", ...props }, ref) => {
    const percentage = (Math.min(Math.max(value, 0), max) / max) * 100

    return (
      <div
        ref={ref}
        className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        {...props}
      >
        <div
          className={cn("h-full w-full flex-1 transition-all", color === "primary" ? "bg-primary" : "bg-foreground")}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  },
)
Progress.displayName = "Progress"

export { Progress }
