import { getSupabaseBrowserClient, getSupabaseServerClient } from "./supabase"

// Types
export interface FileUploadResult {
  path: string
  url: string
  size: number
  contentType: string
}

// Constants
export const STORAGE_BUCKET = "assets"

// Upload a file to Supabase Storage
export async function uploadFile(file: File | Blob, bucket = STORAGE_BUCKET, path?: string): Promise<FileUploadResult> {
  const supabase = getSupabaseBrowserClient()

  // Generate a unique file path if not provided
  if (!path) {
    const fileExt = file instanceof File ? file.name.split(".").pop() : "blob"
    path = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
  }

  // Upload the file
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("Error uploading file:", error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  if (!data) {
    throw new Error("Upload failed with no error")
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path)

  return {
    path: data.path,
    url: publicUrl,
    size: file instanceof File ? file.size : 0,
    contentType: file instanceof File ? file.type : "application/octet-stream",
  }
}

// List files in a bucket/folder
export async function listFiles(
  bucket = STORAGE_BUCKET,
  folder = "",
): Promise<{ name: string; url: string; size: number; updatedAt: string }[]> {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    sortBy: { column: "name", order: "asc" },
  })

  if (error) {
    console.error("Error listing files:", error)
    throw new Error(`Failed to list files: ${error.message}`)
  }

  if (!data) {
    return []
  }

  return data.map((item) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(folder ? `${folder}/${item.name}` : item.name)

    return {
      name: item.name,
      url: publicUrl,
      size: item.metadata?.size || 0,
      updatedAt: item.metadata?.lastModified || new Date().toISOString(),
    }
  })
}

// Delete a file
export async function deleteFile(path: string, bucket = STORAGE_BUCKET): Promise<boolean> {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    console.error("Error deleting file:", error)
    throw new Error(`Failed to delete file: ${error.message}`)
  }

  return true
}

// Get a public URL for a file
export function getPublicUrl(path: string, bucket = STORAGE_BUCKET): string {
  const supabase = getSupabaseBrowserClient()

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path)

  return publicUrl
}

// Create a signed URL (for private files)
export async function createSignedUrl(path: string, expiresIn = 60, bucket = STORAGE_BUCKET): Promise<string> {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

  if (error) {
    console.error("Error creating signed URL:", error)
    throw new Error(`Failed to create signed URL: ${error.message}`)
  }

  if (!data) {
    throw new Error("Failed to create signed URL with no error")
  }

  return data.signedUrl
}

// Download a file directly (server-side)
export async function downloadFile(path: string, bucket = STORAGE_BUCKET): Promise<Blob> {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.storage.from(bucket).download(path)

  if (error) {
    console.error("Error downloading file:", error)
    throw new Error(`Failed to download file: ${error.message}`)
  }

  if (!data) {
    throw new Error("Download failed with no error")
  }

  return data
}
