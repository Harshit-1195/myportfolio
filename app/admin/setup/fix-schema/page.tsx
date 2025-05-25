"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function FixSchemaPage() {
  const [status, setStatus] = useState<"idle" | "checking" | "fixing" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [schemaIssues, setSchemaIssues] = useState<string[]>([])

  const checkSchema = async () => {
    setStatus("checking")
    setMessage("Checking database schema...")

    try {
      const response = await fetch("/api/admin/check-schema")
      const result = await response.json()

      if (result.success) {
        if (result.issues.length === 0) {
          setStatus("success")
          setMessage("Database schema is correct!")
          setSchemaIssues([])
        } else {
          setStatus("error")
          setMessage("Schema issues found")
          setSchemaIssues(result.issues)
        }
      } else {
        setStatus("error")
        setMessage(result.error || "Failed to check schema")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Error checking schema: " + (error as Error).message)
    }
  }

  const fixSchema = async () => {
    setStatus("fixing")
    setMessage("Fixing database schema...")

    try {
      const response = await fetch("/api/admin/fix-schema", { method: "POST" })
      const result = await response.json()

      if (result.success) {
        setStatus("success")
        setMessage("Database schema fixed successfully!")
        setSchemaIssues([])
      } else {
        setStatus("error")
        setMessage(result.error || "Failed to fix schema")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Error fixing schema: " + (error as Error).message)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Database Schema Management</CardTitle>
          <CardDescription>Check and fix your database schema to ensure all required columns exist</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={checkSchema} disabled={status === "checking" || status === "fixing"} variant="outline">
              {status === "checking" ? "Checking..." : "Check Schema"}
            </Button>

            {schemaIssues.length > 0 && (
              <Button onClick={fixSchema} disabled={status === "checking" || status === "fixing"}>
                {status === "fixing" ? "Fixing..." : "Fix Schema"}
              </Button>
            )}
          </div>

          {message && (
            <Alert
              className={
                status === "success" ? "border-green-500" : status === "error" ? "border-red-500" : "border-blue-500"
              }
            >
              {status === "success" && <CheckCircle className="h-4 w-4" />}
              {status === "error" && <XCircle className="h-4 w-4" />}
              {(status === "checking" || status === "fixing") && <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {schemaIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Schema Issues Found</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  {schemaIssues.map((issue, index) => (
                    <li key={index} className="text-sm text-red-600">
                      {issue}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
