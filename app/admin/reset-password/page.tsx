"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isValidSession, setIsValidSession] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we have URL parameters for password reset
        const accessToken = searchParams.get("access_token")
        const refreshToken = searchParams.get("refresh_token")
        const type = searchParams.get("type")

        if (type === "recovery" && accessToken && refreshToken) {
          // Set the session using the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            console.error("Error setting session:", error)
            setError("Invalid or expired reset link. Please request a new password reset.")
          } else if (data.session) {
            setIsValidSession(true)
            setMessage("Reset link verified. Please enter your new password.")
          }
        } else {
          // Check if we already have a valid session
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession()

          if (error) {
            console.error("Error getting session:", error)
            setError("Unable to verify session. Please try again.")
          } else if (session) {
            setIsValidSession(true)
            setMessage("Session verified. Please enter your new password.")
          } else {
            setError("Invalid or expired reset link. Please request a new password reset.")
          }
        }
      } catch (err) {
        console.error("Session check error:", err)
        setError("An error occurred while verifying your reset link.")
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [supabase, searchParams])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

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
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        throw error
      }

      setMessage("Password updated successfully! Redirecting to login...")

      // Clear the form
      setPassword("")
      setConfirmPassword("")

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/admin/login")
      }, 3000)
    } catch (err: any) {
      console.error("Password update error:", err)
      setError(err.message || "Failed to update password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRequestNewReset = () => {
    router.push("/admin/forgot-password")
  }

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="text-white">Verifying reset link...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
          <CardDescription className="text-gray-400">
            {isValidSession ? "Enter your new password below" : "There was an issue with your reset link"}
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

          {isValidSession ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  New Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                  minLength={8}
                  disabled={loading}
                />
                <p className="text-xs text-gray-400">Password must be at least 8 characters long</p>
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
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                  minLength={8}
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Your reset link appears to be invalid or expired. Please request a new password reset.
              </p>
              <Button onClick={handleRequestNewReset} className="w-full" variant="outline">
                Request New Reset Link
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => router.push("/admin/login")}
              className="text-gray-400 hover:text-white"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
