"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/file-upload"
import { Search, Upload, Eye, Grid, List } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

interface MediaLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
  accept?: string
  multiple?: boolean
}

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  accept = "*",
  multiple = false,
}: MediaLibraryModalProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterType, setFilterType] = useState<"all" | "images" | "documents" | "videos">("all")
  const [activeTab, setActiveTab] = useState("library")

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (isOpen) {
      fetchMedia()
    }
  }, [isOpen])

  useEffect(() => {
    filterMedia()
  }, [media, searchQuery, filterType, accept])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setMedia(data || [])
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterMedia = () => {
    let filtered = media

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.alt_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.caption?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((item) => {
        switch (filterType) {
          case "images":
            return item.mime_type.startsWith("image/")
          case "documents":
            return item.mime_type.includes("pdf") || item.mime_type.includes("document")
          case "videos":
            return item.mime_type.startsWith("video/")
          default:
            return true
        }
      })
    }

    // Filter by accept prop
    if (accept !== "*") {
      if (accept.includes("image/*")) {
        filtered = filtered.filter((item) => item.mime_type.startsWith("image/"))
      } else if (accept.includes("video/*")) {
        filtered = filtered.filter((item) => item.mime_type.startsWith("video/"))
      }
    }

    setFilteredMedia(filtered)
  }

  const handleSelect = (item: MediaItem) => {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${item.file_path}`

    if (multiple) {
      if (selectedItems.includes(url)) {
        setSelectedItems(selectedItems.filter((id) => id !== url))
      } else {
        setSelectedItems([...selectedItems, url])
      }
    } else {
      onSelect(url)
    }
  }

  const handleMultipleSelect = () => {
    if (selectedItems.length > 0) {
      // For multiple selection, you might want to handle this differently
      onSelect(selectedItems[0]) // For now, just select the first one
    }
  }

  const handleUploadComplete = () => {
    fetchMedia()
    setActiveTab("library")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileTypeIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "🖼️"
    if (mimeType.startsWith("video/")) return "🎥"
    if (mimeType.includes("pdf")) return "📄"
    return "📁"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Media Library</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="library" className="data-[state=active]:bg-gray-700">
              <Grid className="h-4 w-4 mr-2" />
              Library
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-gray-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterType === "images" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("images")}
                >
                  Images
                </Button>
                <Button
                  variant={filterType === "documents" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("documents")}
                >
                  Docs
                </Button>
                <Button
                  variant={filterType === "videos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("videos")}
                >
                  Videos
                </Button>
              </div>

              <div className="flex gap-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Media Grid/List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No media found</p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredMedia.map((item) => {
                    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${item.file_path}`
                    const isSelected = selectedItems.includes(url)

                    return (
                      <div
                        key={item.id}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          isSelected ? "border-blue-500 bg-blue-500/10" : "border-gray-700 hover:border-gray-600"
                        }`}
                        onClick={() => handleSelect(item)}
                      >
                        <div className="aspect-square bg-gray-800 flex items-center justify-center">
                          {item.mime_type.startsWith("image/") ? (
                            <img
                              src={url || "/placeholder.svg"}
                              alt={item.alt_text || item.original_filename}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-4xl">{getFileTypeIcon(item.mime_type)}</div>
                          )}
                        </div>

                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="h-6 w-6 text-white" />
                          </div>
                        </div>

                        <div className="p-2 bg-gray-800">
                          <p className="text-xs text-white truncate">{item.original_filename}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(item.file_size)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredMedia.map((item) => {
                    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${item.file_path}`
                    const isSelected = selectedItems.includes(url)

                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                          isSelected ? "bg-blue-500/10 border border-blue-500" : "bg-gray-800 hover:bg-gray-750"
                        }`}
                        onClick={() => handleSelect(item)}
                      >
                        <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                          {item.mime_type.startsWith("image/") ? (
                            <img
                              src={url || "/placeholder.svg"}
                              alt={item.alt_text || item.original_filename}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <span className="text-lg">{getFileTypeIcon(item.mime_type)}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{item.original_filename}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{formatFileSize(item.file_size)}</span>
                            <Badge variant="secondary" className="text-xs">
                              {item.mime_type.split("/")[0]}
                            </Badge>
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8">
              <FileUpload bucket="assets" folder="uploads" accept={accept} onUploadComplete={handleUploadComplete} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            {filteredMedia.length} items
            {multiple && selectedItems.length > 0 && ` • ${selectedItems.length} selected`}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {multiple && selectedItems.length > 0 && (
              <Button onClick={handleMultipleSelect}>Select {selectedItems.length} Items</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
