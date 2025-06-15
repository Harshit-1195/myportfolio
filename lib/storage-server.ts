import { getSupabaseClient } from "./supabase"

export async function uploadFileServer(file: File | Blob, bucket = "assets", path?: string) {
  const supabase = getSupabaseClient()

  if (!path) {
    const ext = file instanceof File ? file.name.split(".").pop() : "blob"
    path = `${Math.random().toString(36).slice(2)}_${Date.now()}.${ext}`
  }

  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error || !data) throw new Error(error?.message || "Upload failed")

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
