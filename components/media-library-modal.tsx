"use client"

import { useState, useEffect, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedFileUpload } from "@/components/enhanced-file-upload"
import { Search, Upload, Eye, Grid, List, AlertCircle, ImageIcon, FileText, FileIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

interface MediaLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
  accept?: string
  multiple?: boolean
}

// Determine initial preview state based on environment.
// This is a stable value per component instance.
const initialPreviewHint =
  typeof process !== "undefined" && // Ensure process is defined (for Node.js like envs)
  (process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_SUPABASE_URL)

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  accept = "image/avif,image/webp,image/jpeg,image/png,application/pdf",
  multiple = false,
}: MediaLibraryModalProps) {
  const supabase = createClientComponentClient()

  const generateSampleMedia = useCallback((): MediaItem[] => {
    const imageTypes = ["image/jpeg", "image/png", "image/webp"]
    const documentTypes = ["application/pdf"]
    const samples: MediaItem[] = []
    for (let i = 0; i < 6; i++) {
      const isImage = i < 3
      const mimeType = isImage ? imageTypes[i % imageTypes.length] : documentTypes[0]
      const extension = mimeType.split("/")[1]
      const filename = `sample-${isImage ? "image" : "doc"}-${i + 1}.${extension}`
      samples.push({
        id: `sample-${i + 1}`,
        filename,
        original_filename: filename,
        file_path: `samples/${filename}`,
        file_size: Math.floor(Math.random() * (isImage ? 2000000 : 500000)) + (isImage ? 500000 : 100000),
        mime_type: mimeType,
        alt_text: isImage ? `Sample ${extension} image ${i + 1}` : undefined,
        caption: isImage ? `A sample ${extension} image for preview.` : undefined,
        width: isImage ? 1200 : undefined,
        height: isImage ? 800 : undefined,
        created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      })
    }
    return samples
  }, [])

  const [isPreviewModeActive, setIsPreviewModeActive] = useState(initialPreviewHint)
  const [media, setMedia] = useState<MediaItem[]>(() => (initialPreviewHint ? generateSampleMedia() : []))
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true) // Start as true, fetchMedia will set to false
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterType, setFilterType] = useState<"all" | "images" | "documents">("all")
  const [activeTab, setActiveTab] = useState("library")

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    setError(null) // Clear previous errors

    // If Supabase URL is not configured, we must stick with sample data.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setIsPreviewModeActive(true)
      // Ensure sample media is loaded if not already by initial state
      if (!initialPreviewHint) setMedia(generateSampleMedia())
      setLoading(false)
      return
    }

    // Attempt to fetch from Supabase
    try {
      const { data, error: dbError } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false })

      if (dbError) {
        console.error("Supabase error fetching media:", dbError)
        if (dbError.message.includes("does not exist") || dbError.code === "42P01") {
          setError(
            "The 'media' table does not exist in your database. Please go to the /admin/media page to create it. Displaying sample media for now.",
          )
        } else {
          setError(`Database error: ${dbError.message}. Displaying sample media.`)
        }
        // Fallback to sample media if not already set by initial state
        if (!initialPreviewHint) {
          // initialPreviewHint is a const defined at the top of the component
          setMedia(generateSampleMedia()) // generateSampleMedia is a useCallback defined in the component
        }
        setIsPreviewModeActive(true) // Ensure we are in preview mode after an error
      } else {
        // Successfully fetched real data
        setMedia(data || [])
        setIsPreviewModeActive(false)
      }
    } catch (catchedError: any) {
      console.error("Error fetching media:", catchedError)
      setError(catchedError.message || "Failed to fetch media items. Displaying sample media.")
      // Fallback to sample media if not already set by initial state
      if (!initialPreviewHint) {
        setMedia(generateSampleMedia())
      }
      setIsPreviewModeActive(true)
    } finally {
      setLoading(false)
    }
  }, [supabase, generateSampleMedia]) // initialPreviewHint is stable, no need to list

  useEffect(() => {
    if (isOpen) {
      // When modal opens, always attempt to fetch.
      // Initial state might already have sample data if initialPreviewHint was true.
      fetchMedia()
    } else {
      // Reset states when modal is closed for a clean reopen
      //setError(null); // Error is reset by fetchMedia
      setSearchQuery("")
      setSelectedItems([])
      setActiveTab("library")
      // Keep isPreviewModeActive and media as they are, fetchMedia will refresh them.
      // Or, reset to initial state:
      // setIsPreviewModeActive(initialPreviewHint);
      // setMedia(initialPreviewHint ? generateSampleMedia() : []);
      // setLoading(true); // So it shows loading on next open
    }
  }, [isOpen, fetchMedia])

  useEffect(() => {
    setFilteredMedia(
      media.filter((item) => {
        const searchMatch =
          !searchQuery ||
          item.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.alt_text && item.alt_text.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase()))

        if (!searchMatch) return false

        const typeMatch =
          filterType === "all" ||
          (filterType === "images" && item.mime_type.startsWith("image/")) ||
          (filterType === "documents" && item.mime_type === "application/pdf")

        if (!typeMatch) return false

        if (accept && accept !== "*") {
          const acceptedTypes = accept.split(",").map((t) => t.trim().toLowerCase())
          const mime = item.mime_type.toLowerCase()
          const acceptMatch = acceptedTypes.some((accType) =>
            accType.endsWith("/*") ? mime.startsWith(accType.slice(0, -2)) : mime === accType,
          )
          if (!acceptMatch) return false
        }
        return true
      }),
    )
  }, [media, searchQuery, filterType, accept])

  const handleSelect = (item: MediaItem) => {
    let url = ""
    if (isPreviewModeActive && item.file_path.startsWith("samples/")) {
      const query = encodeURIComponent(item.original_filename)
      url = `/placeholder.svg?height=600&width=800&query=${query}`
    } else {
      const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (baseUrl) {
        url = `${baseUrl}/storage/v1/object/public/media/${item.file_path}`
      } else {
        const query = encodeURIComponent(item.original_filename)
        url = `/placeholder.svg?height=600&width=800&query=${query}&error=supabase_url_missing`
        console.warn("Supabase URL is not defined for a non-sample item.")
      }
    }

    if (multiple) {
      setSelectedItems((prev) => (prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]))
    } else {
      onSelect(url)
      onClose()
    }
  }

  const handleConfirmMultipleSelect = () => {
    if (selectedItems.length > 0) onSelect(selectedItems.join(","))
    onClose()
  }

  const handleUploadComplete = useCallback(
    async (uploadedFile: { path: string; filename: string; size: number; type: string }) => {
      // Optimistically add to UI, then refresh.
      const newMediaItem: MediaItem = {
        id: `new-${Date.now()}`, // Temporary ID
        filename: uploadedFile.filename,
        original_filename: uploadedFile.filename,
        file_path: uploadedFile.path,
        file_size: uploadedFile.size,
        mime_type: uploadedFile.type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setMedia((prev) => [newMediaItem, ...prev])
      setActiveTab("library")
      await fetchMedia() // Refresh from source
    },
    [fetchMedia],
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024,
      sizes = ["Bytes", "KB", "MB", "GB", "TB"],
      i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFilePreviewIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="h-8 w-8 text-blue-400" />
    if (mimeType === "application/pdf") return <FileText className="h-8 w-8 text-red-400" />
    return <FileIcon className="h-8 w-8 text-gray-400" />
  }

  const getFilePreviewUrl = (item: MediaItem) => {
    if (item.mime_type.startsWith("image/")) {
      if (isPreviewModeActive && item.file_path.startsWith("samples/")) {
        const query = encodeURIComponent(item.original_filename)
        return `/placeholder.svg?height=150&width=150&query=${query}`
      }
      const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      return baseUrl
        ? `${baseUrl}/storage/v1/object/public/media/${item.file_path}`
        : `/placeholder.svg?width=150&height=150&query=error_no_base_url`
    }
    return null
  }

  // JSX (render part) remains the same as the previous correct version.
  // It should display alerts for errors or preview mode, loading state,
  // media items, and upload functionality.
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl md:max-w-5xl lg:max-w-6xl max-h-[90vh] bg-gray-900 border-gray-700 text-white flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isPreviewModeActive && !error && (
          <Alert className="bg-yellow-900/30 border-yellow-800/50 text-yellow-300 text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Displaying sample media. Uploads will interact with your Supabase instance if configured.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col min-h-0">
          <TabsList className="bg-gray-800 shrink-0">
            <TabsTrigger value="library" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
              <Grid className="h-4 w-4 mr-2" /> Library
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
              <Upload className="h-4 w-4 mr-2" /> Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-grow space-y-4 flex flex-col min-h-0 pt-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 shrink-0 px-1">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterType === "images" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("images")}
                >
                  Images
                </Button>
                <Button
                  variant={filterType === "documents" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("documents")}
                >
                  Docs
                </Button>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto min-h-0 pr-2">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No media found matching your criteria.</div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {filteredMedia.map((item) => {
                    /* Grid item JSX */
                    const previewUrl = getFilePreviewUrl(item)
                    const itemKey = item.id || item.file_path
                    const isSelected = selectedItems.includes(
                      isPreviewModeActive && item.file_path.startsWith("samples/")
                        ? `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(item.original_filename)}`
                        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${item.file_path}`,
                    )
                    return (
                      <div
                        key={itemKey}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${isSelected ? "border-blue-500 shadow-lg" : "border-gray-700 hover:border-gray-500"}`}
                        onClick={() => handleSelect(item)}
                      >
                        <div className="aspect-square bg-gray-800 flex items-center justify-center">
                          {previewUrl ? (
                            <img
                              src={previewUrl || "/placeholder.svg"}
                              alt={item.alt_text || item.original_filename}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg?width=150&height=150"
                              }}
                            />
                          ) : (
                            <div className="p-4 flex flex-col items-center justify-center text-center">
                              {getFilePreviewIcon(item.mime_type)}
                              <span className="mt-2 text-xs text-gray-400 break-all">
                                {item.mime_type.split("/")[1]?.toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div
                          className={`absolute inset-0 bg-black transition-all flex items-center justify-center ${isSelected ? "bg-opacity-30" : "bg-opacity-0 group-hover:bg-opacity-50"}`}
                        >
                          <Eye
                            className={`h-8 w-8 text-white transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                          />
                        </div>
                        <div className="p-2 bg-gray-800/90 backdrop-blur-sm absolute bottom-0 left-0 right-0">
                          <p className="text-xs text-white truncate" title={item.original_filename}>
                            {item.original_filename}
                          </p>
                          <p className="text-xs text-gray-400">{formatFileSize(item.file_size)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div> /* List view JSX */
              ) : (
                <div className="space-y-2">
                  {filteredMedia.map((item) => {
                    const previewUrl = getFilePreviewUrl(item)
                    const itemKey = item.id || item.file_path
                    const isSelected = selectedItems.includes(
                      isPreviewModeActive && item.file_path.startsWith("samples/")
                        ? `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(item.original_filename)}`
                        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${item.file_path}`,
                    )
                    return (
                      <div
                        key={itemKey}
                        className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-blue-600/20 border border-blue-500" : "bg-gray-800 hover:bg-gray-700/70"}`}
                        onClick={() => handleSelect(item)}
                      >
                        <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center shrink-0 overflow-hidden">
                          {previewUrl ? (
                            <img
                              src={previewUrl || "/placeholder.svg"}
                              alt={item.alt_text || item.original_filename}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg?width=48&height=48"
                              }}
                            />
                          ) : (
                            getFilePreviewIcon(item.mime_type)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate" title={item.original_filename}>
                            {item.original_filename}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{formatFileSize(item.file_size)}</span>
                            <Badge variant="outline" className="text-xs border-gray-600 bg-gray-700 text-gray-300">
                              {item.mime_type.split("/")[0]}
                            </Badge>
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {isSelected && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></div>}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="flex-grow space-y-4 p-1 flex flex-col items-center justify-center">
            <div className="border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors rounded-lg p-6 md:p-8 w-full max-w-lg">
              <EnhancedFileUpload
                accept={accept}
                folder="media" // Ensures files go into a 'media' subfolder within the bucket
                bucket="media" // Ensures the 'media' bucket is used by the API
                onUploadComplete={handleUploadComplete}
                onError={(uploadError) => setError(`Upload failed: ${uploadError}`)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t border-gray-700 shrink-0 px-1">
          <div className="text-sm text-gray-400">
            {filteredMedia.length} items found.
            {multiple && selectedItems.length > 0 && ` ${selectedItems.length} selected.`}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {multiple && (
              <Button onClick={handleConfirmMultipleSelect} disabled={selectedItems.length === 0}>
                Select{" "}
                {selectedItems.length > 0
                  ? `${selectedItems.length} Item${selectedItems.length > 1 ? "s" : ""}`
                  : "Items"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
