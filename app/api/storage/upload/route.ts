import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const API_MAX_SIZE_BYTES = 4 * 1024 * 1024 // 4MB

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Server configuration error: Missing Supabase credentials")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const folder = (formData.get("folder") as string) || "uploads"
    const bucket = (formData.get("bucket") as string) || "media"

    if (file.size > API_MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File size exceeds the maximum limit of ${API_MAX_SIZE_BYTES / 1024 / 1024}MB` },
        { status: 413 },
      )
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed. Supported types: JPG, PNG, WebP, PDF` },
        { status: 400 },
      )
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    const { data: storageData, error: storageError } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    })

    if (storageError) {
      console.error("Supabase storage error:", storageError)
      return NextResponse.json({ error: `Failed to upload file to storage: ${storageError.message}` }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(storageData.path)

    const mediaRecord = {
      filename: fileName,
      original_filename: file.name,
      file_path: storageData.path,
      file_size: file.size,
      mime_type: file.type,
      alt_text: (formData.get("alt_text") as string) || null,
      caption: (formData.get("caption") as string) || null,
    }

    const { data: dbInsertData, error: dbError } = await supabase.from("media").insert([mediaRecord]).select()

    if (dbError) {
      const fullErrorString = JSON.stringify(dbError, null, 2)
      console.error("Database error inserting media record (full error object):", fullErrorString)

      let clientErrorMessage = "File uploaded to storage, but failed to save media record to database."

      // Check if dbError is an empty object or lacks details
      if (!dbError.message && Object.keys(dbError).length === 0) {
        clientErrorMessage +=
          " The specific database error is not available. Please check server logs for more details."
      } else {
        if (dbError.message) {
          clientErrorMessage += ` Details: ${dbError.message}`
        }
        if (dbError.hint) {
          clientErrorMessage += ` Hint: ${dbError.hint}`
        }
        if (dbError.code) {
          clientErrorMessage += ` (Code: ${dbError.code})`
          // Provide a more specific message for common issues if possible
          if (dbError.code === "23502") {
            // NOT NULL violation
            clientErrorMessage = `Failed to save media record: A required field is missing or null. Please check table constraints. (Code: ${dbError.code})`
          } else if (dbError.code === "23505") {
            // UNIQUE constraint violation
            clientErrorMessage = `Failed to save media record: A unique value constraint was violated. (Code: ${dbError.code})`
          }
        }
      }

      return NextResponse.json(
        { error: clientErrorMessage, rawError: fullErrorString }, // Send stringified error for client if needed
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      file: {
        path: storageData.path,
        url: publicUrl,
        size: file.size,
        type: file.type,
        name: file.name,
        generated_filename: fileName,
        db_record: dbInsertData ? dbInsertData[0] : null,
      },
    })
  } catch (error: any) {
    console.error("Unexpected error in /api/storage/upload:", error)
    let errorMessage = "Failed to upload file due to an unexpected server error."
    if (error.message) {
      errorMessage = error.message
    }
    if (error.name === "PayloadTooLargeError" || (error.message && error.message.includes("body size limit"))) {
      return NextResponse.json(
        { error: `File is too large. Maximum size is ${API_MAX_SIZE_BYTES / 1024 / 1024}MB.` },
        { status: 413 },
      )
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
