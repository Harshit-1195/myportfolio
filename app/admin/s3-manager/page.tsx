"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, FileUp, Download, FolderOpen, RefreshCw, Copy, Check } from "lucide-react"

interface S3File {
  key: string
  size: number
  lastModified: string
}

export default function S3ManagerPage() {
  const [files, setFiles] = useState<S3File[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPrefix, setCurrentPrefix] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [customFileName, setCustomFileName] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  // Fetch files on component mount and when prefix changes
  useEffect(() => {
    fetchFiles()
  }, [currentPrefix])

  // Function to fetch files from S3
  const fetchFiles = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/s3/list?prefix=${encodeURIComponent(currentPrefix)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch files")
      }

      setFiles(data.files)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error fetching files:", err)
    } finally {
      setLoading(false)
    }
  }

  // Function to handle file upload
  const handleUpload = async () => {
    if (!file) return

    try {
      setIsUploading(true)
      setError(null)

      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("file", file)

      // Use custom filename if provided, otherwise use the original filename
      const fileName = customFileName || file.name
      formData.append("fileName", fileName)

      // Add the current prefix as the folder
      if (currentPrefix) {
        formData.append("folder", currentPrefix)
      }

      // Upload to S3 via API route
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload file")
      }

      // Refresh the file list
      fetchFiles()

      // Reset form
      setFile(null)
      setCustomFileName("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error uploading file:", err)
    } finally {
      setIsUploading(false)
    }
  }

  // Function to delete a file
  const deleteFile = async (key: string) => {
    try {
      setError(null)

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete file")
      }

      // Refresh the file list
      fetchFiles()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error deleting file:", err)
    }
  }

  // Function to handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  // Function to navigate to a folder
  const navigateToFolder = (key: string) => {
    // If the key ends with a slash, it's a folder
    if (key.endsWith("/")) {
      setCurrentPrefix(key)
    } else {
      // Extract the folder path from the key
      const folderPath = key.substring(0, key.lastIndexOf("/") + 1)
      setCurrentPrefix(folderPath)
    }
  }

  // Function to navigate up one level
  const navigateUp = () => {
    if (!currentPrefix) return

    // Remove the last folder from the path
    const parts = currentPrefix.split("/").filter(Boolean)
    parts.pop()

    if (parts.length === 0) {
      setCurrentPrefix("")
    } else {
      setCurrentPrefix(parts.join("/") + "/")
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

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // Function to get file extension
  const getFileExtension = (filename: string) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase()
  }

  // Function to get file name from key
  const getFileName = (key: string) => {
    return key.split("/").pop() || key
  }

  // Function to copy URL to clipboard
  const copyToClipboard = (key: string) => {
    const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || "your-bucket-name"
    const url = `https://${bucketName}.s3.amazonaws.com/${key}`

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(key)
        setTimeout(() => setCopied(null), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err)
      })
  }

  // Function to check if a key represents a folder
  const isFolder = (key: string) => {
    return key.endsWith("/") && key !== currentPrefix
  }

  // Function to get breadcrumb parts
  const getBreadcrumbs = () => {
    if (!currentPrefix) return [{ name: "Root", path: "" }]

    const parts = currentPrefix.split("/").filter(Boolean)
    let path = ""

    return [
      { name: "Root", path: "" },
      ...parts.map((part) => {
        path += part + "/"
        return { name: part, path }
      }),
    ]
  }

  return (
    <div className="container mx-auto py-28 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">S3 File Manager</h1>

        <div className="flex gap-2">
          <Button onClick={fetchFiles} className="gap-2 glass-panel text-white border-white/20 hover:bg-white/10">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 glass-panel text-white border-white/20 hover:bg-white/10">
                <Plus className="w-4 h-4" />
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Upload File to S3</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Select File</Label>
                  <Input id="file" type="file" onChange={handleFileChange} />
                </div>

                {file && (
                  <div className="text-sm">
                    Selected: {file.name} ({formatFileSize(file.size)})
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="customFileName">Custom File Name (optional)</Label>
                  <Input
                    id="customFileName"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    placeholder="Leave blank to use original filename"
                  />
                </div>

                {currentPrefix && (
                  <div className="text-sm">
                    Upload destination: <span className="font-mono">{currentPrefix}</span>
                  </div>
                )}

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button onClick={handleUpload} disabled={!file || isUploading}>
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-md mb-6">{error}</div>}

      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        {getBreadcrumbs().map((crumb, index, array) => (
          <div key={crumb.path} className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPrefix(crumb.path)}
              className={`text-sm ${index === array.length - 1 ? "text-white font-bold" : "text-white/70"}`}
            >
              {index === 0 ? <FolderOpen className="w-4 h-4 mr-1" /> : null}
              {crumb.name}
            </Button>
            {index < array.length - 1 && <span className="text-white/50">/</span>}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white/70">Loading files...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-lg">
          <FileUp className="h-12 w-12 mx-auto text-white/50" />
          <h2 className="mt-4 text-xl font-semibold text-white">No files found</h2>
          <p className="mt-2 text-white/70">
            {currentPrefix
              ? `This folder is empty. Upload files or navigate to a different folder.`
              : `Your S3 bucket is empty. Upload your first file to get started.`}
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPrefix && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Button variant="ghost" onClick={navigateUp} className="text-white/70 hover:text-white">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      ../ (Up one level)
                    </Button>
                  </TableCell>
                </TableRow>
              )}

              {files.map((file) => (
                <TableRow key={file.key}>
                  <TableCell className="font-medium">
                    {isFolder(file.key) ? (
                      <Button
                        variant="ghost"
                        onClick={() => navigateToFolder(file.key)}
                        className="text-white hover:text-white"
                      >
                        <FolderOpen className="w-4 h-4 mr-2" />
                        {getFileName(file.key)}
                      </Button>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-white">{getFileName(file.key)}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{isFolder(file.key) ? "—" : formatFileSize(file.size)}</TableCell>
                  <TableCell>{formatDate(file.lastModified)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!isFolder(file.key) && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              window.open(
                                `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || "your-bucket-name"}.s3.amazonaws.com/${file.key}`,
                                "_blank",
                              )
                            }
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyToClipboard(file.key)}
                            title="Copy URL"
                          >
                            {copied === file.key ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-red-500 hover:text-red-600"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the file.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteFile(file.key)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
