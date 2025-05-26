"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, Eye, EyeOff, CheckCircle, Zap, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const message = urlParams.get("message")
    const error = urlParams.get("error")

    if (message === "password_updated") {
      setSuccessMessage("Password updated successfully! Please log in with your new password.")
    }

    if (error === "auth_callback_error") {
      setError("There was an error with the authentication callback. Please try again.")
    }
  }, [])

  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      const connectionTest = {
        session: data.session ? "Active session found" : "No active session",
        error: error ? error.message : "No connection errors",
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "URL configured" : "URL missing",
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Key configured" : "Key missing",
      }
      setDebugInfo(connectionTest)
      return connectionTest
    } catch (err: any) {
      const errorInfo = {
        error: err.message,
        url: "Connection failed",
        key: "Connection failed",
      }
      setDebugInfo(errorInfo)
      return errorInfo
    }
  }

  const forceCreateUser = async () => {
    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/force-create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create user")
      }

      // Clear any existing sessions
      await supabase.auth.signOut()

      // Wait for user creation to complete
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        throw new Error(`Login after creation failed: ${signInError.message}`)
      }

      if (signInData.user) {
        setSuccessMessage("User created and logged in successfully! Redirecting...")
        setTimeout(() => {
          router.push("/admin/dashboard")
          router.refresh()
        }, 1500)
      }
    } catch (err: any) {
      setError(`Force create failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Clear any existing session first
      await supabase.auth.signOut()

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        // If login fails, show debug info and force create option
        setShowDebug(true)
        await checkSupabaseConnection()

        if (error.message.includes("Invalid login credentials")) {
          throw new Error(
            "Invalid email or password. Try the 'Force Create Admin' button below if you need to create an admin user.",
          )
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error("Please confirm your email address before logging in.")
        } else if (error.message.includes("Too many requests")) {
          throw new Error("Too many login attempts. Please wait a few minutes and try again.")
        }
        throw error
      }

      if (data.user) {
        const { data: sessionData } = await supabase.auth.getSession()

        if (sessionData.session) {
          setSuccessMessage("Login successful! Redirecting...")
          setTimeout(() => {
            router.push("/admin/dashboard")
            router.refresh()
          }, 1000)
        } else {
          throw new Error("Session could not be established. Please try again.")
        }
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Failed to sign in. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
          <CardDescription className="text-gray-400">Sign in to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-md text-red-300 text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-800 rounded-md text-green-300 text-sm flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="bg-gray-700 border-gray-600 text-white"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-gray-700 border-gray-600 text-white pr-10"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {showDebug && (
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-yellow-900/20 border border-yellow-800 rounded-md">
                <p className="text-yellow-300 text-sm font-medium mb-2">🔧 Emergency Options:</p>

                <Button
                  onClick={forceCreateUser}
                  disabled={loading}
                  className="w-full mb-2 bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Force Create Admin User
                </Button>

                <Button onClick={() => setShowDebug(!showDebug)} variant="outline" size="sm" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  {showDebug ? "Hide" : "Show"} Debug Info
                </Button>
              </div>

              {debugInfo && (
                <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-md">
                  <p className="text-gray-300 text-xs font-medium mb-2">Debug Information:</p>
                  <div className="text-xs text-gray-400 space-y-1">
                    {Object.entries(debugInfo).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-300">{key}:</span> {String(value)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 text-center">
            <Link href="/admin/forgot-password" className="text-sm text-gray-400 hover:text-white transition-colors">
              Forgot your password?
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              ← Back to Portfolio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
