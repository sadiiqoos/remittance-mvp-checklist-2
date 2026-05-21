"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, CheckCircle2, XCircle, Clock, User, FileText, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

interface KYCCase {
  id: string
  user_id: string
  email: string
  first_name: string
  last_name: string
  kyc_status: string
  date_of_birth: string
  nationality: string
  phone: string
  created_at: string
}

export function AdminKYCContent() {
  const [cases, setCases] = useState<KYCCase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCase, setSelectedCase] = useState<KYCCase | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadCases()
  }, [])

  async function loadCases() {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, kyc_status, date_of_birth, nationality, phone, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[kyc] loadCases error:", error)
    } else {
      setCases((data ?? []).map(u => ({ ...u, user_id: u.id })))
    }
    setLoading(false)
  }

  const handleStatusUpdate = async (userId: string, newStatus: "verified" | "rejected") => {
    const supabase = createClient()
    const { error } = await supabase
      .from("users")
      .update({ kyc_status: newStatus })
      .eq("id", userId)

    if (error) {
      toast({ title: "Error", description: "Failed to update KYC status", variant: "destructive" })
      return
    }

    setCases(cases.map(c => c.user_id === userId ? { ...c, kyc_status: newStatus } : c))
    setSelectedCase(null)
    toast({
      title: "KYC status updated",
      description: `User verification ${newStatus === "verified" ? "approved" : "rejected"}`,
    })
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; icon: any; className: string }> = {
      verified: { label: "Verified", icon: CheckCircle2, className: "bg-green-100 text-green-800" },
      pending: { label: "Pending Review", icon: Clock, className: "bg-yellow-100 text-yellow-800" },
      rejected: { label: "Rejected", icon: XCircle, className: "bg-red-100 text-red-800" },
    }
    const { label, icon: Icon, className } = config[status] || config.pending
    return (
      <Badge className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    )
  }

  const stats = {
    total: cases.length,
    pending: cases.filter(c => c.kyc_status === "pending").length,
    verified: cases.filter(c => c.kyc_status === "verified").length,
    rejected: cases.filter(c => c.kyc_status === "rejected").length,
  }

  const filteredCases = cases.filter(c => {
    const matchesStatus = statusFilter === "all" || c.kyc_status === statusFilter
    const query = searchQuery.toLowerCase()
    const matchesSearch = !searchQuery ||
      c.email?.toLowerCase().includes(query) ||
      c.first_name?.toLowerCase().includes(query) ||
      c.last_name?.toLowerCase().includes(query)
    return matchesStatus && matchesSearch
  })

  const statCards = [
    { label: "Total Cases", value: stats.total, filter: "all", color: "text-foreground" },
    { label: "Pending Review", value: stats.pending, filter: "pending", color: "text-yellow-600" },
    { label: "Verified", value: stats.verified, filter: "verified", color: "text-green-600" },
    { label: "Rejected", value: stats.rejected, filter: "rejected", color: "text-red-600" },
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">KYC Case Management</h1>
        <p className="text-muted-foreground">Review and approve user identity verifications</p>
      </div>

      {/* Clickable stat cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Card
            key={stat.filter}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              statusFilter === stat.filter
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => setStatusFilter(stat.filter)}
          >
            <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            {statusFilter === stat.filter && (
              <div className="text-xs text-primary mt-1 font-medium">● Active filter</div>
            )}
          </Card>
        ))}
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {filteredCases.map((kycCase) => (
              <Card
                key={kycCase.id}
                className={`p-4 cursor-pointer hover:border-primary transition-colors ${
                  selectedCase?.id === kycCase.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedCase(kycCase)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {kycCase.first_name} {kycCase.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">{kycCase.email}</div>
                    </div>
                  </div>
                  {getStatusBadge(kycCase.kyc_status)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Submitted: {new Date(kycCase.created_at).toLocaleDateString()}
                </div>
              </Card>
            ))}

            {filteredCases.length === 0 && (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No cases found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {selectedCase && (
            <Card className="p-6 h-fit sticky top-4">
              <h2 className="text-xl font-bold mb-4">Case Details</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{selectedCase.first_name} {selectedCase.last_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{selectedCase.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{selectedCase.phone || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date of Birth:</span>
                      <span className="font-medium">{selectedCase.date_of_birth || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nationality:</span>
                      <span className="font-medium">{selectedCase.nationality || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">KYC Status:</span>
                      {getStatusBadge(selectedCase.kyc_status)}
                    </div>
                  </div>
                </div>

                {selectedCase.kyc_status === "pending" && (
                  <div className="flex gap-3">
                    <Button className="flex-1" onClick={() => handleStatusUpdate(selectedCase.user_id, "verified")}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => handleStatusUpdate(selectedCase.user_id, "rejected")}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </main>
  )
}
