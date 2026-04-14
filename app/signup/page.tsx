import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { SignUpForm } from "@/components/auth/signup-form"

export default async function SignUpPage() {
  const authenticated = await isAuthenticated()

  if (authenticated) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">RemitSwift</h1>
          <p className="text-muted-foreground">Send money to Africa, fast and secure</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
