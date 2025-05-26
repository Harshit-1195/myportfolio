"use client"

import type React from "react"
import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [showDebug, setShowDebug] = useState(false)

  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get the current origin for the redirect URL
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      const redirectTo = `${origin}/admin/reset-password`

      console.log("Sending password reset to:", email)
      console.log("Redirect URL:", redirectTo)

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      })

      if (error) {
        console.error("Supabase reset password error:", error)
        throw error
      }

      console.log("Password reset response:", data)
      setMessage("Password reset email sent! Please check your inbox and spam folder.")
      setEmailSent(true)
    } catch (err: any) {
      console.error("Password reset error:", err)

      // Provide more specific error messages
      if (err.message?.includes("Email not confirmed")) {
        setError("This email address is not confirmed. Please contact support.")
      } else if (err.message?.includes("User not found")) {
        setError("No account found with this email address.")
      } else if (err.message?.includes("Email rate limit")) {
        setError("Too many reset attempts. Please wait a few minutes before trying again.")
      } else {
        setError(err.message || "Failed to send reset email. Please try again or contact support.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (!email) return

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

      if (error) {
        throw error
      }

      setMessage("Reset email sent again! Please check your inbox.")
    } catch (err: any) {
      setError(err.message || "Failed to resend email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Forgot Password</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-md text-red-300 text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-800 rounded-md text-green-300 text-sm flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {!emailSent ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Email Address
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Reset Email...
                  </>
                ) : (
                  "Send Reset Email"
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-300 text-sm mb-4">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-gray-400 text-xs mb-4">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <Button onClick={handleResendEmail} variant="outline" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    "Resend Email"
                  )}
                </Button>
              </div>
            </div>
          )}

          {showDebug && (
            <div className="mt-4 p-3 bg-gray-900/50 border border-gray-600 rounded-md text-xs text-gray-300">
              <h4 className="font-semibold mb-2">Debug Information:</h4>
              <p>Current URL: {typeof window !== "undefined" ? window.location.href : "N/A"}</p>
              <p>
                Redirect URL: {typeof window !== "undefined" ? `${window.location.origin}/admin/reset-password` : "N/A"}
              </p>
              <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured"}</p>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            {showDebug ? "Hide" : "Show"} Debug Info
          </Button>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => router.push("/admin/login")}
              className="text-gray-400 hover:text-white flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
