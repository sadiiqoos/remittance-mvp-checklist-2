import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  trend?: { value: string; isPositive: boolean }
}

export function StatCard({ title, value, subtitle, icon: Icon, iconColor = "text-primary", trend }: StatCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-sm`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {trend.value}
          </div>
        )}
      </div>

      <div>
        <div className="text-sm font-medium text-muted-foreground mb-2">{title}</div>
        <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
    </Card>
  )
}
