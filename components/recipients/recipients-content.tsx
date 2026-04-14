"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RecipientCard } from "@/components/recipients/recipient-card"
import { RecipientForm, type RecipientFormData } from "@/components/recipients/recipient-form"
import type { Recipient, Corridor, User } from "@/lib/types"
import {
  getAllRecipients,
  createRecipient,
  updateRecipient,
  deleteRecipient,
  toggleFavorite,
} from "@/app/actions/recipients"
import { getCorridors, getDemoUser } from "@/app/actions/transfer"
import { Plus, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function RecipientsContent() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [corridors, setCorridors] = useState<Corridor[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null)
  const [deletingRecipient, setDeletingRecipient] = useState<Recipient | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, corridorsData] = await Promise.all([getDemoUser(), getCorridors()])
        setUser(userData)
        setCorridors(corridorsData)

        const recipientsData = await getAllRecipients(userData.id)
        setRecipients(recipientsData)
      } catch (error) {
        console.error("[v0] Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleAddRecipient = async (formData: RecipientFormData) => {
    if (!user) return

    try {
      const newRecipient = await createRecipient({
        userId: user.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        payoutMethod: formData.payoutMethod,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        bankName: formData.bankName,
        bankAccountNumber: formData.bankAccountNumber,
        bankCode: formData.bankCode,
        swiftCode: formData.swiftCode,
        iban: formData.iban,
        mobileMoneyProvider: formData.mobileMoneyProvider,
        mobileMoneyNumber: formData.mobileMoneyNumber,
        pickupLocation: formData.pickupLocation,
      })

      setRecipients([newRecipient, ...recipients])
      setShowForm(false)
    } catch (error) {
      console.error("[v0] Error creating recipient:", error)
      alert("Failed to add recipient. Please try again.")
    }
  }

  const handleEditRecipient = async (formData: RecipientFormData) => {
    if (!editingRecipient) return

    try {
      const updatedRecipient = await updateRecipient(editingRecipient.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        bankName: formData.bankName,
        bankAccountNumber: formData.bankAccountNumber,
        bankCode: formData.bankCode,
        swiftCode: formData.swiftCode,
        iban: formData.iban,
        mobileMoneyProvider: formData.mobileMoneyProvider,
        mobileMoneyNumber: formData.mobileMoneyNumber,
        pickupLocation: formData.pickupLocation,
      })

      setRecipients(recipients.map((r) => (r.id === updatedRecipient.id ? updatedRecipient : r)))
      setEditingRecipient(null)
    } catch (error) {
      console.error("[v0] Error updating recipient:", error)
      alert("Failed to update recipient. Please try again.")
    }
  }

  const handleDeleteRecipient = async () => {
    if (!deletingRecipient) return

    try {
      await deleteRecipient(deletingRecipient.id)
      setRecipients(recipients.filter((r) => r.id !== deletingRecipient.id))
      setDeletingRecipient(null)
    } catch (error) {
      console.error("[v0] Error deleting recipient:", error)
      alert("Failed to delete recipient. Please try again.")
    }
  }

  const handleToggleFavorite = async (recipient: Recipient, isFavorite: boolean) => {
    try {
      const updated = await toggleFavorite(recipient.id, isFavorite)
      setRecipients(recipients.map((r) => (r.id === updated.id ? updated : r)))
    } catch (error) {
      console.error("[v0] Error toggling favorite:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (showForm || editingRecipient) {
    const initialData = editingRecipient
      ? {
          firstName: editingRecipient.first_name,
          lastName: editingRecipient.last_name,
          country: editingRecipient.country,
          payoutMethod: editingRecipient.payout_method,
          phone: editingRecipient.phone_number || "",
          email: editingRecipient.email || "",
          city: editingRecipient.city || "",
          bankName: editingRecipient.bank_name || "",
          bankAccountNumber: editingRecipient.bank_account_number || "",
          bankCode: editingRecipient.bank_code || "",
          swiftCode: editingRecipient.swift_code || "",
          iban: editingRecipient.iban || "",
          mobileMoneyProvider: editingRecipient.mobile_money_provider || "",
          mobileMoneyNumber: editingRecipient.mobile_money_number || "",
          pickupLocation: editingRecipient.pickup_location || "",
        }
      : undefined

    return (
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <RecipientForm
          corridors={corridors}
          onSubmit={editingRecipient ? handleEditRecipient : handleAddRecipient}
          onCancel={() => {
            setShowForm(false)
            setEditingRecipient(null)
          }}
          initialData={initialData}
          isEditing={!!editingRecipient}
        />
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Recipients</h1>
          <p className="text-muted-foreground">Manage your saved recipients for quick transfers</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Recipient
        </Button>
      </div>

      {recipients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recipients.map((recipient) => (
            <RecipientCard
              key={recipient.id}
              recipient={recipient}
              onEdit={setEditingRecipient}
              onDelete={setDeletingRecipient}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No recipients yet</h3>
          <p className="text-muted-foreground mb-6">Add your first recipient to start sending money</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Recipient
          </Button>
        </div>
      )}

      <AlertDialog open={!!deletingRecipient} onOpenChange={(open) => !open && setDeletingRecipient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingRecipient?.first_name} {deletingRecipient?.last_name}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRecipient}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
