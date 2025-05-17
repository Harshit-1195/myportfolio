"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileUp, X, Check } from "lucide-react"
import { uploadFile } from "@/lib/storage"

interface FileUploadProps {
  onUploadComplete?: (result: { url: string; path: string }) => void
  bucket?: string
  folder?: string
  accept?: string
  maxSize?: number // in bytes
  className?: string
}

export function FileUpload({
  onUploadComplete,
  bucket = "assets",
  folder = "",
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = "",
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    setError(null)

    // Check file size
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is ${formatFileSize(maxSize)}.`)
      return
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(",").map((type) => type.trim())
      const fileType = file.type

      // Check if file type matches any of the accepted types
      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          // Check file extension
          return file.name.endsWith(type)
        } else if (type.includes("*")) {
          // Handle wildcards like image/*
          return fileType.startsWith(type.split("*")[0])
        } else {
          // Exact match
          return fileType === type
        }
      })

      if (!isAccepted) {
        setError(`File type not accepted. Please upload ${accept}.`)
        return
      }
    }

    setFile(file)
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
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      // Generate path with folder if provided
      const path = folder ? `${folder}/${file.name}` : file.name

      // Upload to Supabase Storage
      const result = await uploadFile(file, bucket, path)

      setSuccess(true)

      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete({
          url: result.url,
          path: result.path,
        })
      }

      // Reset file after successful upload
      setTimeout(() => {
        setFile(null)
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Error uploading file:", err)
      setError(err instanceof Error ? err.message : "Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-500/10"
            : success
              ? "border-green-500 bg-green-500/10"
              : error
                ? "border-red-500 bg-red-500/10"
                : file
                  ? "border-blue-500 bg-blue-500/5"
                  : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" onChange={handleFileChange} accept={accept} className="hidden" />

        {file ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              {success ? (
                <Check className="h-8 w-8 text-green-500 mr-2" />
              ) : (
                <FileUp className="h-8 w-8 text-blue-500 mr-2" />
              )}
              <span className="text-lg font-medium">{success ? "Upload complete!" : "File selected"}</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {file.name} ({formatFileSize(file.size)})
            </p>
            {!success && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setFile(null)
                }}
                className="mt-2"
              >
                <X className="h-4 w-4 mr-1" /> Remove
              </Button>
            )}
          </div>
        ) : (
          <>
            <FileUp className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
            <p className="text-lg font-medium">Drag and drop your file here</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">or click to browse</p>
            {accept && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Accepted formats: {accept}</p>}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max size: {formatFileSize(maxSize)}</p>
          </>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 p-2 rounded border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {file && !success && (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            handleUpload()
          }}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? "Uploading..." : "Upload File"}
        </Button>
      )}
    </div>
  )
}
