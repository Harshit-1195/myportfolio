"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DatabaseDebugPage() {
  const [tableInfo, setTableInfo] = useState<any>(null)
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const checkDatabase = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/debug/database")
      const result = await response.json()

      if (result.success) {
        setTableInfo(result.tableInfo)
        setBlogPosts(result.blogPosts || [])
      } else {
        setError(result.error || "Failed to check database")
      }
    } catch (err) {
      setError("Error checking database: " + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const fixMissingColumns = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/debug/fix-columns", { method: "POST" })
      const result = await response.json()

      if (result.success) {
        alert("Columns added successfully! Refresh to see changes.")
        checkDatabase()
      } else {
        setError(result.error || "Failed to fix columns")
      }
    } catch (err) {
      setError("Error fixing columns: " + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkDatabase()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Database Debug Information</CardTitle>
          <CardDescription>Check your current database structure and existing blog posts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkDatabase} disabled={loading}>
            {loading ? "Checking..." : "Refresh Database Info"}
          </Button>

          {error && (
            <Alert className="border-red-500">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {tableInfo && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Table Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Table exists:</strong> {tableInfo.exists ? "Yes" : "No"}
              </p>
              {tableInfo.columns && (
                <div>
                  <p>
                    <strong>Existing columns:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-4">
                    {tableInfo.columns.map((col: string) => (
                      <li key={col}>{col}</li>
                    ))}
                  </ul>
                </div>
              )}
              {tableInfo.missingColumns && tableInfo.missingColumns.length > 0 && (
                <div>
                  <p>
                    <strong>Missing columns:</strong>
                  </p>
                  <ul className="list-disc list-inside ml-4 text-red-600">
                    {tableInfo.missingColumns.map((col: string) => (
                      <li key={col}>{col}</li>
                    ))}
                  </ul>
                  <Button onClick={fixMissingColumns} className="mt-2" disabled={loading}>
                    Add Missing Columns
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Existing Blog Posts ({blogPosts.length})</CardTitle>
          <CardDescription>All blog posts currently in your database</CardDescription>
        </CardHeader>
        <CardContent>
          {blogPosts.length === 0 ? (
            <p>No blog posts found in the database.</p>
          ) : (
            <div className="space-y-4">
              {blogPosts.map((post, index) => (
                <Card key={post.id || index} className="p-4">
                  <h3 className="font-semibold">{post.title || "Untitled"}</h3>
                  <p className="text-sm text-gray-600">
                    Slug: {post.slug || "No slug"} | Published:{" "}
                    {post.is_published ? "Yes" : post.is_published === false ? "No" : "Unknown"} | Created:{" "}
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Unknown"}
                  </p>
                  {post.content && <p className="text-sm mt-2 truncate">{post.content.substring(0, 100)}...</p>}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
