"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Upload, Search, MoreVertical, Trash, Copy, ExternalLink, AlertCircle, Database } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MediaItem {
  id: string
  filename: string
  original_filename: string
  file_path: string
  file_size: number
  mime_type: string
  alt_text?: string
  caption?: string
  width?: number
  height?: number
  created_at: string
  updated_at: string
}

export default function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tableExists, setTableExists] = useState(true)
  const router = useRouter()

  const supabase = createClientComponentClient()

  useEffect(() => {
    checkTableAndFetchMedia()
  }, [])

  const checkTableAndFetchMedia = async () => {
    setLoading(true)
    setError(null)

    try {
      // First check if the table exists
      const { data, error: tableError } = await supabase.from("media").select("id").limit(1)

      if (tableError) {
        if (tableError.message.includes("does not exist") || tableError.code === "42P01") {
          setTableExists(false)
          setError("Media table does not exist. Please create it first.")
          return
        } else {
          console.error("Error checking table existence:", tableError)
          setError("Unable to access media table. Please check your permissions.")
          return
        }
      }

      // If we get here, table exists
      setTableExists(true)
      // Continue with fetching media
      await fetchMedia()
    } catch (error) {
      console.error("Error in checkTableAndFetchMedia:", error)
      setError("Failed to access media library. Please check your database configuration.")
    } finally {
      setLoading(false)
    }
  }

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false })

      if (error) {
        if (error.message.includes("does not exist")) {
          setTableExists(false)
          setError("Media table does not exist. Please create it first.")
        } else {
          setError(`Error fetching media: ${error.message}`)
        }
        return
      }

      setMediaItems(data || [])
      setTableExists(true)
    } catch (error) {
      console.error("Error fetching media:", error)
      setError("Failed to fetch media items.")
    }
  }

  const createMediaTable = async () => {
    try {
      setLoading(true)

      // Create the media table using a direct SQL query
      const { error } = await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS media (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            filename VARCHAR(255) NOT NULL,
            original_filename VARCHAR(255) NOT NULL,
            file_path TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            mime_type VARCHAR(100) NOT NULL,
            alt_text TEXT,
            caption TEXT,
            width INTEGER,
            height INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);
          CREATE INDEX IF NOT EXISTS idx_media_mime_type ON media(mime_type);
        `,
      })

      if (error) {
        console.error("Error creating table:", error)
        setError(`Failed to create media table: ${error.message}`)
        return
      }

      // Refresh the page after creating the table
      await checkTableAndFetchMedia()
    } catch (error) {
      console.error("Error in createMediaTable:", error)
      setError("Failed to create media table.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return

    setDeleting(true)
    try {
      // Delete file from storage
      const { error: storageError } = await supabase.storage.from("media").remove([selectedItem.file_path])

      if (storageError) {
        console.error("Error deleting file from storage:", storageError)
      }

      // Delete record from database
      const { error: dbError } = await supabase.from("media").delete().eq("id", selectedItem.id)

      if (dbError) {
        throw dbError
      }

      // Update state
      setMediaItems((prev) => prev.filter((item) => item.id !== selectedItem.id))
      setDeleteDialogOpen(false)
      setSelectedItem(null)
    } catch (error) {
      console.error("Error deleting media:", error)
      setError("Failed to delete media item.")
    } finally {
      setDeleting(false)
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        // Could add a toast notification here
        console.log("URL copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err)
      })
  }

  const filteredItems = searchQuery
    ? mediaItems.filter(
        (item) =>
          item.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.alt_text && item.alt_text.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : mediaItems

  if (!tableExists) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Media Library</h1>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The media table does not exist in your database. You need to create it first to use the media library.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Database className="h-16 w-16 mx-auto text-gray-400" />
              <h3 className="text-lg font-semibold">Media Table Not Found</h3>
              <p className="text-gray-600">
                The media library requires a database table to store file information. Click the button below to create
                the required table.
              </p>
              <Button onClick={createMediaTable} disabled={loading}>
                {loading ? "Creating Table..." : "Create Media Table"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <Link href="/admin/media/upload">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload New
          </Button>
        </Link>
      </div>

      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Upload className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No media items found</p>
          <Link href="/admin/media/upload">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Your First File
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => {
            const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${item.file_path}`

            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-square bg-gray-100">
                  {item.mime_type.startsWith("image/") ? (
                    <img
                      src={fileUrl || "/placeholder.svg"}
                      alt={item.alt_text || item.original_filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-500">
                        {item.mime_type.split("/")[1].toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCopyUrl(fileUrl)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(fileUrl, "_blank")}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open in New Tab
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(item)
                            setDeleteDialogOpen(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate" title={item.original_filename}>
                    {item.original_filename}
                  </p>
                  <p className="text-xs text-gray-500">{formatFileSize(item.file_size)}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Media</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this media item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
