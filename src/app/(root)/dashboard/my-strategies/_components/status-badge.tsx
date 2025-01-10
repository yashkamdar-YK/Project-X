import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface StatusBadgeProps {
  status: "active" | "inactive" | "scheduled"
  showTooltip?: boolean
}

export function StatusBadge({ status, showTooltip = false }: StatusBadgeProps) {
  const badge = (
    <div className="flex items-center space-x-2">
      <span className="relative flex h-3 w-3">
        <span className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          status === "active" ? "bg-green-400" : "bg-yellow-400"
        )}></span>
        <span className={cn(
          "relative inline-flex rounded-full h-3 w-3",
          status === "active" ? "bg-green-500" : "bg-yellow-500"
        )}></span>
      </span>
      <Badge variant={status === "active" ? "default" : "secondary"}>
        {status === "active" ? "Active" : status === "inactive" ? "Inactive" : "Scheduled"}
      </Badge>
    </div>
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <p>Strategy will run on next trading session</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return badge
}
