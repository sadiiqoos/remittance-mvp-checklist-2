import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Users, History, Settings } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
          <Link href="/send">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium">Send Money</span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
          <Link href="/recipients">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium">Recipients</span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
          <Link href="/transactions">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium">History</span>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent" disabled>
          <Link href="/settings">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </Button>
      </div>
    </Card>
  )
}
