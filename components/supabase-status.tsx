"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

export default function SupabaseStatus() {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">("idle")
  const [message, setMessage] = useState<string>("")
  const [count, setCount] = useState<number | null>(null)

  const checkConnection = async () => {
    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/test-supabase")
      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message)
        setCount(data.count)
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to connect to Supabase")
      }
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Status</CardTitle>
        <CardDescription>Check your connection to Supabase</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "idle" && (
          <p className="text-center text-gray-500">Click the button below to check your Supabase connection</p>
        )}

        {status === "loading" && (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <div>
              <p>{message}</p>
              {count !== null && <p className="text-sm mt-1">Found {count} blog posts</p>}
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <p>{message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkConnection} disabled={status === "loading"} className="w-full">
          {status === "loading" ? "Checking..." : "Check Connection"}
        </Button>
      </CardFooter>
    </Card>
  )
}
