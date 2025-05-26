"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, CheckCircle, Shield, Database, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EmergencyAccess() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [step, setStep] = useState<"check" | "create" | "complete">("check")
  const [connectionStatus, setConnectionStatus] = useState<{
    supabase: boolean
    database: boolean
    auth: boolean
  }>({ supabase: false, database: false, auth: false })

  const router = useRouter()
  const supabase = createClientComponentClient()

  const checkConnection = async () => {
    setLoading(true)
    setError(null)

    try {
      // Test Supabase connection
      const { data: healthCheck, error: healthError } = await supabase.from("users").select("count").limit(1)

      const supabaseOk = !healthError

      // Test auth service
      const { data: authData, error: authError } = await supabase.auth.getSession()
      const authOk = !authError

      // Test if users table exists and has data
      const { data: usersData, error: usersError } = await supabase.from("users").select("id, email").limit(5)

      const databaseOk = !usersError

      setConnectionStatus({
        supabase: supabaseOk,
        database: databaseOk,
        auth: authOk,
      })

      if (usersData && usersData.length > 0) {
        setSuccess(`Found ${usersData.length} existing user(s). You may need to reset your password.`)
        setStep("create")
      } else if (databaseOk) {
        setSuccess("Database connected but no users found. Let's create your admin account.")
        setStep("create")
      } else {
        setError("Database connection failed. Please check your Supabase configuration.")
      }
    } catch (err: any) {
      console.error("Connection check failed:", err)
      setError(`Connection failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const createAdminUser = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // First, try to sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`,
        },
      })

      if (signUpError) {
        // If user already exists, try to update password instead
        if (signUpError.message.includes("already registered")) {
          setError("User already exists. Try using the password reset instead.")
          return
        }
        throw signUpError
      }

      if (signUpData.user) {
        // Try to insert user data into users table
        try {
          const { error: insertError } = await supabase.from("users").insert([
            {
              id: signUpData.user.id,
              email: signUpData.user.email,
              role: "admin",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])

          if (insertError) {
            console.warn("Could not insert user data:", insertError)
          }
        } catch (insertErr) {
          console.warn("User table insert failed:", insertErr)
        }

        setSuccess("Admin user created successfully! You can now log in.")
        setStep("complete")
      }
    } catch (err: any) {
      console.error("User creation failed:", err)
      setError(`Failed to create user: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        setSuccess("Login successful! Redirecting to admin dashboard...")
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 2000)
      }
    } catch (err: any) {
      setError(`Login failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const createDirectUser = async () => {
    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Try to create user directly via API
      const response = await fetch("/api/admin/emergency-create-user", {
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

      if (!response.ok) {
        throw new Error(result.error || "Failed to create user")
      }

      // Immediately try to sign in with the new credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(`User created but login failed: ${signInError.message}. Try logging in manually.`)
        return
      }

      if (signInData.user) {
        setSuccess("Admin user created and logged in successfully! Redirecting...")
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 2000)
      } else {
        setSuccess("Admin user created successfully! You can now log in manually.")
        setStep("complete")
      }
    } catch (err: any) {
      console.error("Direct user creation failed:", err)
      setError(`Failed to create user: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Emergency Admin Access
          </CardTitle>
          <CardDescription className="text-gray-400">Diagnose and fix admin login issues</CardDescription>
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

          {step === "check" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Step 1: Check System Status</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Supabase</span>
                  </div>
                  <div className={`text-sm ${connectionStatus.supabase ? "text-green-400" : "text-gray-400"}`}>
                    {connectionStatus.supabase ? "Connected" : "Not tested"}
                  </div>
                </div>

                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">Database</span>
                  </div>
                  <div className={`text-sm ${connectionStatus.database ? "text-green-400" : "text-gray-400"}`}>
                    {connectionStatus.database ? "Connected" : "Not tested"}
                  </div>
                </div>

                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-orange-400" />
                    <span className="text-white font-medium">Auth</span>
                  </div>
                  <div className={`text-sm ${connectionStatus.auth ? "text-green-400" : "text-gray-400"}`}>
                    {connectionStatus.auth ? "Working" : "Not tested"}
                  </div>
                </div>
              </div>

              <Button onClick={checkConnection} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking System...
                  </>
                ) : (
                  "Check System Status"
                )}
              </Button>
            </div>
          )}

          {step === "create" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Step 2: Create/Test Admin Account</h3>

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
                    placeholder="admin@example.com"
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
                    placeholder="••••••••"
                    className="bg-gray-700 border-gray-600 text-white"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-200">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-700 border-gray-600 text-white"
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={testLogin} disabled={loading} variant="outline" className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      "Test Login"
                    )}
                  </Button>

                  <Button onClick={createAdminUser} disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Admin"
                    )}
                  </Button>
                </div>

                <Button onClick={createDirectUser} disabled={loading} variant="secondary" className="w-full mt-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Direct...
                    </>
                  ) : (
                    "Create Admin (Direct Method)"
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="space-y-4 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <h3 className="text-lg font-semibold text-white">Setup Complete!</h3>
              <p className="text-gray-300">Your admin account is ready to use.</p>

              <div className="flex gap-2">
                <Button onClick={() => router.push("/admin/login")} className="flex-1">
                  Go to Login
                </Button>
                <Button onClick={() => router.push("/admin/dashboard")} variant="outline" className="flex-1">
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-600">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Environment Check:</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}</div>
              <div>Supabase Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}</div>
              <div>Current URL: {typeof window !== "undefined" ? window.location.origin : "N/A"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
