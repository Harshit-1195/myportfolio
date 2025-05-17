"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { STORAGE_BUCKET } from "@/lib/storage"
import { Button } from "@/components/ui/button"

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [buckets, setBuckets] = useState<string[]>([])

  useEffect(() => {
    async function checkConnection() {
      try {
        const supabase = getSupabaseBrowserClient()

        // Test basic connection
        const { data, error } = await supabase.from("_dummy_query").select("*").limit(1)

        if (error && error.code !== "PGRST116") {
          throw new Error(`Connection error: ${error.message}`)
        }

        // Check storage buckets
        const { data: bucketsData, error: bucketsError } = await supabase.storage.listBuckets()

        if (bucketsError) {
          throw new Error(`Storage error: ${bucketsError.message}`)
        }

        const bucketNames = bucketsData?.map((b) => b.name) || []
        setBuckets(bucketNames)

        const hasAssetsBucket = bucketNames.includes(STORAGE_BUCKET)

        if (!hasAssetsBucket) {
          setStatus("error")
          setMessage(
            `Connected to Supabase, but the "${STORAGE_BUCKET}" bucket was not found. Available buckets: ${bucketNames.join(", ") || "none"}`,
          )
          return
        }

        setStatus("success")
        setMessage(`Successfully connected to Supabase project: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
      } catch (err) {
        setStatus("error")
        setMessage(err instanceof Error ? err.message : "Unknown error occurred")
        console.error("Supabase connection test failed:", err)
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="p-4 rounded-lg border glass-panel">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              status === "loading"
                ? "bg-yellow-500 animate-pulse"
                : status === "success"
                  ? "bg-green-500"
                  : "bg-red-500"
            }`}
          />
          <span className="font-medium">
            {status === "loading" ? "Testing connection..." : status === "success" ? "Connected" : "Connection failed"}
          </span>
        </div>

        {message && (
          <div
            className={`p-3 rounded text-sm ${
              status === "success"
                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                : status === "error"
                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                  : "bg-gray-500/10 text-gray-500 border border-gray-500/20"
            }`}
          >
            {message}
          </div>
        )}

        {buckets.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Available Storage Buckets:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              {buckets.map((bucket) => (
                <li key={bucket} className={bucket === STORAGE_BUCKET ? "text-green-500 font-medium" : ""}>
                  {bucket} {bucket === STORAGE_BUCKET && "(active)"}
                </li>
              ))}
            </ul>
          </div>
        )}

        {status === "error" && (
          <div className="mt-4">
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              Retry Connection Test
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
