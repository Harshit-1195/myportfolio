"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Plus, Pencil, Trash2, FileUp, Download } from "lucide-react"
import type { Asset } from "@/lib/cms"

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Form state for new/edit asset
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file_url: "",
    file_type: "",
    file_size: "",
    version: "",
    is_active: true,
  })

  // File upload state
  const [file, setFile] = useState<File | null>(null)

  // Fetch assets on component mount
  useEffect(() => {
    fetchAssets()
  }, [])

  // Function to fetch assets
  const fetchAssets = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/assets")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch assets")
      }

      setAssets(data.assets)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error fetching assets:", err)
    } finally {
      setLoading(false)
    }
  }

  // Function to handle file upload to AWS S3
  const handleFileUpload = async () => {
    if (!file) return null

    try {
      setIsUploading(true)

      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("file", file)

      // Generate a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      formData.append("fileName", fileName)

      // Upload to S3 via API route
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload file")
      }

      return {
        url: data.url,
        size: file.size,
        type: file.type,
      }
    } catch (err) {
      console.error("Error uploading file:", err)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  // Function to create a new asset
  const createAsset = async () => {
    try {
      // Upload file if selected
      let fileData = null
      if (file) {
        fileData = await handleFileUpload()
        if (!fileData) {
          throw new Error("Failed to upload file")
        }
      }

      const payload = {
        name: formData.name,
        description: formData.description || null,
        file_url: fileData ? fileData.url : formData.file_url,
        file_type: fileData ? fileData.type : formData.file_type,
        file_size: fileData ? fileData.size : Number.parseInt(formData.file_size) || null,
        version: formData.version || null,
        is_active: formData.is_active,
      }

      const response = await fetch("/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create asset")
      }

      // Refresh assets list
      fetchAssets()

      // Reset form
      resetForm()

      return data.asset
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error creating asset:", err)
      return null
    }
  }

  // Function to update an asset
  const updateAsset = async (id: string) => {
    try {
      // Upload file if selected
      let fileData = null
      if (file) {
        fileData = await handleFileUpload()
        if (!fileData) {
          throw new Error("Failed to upload file")
        }
      }

      const payload = {
        name: formData.name,
        description: formData.description || null,
        file_url: fileData ? fileData.url : formData.file_url,
        file_type: fileData ? fileData.type : formData.file_type,
        file_size: fileData ? fileData.size : Number.parseInt(formData.file_size) || null,
        version: formData.version || null,
        is_active: formData.is_active,
      }

      const response = await fetch(`/api/assets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update asset")
      }

      // Refresh assets list
      fetchAssets()

      // Reset form
      resetForm()

      return data.asset
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error updating asset:", err)
      return null
    }
  }

  // Function to delete an asset
  const deleteAsset = async (id: string) => {
    try {
      const response = await fetch(`/api/assets/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete asset")
      }

      // Refresh assets list
      fetchAssets()

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error deleting asset:", err)
      return false
    }
  }

  // Function to reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      file_url: "",
      file_type: "",
      file_size: "",
      version: "",
      is_active: true,
    })
    setFile(null)
    setSelectedAsset(null)
  }

  // Function to handle edit button click
  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset)
    setFormData({
      name: asset.name,
      description: asset.description || "",
      file_url: asset.file_url,
      file_type: asset.file_type,
      file_size: asset.file_size?.toString() || "",
      version: asset.version || "",
      is_active: asset.is_active,
    })
  }

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedAsset) {
      await updateAsset(selectedAsset.id)
    } else {
      await createAsset()
    }
  }

  // Function to handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // Function to format file size
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown"

    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  return (
    <div className="container mx-auto py-28 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Asset Management</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 glass-panel text-white border-white/20 hover:bg-white/10">
              <Plus className="w-4 h-4" />
              Add New Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedAsset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <div className="flex items-center gap-2">
                  <Input id="file" type="file" onChange={handleFileChange} className="flex-1" />
                  {file && (
                    <div className="text-sm text-gray-500">
                      {file.name} ({formatFileSize(file.size)})
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {selectedAsset
                    ? "Upload a new file or keep the existing one."
                    : "Upload a file or provide a URL below."}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file_url">File URL</Label>
                <Input
                  id="file_url"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder={file ? "Will be replaced by uploaded file" : ""}
                  disabled={!!file}
                  required={!file && !selectedAsset}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="file_type">File Type</Label>
                  <Input
                    id="file_type"
                    value={formData.file_type}
                    onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                    placeholder={file ? file.type : "e.g., application/pdf"}
                    disabled={!!file}
                    required={!file && !selectedAsset}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file_size">File Size (bytes)</Label>
                  <Input
                    id="file_size"
                    type="number"
                    value={formData.file_size}
                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                    placeholder={file ? file.size.toString() : ""}
                    disabled={!!file}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : selectedAsset ? "Update Asset" : "Create Asset"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-md mb-6">{error}</div>}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white/70">Loading assets...</p>
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-lg">
          <FileUp className="h-12 w-12 mx-auto text-white/50" />
          <h2 className="mt-4 text-xl font-semibold text-white">No assets found</h2>
          <p className="mt-2 text-white/70">Upload your first asset to get started.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.file_type}</TableCell>
                  <TableCell>{formatFileSize(asset.file_size)}</TableCell>
                  <TableCell>{asset.version || "—"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${asset.is_active ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"}`}
                    >
                      {asset.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(asset.updated_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => window.open(asset.file_url, "_blank")}>
                        <Download className="h-4 w-4" />
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(asset)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Edit Asset</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="version">Version</Label>
                                <Input
                                  id="version"
                                  value={formData.version}
                                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="file">File</Label>
                              <div className="flex items-center gap-2">
                                <Input id="file" type="file" onChange={handleFileChange} className="flex-1" />
                                {file && (
                                  <div className="text-sm text-gray-500">
                                    {file.name} ({formatFileSize(file.size)})
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">Upload a new file or keep the existing one.</p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="file_url">File URL</Label>
                              <Input
                                id="file_url"
                                value={formData.file_url}
                                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                                placeholder={file ? "Will be replaced by uploaded file" : ""}
                                disabled={!!file}
                                required={!file}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="file_type">File Type</Label>
                                <Input
                                  id="file_type"
                                  value={formData.file_type}
                                  onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                                  placeholder={file ? file.type : "e.g., application/pdf"}
                                  disabled={!!file}
                                  required={!file}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="file_size">File Size (bytes)</Label>
                                <Input
                                  id="file_size"
                                  type="number"
                                  value={formData.file_size}
                                  onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                                  placeholder={file ? file.size.toString() : ""}
                                  disabled={!!file}
                                />
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                              />
                              <Label htmlFor="is_active">Active</Label>
                            </div>

                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                  Cancel
                                </Button>
                              </DialogClose>
                              <Button type="submit" disabled={isUploading}>
                                {isUploading ? "Uploading..." : "Update Asset"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the asset.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteAsset(asset.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
