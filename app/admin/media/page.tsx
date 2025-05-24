"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAllMedia, deleteMedia, deleteFile } from "@/lib/cms-service"
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
import { Upload, Search, MoreVertical, Trash, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function MediaLibraryPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const items = await getAllMedia()
      setMediaItems(items)
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return

    setDeleting(true)
    try {
      // Delete file from storage
      await deleteFile(selectedItem.file_path)

      // Delete record from database
      await deleteMedia(selectedItem.id)

      // Update state
      setMediaItems((prev) => prev.filter((item) => item.id !== selectedItem.id))
      setDeleteDialogOpen(false)
      setSelectedItem(null)
    } catch (error) {
      console.error("Error deleting media:", error)
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
          <p className="text-gray-500">No media items found</p>
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
