"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createSampleData } from "@/lib/cms-service"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  const handleSetupDatabase = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        // If database setup was successful, create sample data
        const sampleDataResult = await createSampleData()
        if (sampleDataResult.success) {
          setResult({
            success: true,
            message: "Database setup and sample data creation completed successfully",
          })
        } else {
          setResult({
            success: false,
            error: `Database setup completed, but sample data creation failed: ${sampleDataResult.error}`,
          })
        }
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Database Setup</h1>

      <Card>
        <CardHeader>
          <CardTitle>Initialize Database</CardTitle>
          <CardDescription>
            This will create all necessary tables in your Supabase database and add sample data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Click the button below to set up your database. This will create the following tables:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>blog_posts</li>
            <li>projects</li>
            <li>case_studies</li>
            <li>logo_stories</li>
          </ul>
          <p className="text-yellow-500">
            Warning: This will not overwrite existing tables, but it's recommended to run this only once.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSetupDatabase} disabled={isLoading}>
            {isLoading ? "Setting up..." : "Initialize Database"}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <div
          className={`mt-6 p-4 rounded-md ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {result.success ? (
            <p>{result.message}</p>
          ) : (
            <p>
              <strong>Error:</strong> {result.error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
