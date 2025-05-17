"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function TestS3Page() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; url?: string; error?: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadResult(null)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", file)

      // Generate a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      formData.append("fileName", fileName)

      // Send request to upload API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload file")
      }

      setUploadResult({
        success: true,
        url: data.url,
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-28 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-white">Test S3 Upload</h1>

      <div className="glass-panel p-8 rounded-lg">
        <div className="mb-6">
          <label className="block text-white mb-2">Select File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={uploading}
          />
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full glass-panel text-white hover-glow"
        >
          {uploading ? "Uploading..." : "Upload to S3"}
        </Button>

        {uploadResult && (
          <div className={`mt-6 p-4 rounded ${uploadResult.success ? "bg-green-500/20" : "bg-red-500/20"}`}>
            {uploadResult.success ? (
              <div>
                <p className="text-white mb-2">File uploaded successfully!</p>
                <a
                  href={uploadResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline break-all"
                >
                  {uploadResult.url}
                </a>
              </div>
            ) : (
              <p className="text-red-400">{uploadResult.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
