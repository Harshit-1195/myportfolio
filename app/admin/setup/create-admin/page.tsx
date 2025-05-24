"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, UserPlus, AlertTriangle, Check } from "lucide-react"

export default function CreateAdminPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [adminSecretKey, setAdminSecretKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          adminSecretKey,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create admin user")
      }

      setResult({ success: true })
      // Clear form
      setEmail("")
      setPassword("")
      setAdminSecretKey("")
    } catch (error: any) {
      console.error("Error creating admin user:", error)
      setResult({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-28 px-4 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-white text-center">Create Admin User</h1>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create Admin User
          </CardTitle>
          <CardDescription className="text-gray-400">Create your first admin user to access the CMS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-md text-yellow-300">
              <p className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Important
              </p>
              <p className="mt-1 text-sm">
                This page should only be used once to create your initial admin user. For security reasons, you should
                delete this page after creating your admin user.
              </p>
            </div>

            {result && (
              <div
                className={`p-4 rounded-md ${
                  result.success
                    ? "bg-green-900/20 border border-green-800/50 text-green-300"
                    : "bg-red-900/20 border border-red-800/50 text-red-300"
                }`}
              >
                {result.success ? (
                  <p className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Admin user created successfully!
                  </p>
                ) : (
                  <p>{result.error}</p>
                )}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Strong password"
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminSecretKey" className="text-white">
                  Admin Secret Key
                </Label>
                <Input
                  id="adminSecretKey"
                  type="password"
                  value={adminSecretKey}
                  onChange={(e) => setAdminSecretKey(e.target.value)}
                  placeholder="Your admin secret key"
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400">
                  This is the ADMIN_SECRET_KEY you set in your environment variables
                </p>
              </div>
            </form>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateAdmin} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Admin User"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
