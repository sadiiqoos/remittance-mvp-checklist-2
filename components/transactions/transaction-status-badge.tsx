import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, XCircle, Ban } from "lucide-react"

interface TransactionStatusBadgeProps {
  status: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded"
  className?: string
}

export function TransactionStatusBadge({ status, className }: TransactionStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle2,
          label: "Completed",
          variant: "default" as const,
          className: "bg-green-500 hover:bg-green-600",
        }
      case "processing":
        return {
          icon: Clock,
          label: "Processing",
          variant: "secondary" as const,
          className: "bg-blue-500 hover:bg-blue-600 text-white",
        }
      case "pending":
        return {
          icon: Clock,
          label: "Pending",
          variant: "secondary" as const,
          className: "bg-yellow-500 hover:bg-yellow-600 text-white",
        }
      case "failed":
        return {
          icon: XCircle,
          label: "Failed",
          variant: "destructive" as const,
          className: "",
        }
      case "cancelled":
        return {
          icon: Ban,
          label: "Cancelled",
          variant: "outline" as const,
          className: "",
        }
      case "refunded":
        return {
          icon: AlertCircle,
          label: "Refunded",
          variant: "outline" as const,
          className: "",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}
