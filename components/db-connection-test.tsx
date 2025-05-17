"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function DbConnectionTest() {
  const [status, setStatus] = useState<"loading" | "connected" | "error" | "disconnected">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Since we've disconnected Supabase, we'll just show disconnected status
    setStatus("disconnected")
    setErrorMessage("Supabase has been disconnected. Using static data instead.")
  }, [])

  if (status === "loading") {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg">
        Testing database connection...
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {status === "error" || status === "disconnected" ? (
        <div className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-lg">
          <div className="flex justify-between items-center">
            <span>Database: {status === "disconnected" ? "Disconnected" : "Error"}</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-white hover:bg-yellow-600"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide" : "Details"}
            </Button>
          </div>
          {showDetails && (
            <div className="mt-2 text-sm">
              <p>{errorMessage || "Using static data for the website."}</p>
              <p className="mt-1">To connect to AWS S3, follow the setup instructions.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          <div className="flex justify-between items-center">
            <span>Connected to Database</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-white hover:bg-green-600"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide" : "Details"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
