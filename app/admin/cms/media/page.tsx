"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import { FileUpload } from "@/components/file-upload"

interface StorageFile {
  name: string
  url: string
  size: number
  updatedAt: string
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<StorageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentFolder, setCurrentFolder] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  // Fetch files on component mount and when folder changes
  useEffect(() => {
    fetchFiles()
  }, [currentFolder])

  // Function to fetch files from Supabase Storage
  const fetchFiles = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/storage/list?folder=${encodeURIComponent(currentFolder)}`)
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

  // Function to delete a file
  const handleDeleteFile = async (path: string) => {
    try {
      setError(null)

      const response = await fetch("/api/storage/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path }),
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

  // Function to handle upload complete
  const handleUploadComplete = () => {
    // Refresh the file list
    fetchFiles()
  }

  // Function to navigate to a folder
  const navigateToFolder = (folderName: string) => {
    const newFolder = currentFolder ? `${currentFolder}/${folderName}` : folderName
    setCurrentFolder(newFolder)
  }

  // Function to navigate up one level
  const navigateUp = () => {
    if (!currentFolder) return

    // Remove the last folder from the path
    const parts = currentFolder.split("/").filter(Boolean)
    parts.pop()

    if (parts.length === 0) {
      setCurrentFolder("")
    } else {
      setCurrentFolder(parts.join("/"))
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

  // Function to copy URL to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(url)
        setTimeout(() => setCopied(null), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err)
      })
  }

  // Function to get breadcrumb parts
  const getBreadcrumbs = () => {
    if (!currentFolder) return [{ name: "Root", path: "" }]

    const parts = currentFolder.split("/").filter(Boolean)
    let path = ""

    return [
      { name: "Root", path: "" },
      ...parts.map((part) => {
        path += path ? `/${part}` : part
        return { name: part, path }
      }),
    ]
  }

  return (
    <div className="container mx-auto py-28 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Media Library</h1>

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
                <DialogTitle>Upload File</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <FileUpload bucket="assets" folder={currentFolder} onUploadComplete={handleUploadComplete} />

                {currentFolder && (
                  <div className="text-sm mt-2">
                    Upload destination: <span className="font-mono">{currentFolder}</span>
                  </div>
                )}
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
              onClick={() => setCurrentFolder(crumb.path)}
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
            {currentFolder
              ? `This folder is empty. Upload files or navigate to a different folder.`
              : `Your storage bucket is empty. Upload your first file to get started.`}
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
              {currentFolder && (
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
                <TableRow key={file.name}>
                  <TableCell className="font-medium">
                    {file.name.endsWith("/") ? (
                      <Button
                        variant="ghost"
                        onClick={() => navigateToFolder(file.name.replace("/", ""))}
                        className="text-white hover:text-white"
                      >
                        <FolderOpen className="w-4 h-4 mr-2" />
                        {file.name.replace("/", "")}
                      </Button>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-white">{file.name}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{file.name.endsWith("/") ? "—" : formatFileSize(file.size)}</TableCell>
                  <TableCell>{formatDate(file.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!file.name.endsWith("/") && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => window.open(file.url, "_blank")}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyToClipboard(file.url)}
                            title="Copy URL"
                          >
                            {copied === file.url ? (
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
                                  onClick={() =>
                                    handleDeleteFile(currentFolder ? `${currentFolder}/${file.name}` : file.name)
                                  }
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
