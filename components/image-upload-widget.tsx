"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUp, Check, X } from "lucide-react"

interface ImageUploadWidgetProps {
  onUploadComplete?: (url: string) => void
  folder?: string
  buttonText?: string
  className?: string
}

export default function ImageUploadWidget({
  onUploadComplete,
  folder = "images",
  buttonText = "Upload Image",
  className = "",
}: ImageUploadWidgetProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; url?: string; error?: string } | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
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

      // Generate a unique file name with original extension
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      formData.append("fileName", fileName)

      // Add folder
      formData.append("folder", folder)

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

      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete(data.url)
      }

      // Reset file selection
      setFile(null)
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

  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-500/10"
            : file
              ? "border-green-500 bg-green-500/10"
              : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Check className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-lg font-medium text-white">File selected</span>
            </div>
            <p className="text-white/70">
              {file.name} ({formatFileSize(file.size)})
            </p>
            <Button variant="outline" size="sm" onClick={() => setFile(null)} className="mt-2">
              <X className="h-4 w-4 mr-1" /> Remove
            </Button>
          </div>
        ) : (
          <>
            <FileUp className="h-10 w-10 mx-auto text-white/50 mb-2" />
            <p className="text-lg font-medium text-white">Drag and drop your image here</p>
            <p className="text-white/70 mt-1">or</p>
            <Input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <Label
              htmlFor="file-upload"
              className="mt-4 inline-block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md cursor-pointer text-white transition-colors"
            >
              Browse Images
            </Label>
          </>
        )}
      </div>

      {/* Upload Button */}
      <Button onClick={handleUpload} disabled={!file || uploading} className="w-full glass-panel text-white hover-glow">
        {uploading ? "Uploading..." : buttonText}
      </Button>

      {/* Upload Result */}
      {uploadResult && (
        <div className={`p-4 rounded ${uploadResult.success ? "bg-green-500/20" : "bg-red-500/20"}`}>
          {uploadResult.success ? (
            <div>
              <div className="flex items-center mb-2">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-white font-medium">Upload successful!</p>
              </div>
              {uploadResult.url && (
                <div className="mt-2">
                  <img
                    src={uploadResult.url || "/placeholder.svg"}
                    alt="Uploaded"
                    className="max-h-40 mx-auto rounded-md object-contain bg-black/20 p-2"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-400">{uploadResult.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
