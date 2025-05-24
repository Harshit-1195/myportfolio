"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileUpload } from "@/components/file-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MediaUploadPage() {
  const [uploadedItems, setUploadedItems] = useState<any[]>([])
  const router = useRouter()

  const handleUploadComplete = (mediaItem: any) => {
    setUploadedItems((prev) => [...prev, mediaItem])
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Link href="/admin/media">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Media
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Upload Media</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload New File</CardTitle>
            <CardDescription>Upload images and other files to your media library</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload onUploadComplete={handleUploadComplete} />
          </CardContent>
        </Card>

        {uploadedItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recently Uploaded</CardTitle>
              <CardDescription>Files you've uploaded in this session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedItems.map((item) => (
                  <div key={item.id} className="flex items-center p-2 border rounded">
                    {item.mime_type.startsWith("image/") ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${item.file_path}`}
                        alt={item.alt_text || item.original_filename}
                        className="w-16 h-16 object-cover mr-4"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mr-4">
                        <span className="text-xs text-gray-500">{item.mime_type.split("/")[1]}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{item.original_filename}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(item.file_size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
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
