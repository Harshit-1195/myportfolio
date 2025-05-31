"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadFile, createMedia } from "@/lib/cms-service"
import { Upload, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploadProps {
  onUploadComplete?: (mediaItem: any) => void
  accept?: string
  folder?: string
}

export function FileUpload({
  onUploadComplete,
  accept = "image/jpeg,image/jpg,image/png,image/webp,application/pdf",
  folder = "uploads",
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [altText, setAltText] = useState("")
  const [caption, setCaption] = useState("")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"]
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please select a valid file type: JPG, PNG, WebP, or PDF")
        return
      }

      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        return
      }

      setFile(selectedFile)
      setError(null)
      setSuccess(false)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      // Generate a unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      // Upload to Supabase Storage
      const fileUrl = await uploadFile(file, filePath)

      if (!fileUrl) {
        throw new Error("Failed to upload file")
      }

      // Create media record in database
      const mediaItem = await createMedia({
        filename: fileName,
        original_filename: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        alt_text: altText || null,
        caption: caption || null,
        width: null,
        height: null,
      })

      if (!mediaItem) {
        throw new Error("Failed to create media record")
      }

      setSuccess(true)

      // Reset form
      setFile(null)
      setAltText("")
      setCaption("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Callback with the file URL for immediate use
      if (onUploadComplete) {
        onUploadComplete({ url: fileUrl, ...mediaItem })
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during upload")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertDescription>File uploaded successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="file">File (JPG, PNG, WebP, PDF)</Label>
        <Input id="file" type="file" ref={fileInputRef} onChange={handleFileChange} accept={accept} />
        <p className="text-xs text-gray-400">Supported formats: JPG, PNG, WebP, PDF (max 10MB)</p>
      </div>

      {file && (
        <>
          <div className="space-y-2">
            <Label htmlFor="alt-text">Alt Text</Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image for accessibility"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Optional caption for the image"
            />
          </div>
        </>
      )}

      <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
        {uploading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </>
        )}
      </Button>
    </div>
  )
}
