"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, FileIcon, X, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

// Default max file size (e.g., 4MB). Adjust if your server/platform allows more.
const DEFAULT_MAX_SIZE_BYTES = 4 * 1024 * 1024

interface EnhancedFileUploadProps {
  accept?: string
  folder?: string
  bucket?: string
  onUploadComplete?: (fileData: { path: string; url: string; filename: string; size: number; type: string }) => void
  onError?: (error: string) => void
  maxSize?: number // Max file size in bytes
}

export function EnhancedFileUpload({
  accept = "image/webp,image/jpeg,image/png,application/pdf",
  folder = "media",
  bucket = "media",
  onUploadComplete,
  onError,
  maxSize = DEFAULT_MAX_SIZE_BYTES,
}: EnhancedFileUploadProps) {
  const [filesToUpload, setFilesToUpload] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadError, setUploadError] = useState<Record<string, string>>({})
  const [uploadSuccess, setUploadSuccess] = useState<Record<string, boolean>>({})
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      const newFiles = acceptedFiles.filter((file) => {
        if (file.size > maxSize) {
          setUploadError((prev) => ({ ...prev, [file.name]: `File is too large (max ${maxSize / 1024 / 1024}MB).` }))
          return false
        }
        // Clear previous error for this file if it's re-added
        setUploadError((prev) => {
          const newErrors = { ...prev }
          delete newErrors[file.name]
          return newErrors
        })
        return true
      })
      setFilesToUpload((prev) => [...prev, ...newFiles])

      fileRejections.forEach((rejection) => {
        rejection.errors.forEach((err: any) => {
          setUploadError((prev) => ({ ...prev, [rejection.file.name]: err.message }))
        })
      })
    },
    [maxSize],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(",").reduce(
      (acc, type) => {
        acc[type.trim()] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    multiple: true,
  })

  const handleUpload = async () => {
    if (filesToUpload.length === 0) return

    setIsUploading(true)
    const currentFileNames = filesToUpload.map((f) => f.name)
    // Clear statuses only for files being uploaded now
    setUploadProgress((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(
          ([name]) => !currentFileNames.includes(name) || uploadSuccess[name] || uploadError[name],
        ),
      ),
    )
    setUploadError((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([name]) => !currentFileNames.includes(name) || uploadSuccess[name]),
      ),
    )
    setUploadSuccess((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([name]) => !currentFileNames.includes(name))),
    )

    for (const file of filesToUpload) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)
      formData.append("bucket", bucket)

      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))
      // Clear previous success/error for this specific file before new attempt
      setUploadSuccess((prev) => {
        const s = { ...prev }
        delete s[file.name]
        return s
      })
      setUploadError((prev) => {
        const e = { ...prev }
        delete e[file.name]
        return e
      })

      let progressInterval: NodeJS.Timeout | undefined = undefined

      try {
        let currentProgress = 0
        progressInterval = setInterval(() => {
          currentProgress += 10
          if (currentProgress < 90) {
            setUploadProgress((prev) => ({ ...prev, [file.name]: Math.min(currentProgress, 90) }))
          } else {
            if (progressInterval) clearInterval(progressInterval)
          }
        }, 100)

        const response = await fetch("/api/storage/upload", {
          method: "POST",
          body: formData,
        })

        if (progressInterval) clearInterval(progressInterval)

        if (!response.ok) {
          // Attempt to parse error if JSON, otherwise use status text
          let errorMsg = `Failed to upload ${file.name}. Status: ${response.status} ${response.statusText}`
          try {
            const errorResult = await response.json()
            if (errorResult.error) {
              errorMsg = errorResult.error
            }
          } catch (e) {
            // Response was not JSON, likely HTML error page from server/proxy
            const textResponse = await response.text()
            if (textResponse.toLowerCase().includes("request entity too large") || response.status === 413) {
              errorMsg = `File is too large. Maximum size is ${maxSize / 1024 / 1024}MB.`
            } else {
              errorMsg = `Server error: ${response.statusText}. Please check server logs.`
              console.error("Non-JSON API Response:", textResponse.substring(0, 500)) // Log snippet
            }
          }
          throw new Error(errorMsg)
        }

        const result = await response.json() // Should be safe now if response.ok

        if (result.error) {
          // Should have been caught by !response.ok if status was also bad
          throw new Error(result.error)
        }

        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))
        setUploadSuccess((prev) => ({ ...prev, [file.name]: true }))
        if (onUploadComplete && result.file) {
          onUploadComplete({
            path: result.file.path,
            url: result.file.url,
            filename: result.file.name || file.name,
            size: result.file.size || file.size,
            type: result.file.type || file.type,
          })
        }
      } catch (e: any) {
        if (progressInterval) clearInterval(progressInterval)
        setUploadError((prev) => ({ ...prev, [file.name]: e.message || "Upload failed" }))
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))
        if (onError) {
          onError(e.message || "Upload failed for " + file.name)
        }
      }
    }
    setFilesToUpload([])
    setIsUploading(false)
  }

  const removeFile = (fileName: string) => {
    setFilesToUpload((prev) => prev.filter((f) => f.name !== fileName))
    setUploadProgress((prev) => {
      const newState = { ...prev }
      delete newState[fileName]
      return newState
    })
    setUploadError((prev) => {
      const newState = { ...prev }
      delete newState[fileName]
      return newState
    })
    setUploadSuccess((prev) => {
      const newState = { ...prev }
      delete newState[fileName]
      return newState
    })
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors
                   ${isDragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500"}
                   ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} disabled={isUploading} />
        <UploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        {isDragActive ? (
          <p className="text-gray-300">Drop the files here ...</p>
        ) : (
          <p className="text-gray-300">Drag & drop files here, or click to select files</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Accepted: {accept}. Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB.
        </p>
      </div>

      {filesToUpload.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-200">Files to upload:</h4>
          {filesToUpload.map((file) => (
            <div key={file.name} className="p-2 bg-gray-800 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileIcon className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-300 truncate" title={file.name}>
                  {file.name}
                </span>
                <span className="text-xs text-gray-500 shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file.name)}
                  className="text-gray-400 hover:text-red-400 h-6 w-6"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Display area for files that have been processed (attempted upload) */}
      {Object.keys(uploadProgress).length > 0 && filesToUpload.length === 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-200">Upload Status:</h4>
          {Object.entries(uploadProgress).map(([name, progress]) => {
            // Only render if there's progress, success, or an error for this file
            if (progress > 0 || uploadSuccess[name] || uploadError[name]) {
              return (
                <div key={name} className="p-2 bg-gray-800 rounded-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-300 truncate" title={name}>
                      {name}
                    </span>
                    {uploadSuccess[name] ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : uploadError[name] ? (
                      <X className="w-5 h-5 text-red-500" />
                    ) : (
                      <span className="text-sm text-gray-400">{progress}%</span>
                    )}
                  </div>
                  {!uploadSuccess[name] && !uploadError[name] && progress > 0 && (
                    <Progress value={progress} className="h-2 [&>*]:bg-blue-500" />
                  )}
                  {uploadError[name] && <p className="text-xs text-red-400 mt-1">{uploadError[name]}</p>}
                </div>
              )
            }
            return null
          })}
        </div>
      )}

      {filesToUpload.length > 0 && (
        <Button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isUploading
            ? `Uploading ${filesToUpload.length} File(s)...`
            : `Upload ${filesToUpload.length} File${filesToUpload.length > 1 ? "s" : ""}`}
        </Button>
      )}
    </div>
  )
}
