"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUp, Check, X } from "lucide-react"

export default function S3UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [folder, setFolder] = useState("")
  const [customFileName, setCustomFileName] = useState("")
  const [description, setDescription] = useState("")
  const [fileType, setFileType] = useState("image")
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

      // Use custom filename if provided, otherwise use original
      const fileName = customFileName || file.name
      formData.append("fileName", fileName)

      // Add folder if provided
      if (folder) {
        const folderPath = folder.endsWith("/") ? folder : `${folder}/`
        formData.append("folder", folderPath)
      } else if (fileType) {
        // Use file type as folder if no custom folder
        formData.append("folder", `${fileType}s`)
      }

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

      // Reset form on success
      setFile(null)
      setCustomFileName("")
      setDescription("")
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
    <div className="container mx-auto py-28 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-white">Upload to S3</h1>

      <div className="glass-panel p-8 rounded-lg space-y-6">
        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
                <Check className="h-8 w-8 text-green-500 mr-2" />
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
              <FileUp className="h-12 w-12 mx-auto text-white/50 mb-2" />
              <p className="text-lg font-medium text-white">Drag and drop your file here</p>
              <p className="text-white/70 mt-1">or</p>
              <Input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />
              <Label
                htmlFor="file-upload"
                className="mt-4 inline-block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md cursor-pointer text-white transition-colors"
              >
                Browse Files
              </Label>
            </>
          )}
        </div>

        {/* File Type */}
        <div className="space-y-2">
          <Label htmlFor="fileType">File Type</Label>
          <Select value={fileType} onValueChange={setFileType}>
            <SelectTrigger id="fileType">
              <SelectValue placeholder="Select file type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Folder */}
        <div className="space-y-2">
          <Label htmlFor="folder">Folder (optional)</Label>
          <Input
            id="folder"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="e.g., blog/images or leave blank"
          />
          <p className="text-xs text-white/70">Leave blank to use the file type as the folder (e.g., "images/")</p>
        </div>

        {/* Custom Filename */}
        <div className="space-y-2">
          <Label htmlFor="customFileName">Custom Filename (optional)</Label>
          <Input
            id="customFileName"
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
            placeholder="Leave blank to use original filename"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for this file"
            rows={3}
          />
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full glass-panel text-white hover-glow"
        >
          {uploading ? "Uploading..." : "Upload to S3"}
        </Button>

        {/* Upload Result */}
        {uploadResult && (
          <div className={`mt-6 p-4 rounded ${uploadResult.success ? "bg-green-500/20" : "bg-red-500/20"}`}>
            {uploadResult.success ? (
              <div>
                <div className="flex items-center mb-2">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-white font-medium">File uploaded successfully!</p>
                </div>
                <p className="text-white/70 mb-2">Your file is now available at:</p>
                <div className="bg-black/30 p-2 rounded font-mono text-sm break-all">{uploadResult.url}</div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => navigator.clipboard.writeText(uploadResult.url || "")}>
                    Copy URL
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.open(uploadResult.url, "_blank")}>
                    Open File
                  </Button>
                </div>
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
    </div>
  )
}
