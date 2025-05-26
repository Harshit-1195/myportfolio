"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, CheckCircle, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ForceLogin() {
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("admin123456")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [step, setStep] = useState<"setup" | "complete">("setup")

  const router = useRouter()
  const supabase = createClientComponentClient()

  const forceCreateAndLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Step 1: Force create user
      console.log("Creating user with force method...")
      const response = await fetch("/api/admin/force-create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const result = await response.json()
      console.log("Force create result:", result)

      if (!response.ok) {
        throw new Error(result.error || "Failed to create user")
      }

      // Step 2: Clear any existing sessions
      await supabase.auth.signOut()

      // Step 3: Wait a moment for the user to be fully created
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 4: Try to sign in
      console.log("Attempting login...")
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        console.error("Sign in error:", signInError)
        throw new Error(`Login failed: ${signInError.message}`)
      }

      if (signInData.user) {
        console.log("Login successful:", signInData.user)
        setSuccess("User created and logged in successfully! Redirecting to dashboard...")
        setStep("complete")

        setTimeout(() => {
          router.push("/admin/dashboard")
          router.refresh()
        }, 2000)
      } else {
        throw new Error("Login succeeded but no user data returned")
      }
    } catch (err: any) {
      console.error("Force login failed:", err)
      setError(`Failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testExistingLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await supabase.auth.signOut()

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        setSuccess("Login successful! Redirecting...")
        setTimeout(() => {
          router.push("/admin/dashboard")
          router.refresh()
        }, 1000)
      }
    } catch (err: any) {
      setError(`Login failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Force Admin Login
          </CardTitle>
          <CardDescription className="text-gray-400">Nuclear option: Force create admin user and login</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-800 rounded-md text-red-300 text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900/50 border border-green-800 rounded-md text-green-300 text-sm flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {step === "setup" && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-md">
                <p className="text-yellow-300 text-sm">
                  ⚠️ This will delete any existing user with this email and create a fresh admin account.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">
                    Admin Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={testExistingLogin} disabled={loading} variant="outline" className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      "Test Existing"
                    )}
                  </Button>

                  <Button onClick={forceCreateAndLogin} disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Force Creating...
                      </>
                    ) : (
                      "Force Create & Login"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="space-y-4 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <h3 className="text-lg font-semibold text-white">Success!</h3>
              <p className="text-gray-300">Admin account created and logged in successfully.</p>

              <div className="p-3 bg-blue-900/50 border border-blue-800 rounded-md text-left">
                <p className="text-blue-300 text-sm font-medium">Your credentials:</p>
                <p className="text-blue-200 text-sm">Email: {email}</p>
                <p className="text-blue-200 text-sm">Password: {password}</p>
              </div>

              <Button onClick={() => router.push("/admin/dashboard")} className="w-full">
                Go to Admin Dashboard
              </Button>
            </div>
          )}

          <div className="pt-4 border-t border-gray-600">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Debug Info:</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}</div>
              <div>Supabase Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
