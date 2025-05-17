"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Database, CheckCircle, AlertCircle } from "lucide-react"

export default function DynamoDBSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    counts?: {
      blogPosts: number
      caseStudies: number
      logoStories: number
    }
    error?: string
  } | null>(null)

  const handleSetupSampleData = async () => {
    if (!confirm("This will create sample data in your DynamoDB tables. Continue?")) {
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/dynamodb/setup", {
        method: "POST",
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error setting up sample data:", error)
      setResult({
        success: false,
        error: "An unexpected error occurred. Please check the console for details.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">DynamoDB Setup</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Setup Sample Data</CardTitle>
          <CardDescription>
            This will create sample data in your DynamoDB tables to help you get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">The following sample data will be created:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Blog posts with content, categories, and tags</li>
            <li>Case studies with detailed project information</li>
            <li>Logo stories showcasing branding work</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSetupSampleData} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Sample Data...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Create Sample Data
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <Card className={result.success ? "bg-green-50" : "bg-red-50"}>
          <CardHeader>
            <CardTitle className="flex items-center">
              {result.success ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Success
                </>
              ) : (
                <>
                  <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                  Error
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <>
                <p className="mb-4">{result.message}</p>
                {result.counts && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Blog Posts</p>
                      <p className="text-2xl font-bold">{result.counts.blogPosts}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Case Studies</p>
                      <p className="text-2xl font-bold">{result.counts.caseStudies}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Logo Stories</p>
                      <p className="text-2xl font-bold">{result.counts.logoStories}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-red-600">{result.error}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
