"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getPendingKYCCases, updateUserKYCStatus } from "@/lib/admin-mock-data"
import { Search, CheckCircle2, XCircle, Clock, User, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface KYCCase {
  id: string
  user_id: string
  email: string
  first_name: string
  last_name: string
  kyc_status: string
  date_of_birth: string
  nationality: string
  phone_number: string
  submitted_at: string
  documents: Array<{
    type: string
    url: string
    uploaded_at: string
  }>
}

export function AdminKYCContent() {
  const [cases, setCases] = useState<KYCCase[]>([])
  const [filteredCases, setFilteredCases] = useState<KYCCase[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [selectedCase, setSelectedCase] = useState<KYCCase | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadCases()
  }, [])

  useEffect(() => {
    filterCases()
  }, [searchQuery, statusFilter, cases])

  const loadCases = () => {
    const data = getPendingKYCCases()
    setCases(data)
  }

  const filterCases = () => {
    let filtered = cases

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.kyc_status === statusFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.last_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredCases(filtered)
  }

  const handleStatusUpdate = (userId: string, newStatus: "verified" | "rejected") => {
    updateUserKYCStatus(userId, newStatus)
    loadCases()
    setSelectedCase(null)
    toast({
      title: "KYC status updated",
      description: `User verification ${newStatus === "verified" ? "approved" : "rejected"}`,
    })
  }

  const getStatusBadge = (status: string) => {
    const config = {
      verified: { label: "Verified", icon: CheckCircle2, className: "bg-green-100 text-green-800" },
      pending: { label: "Pending Review", icon: Clock, className: "bg-yellow-100 text-yellow-800" },
      rejected: { label: "Rejected", icon: XCircle, className: "bg-red-100 text-red-800" },
    }

    const { label, icon: Icon, className } = config[status as keyof typeof config] || config.pending

    return (
      <Badge className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    )
  }

  const getStats = () => {
    return {
      total: cases.length,
      pending: cases.filter((c) => c.kyc_status === "pending").length,
      verified: cases.filter((c) => c.kyc_status === "verified").length,
      rejected: cases.filter((c) => c.kyc_status === "rejected").length,
    }
  }

  const stats = getStats()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">KYC Case Management</h1>
        <p className="text-muted-foreground">Review and approve user identity verifications</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Cases</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Pending Review</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Verified</div>
          <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Rejected</div>
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
        </Card>
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
                Submitted: {new Date(kycCase.submitted_at).toLocaleDateString()}
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
                    <span className="font-medium">
                      {selectedCase.first_name} {selectedCase.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{selectedCase.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{selectedCase.phone_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date of Birth:</span>
                    <span className="font-medium">{selectedCase.date_of_birth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nationality:</span>
                    <span className="font-medium">{selectedCase.nationality}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Submitted Documents</h3>
                <div className="space-y-3">
                  {selectedCase.documents.map((doc, idx) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium capitalize">{doc.type}</span>
                      </div>
                      <div className="relative aspect-[3/2] bg-muted rounded overflow-hidden">
                        <Image src={doc.url || "/placeholder.svg"} alt={doc.type} fill className="object-cover" />
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedCase.kyc_status === "pending" && (
                <div className="flex gap-3">
                  <Button className="flex-1" onClick={() => handleStatusUpdate(selectedCase.user_id, "verified")}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedCase.user_id, "rejected")}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
