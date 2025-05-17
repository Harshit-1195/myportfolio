// AWS S3 Configuration and Utilities
import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Initialize S3 client
// In production, use environment variables for these values
let s3Client: S3Client | null = null

export function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    })
  }
  return s3Client
}

// Upload a file to S3
export async function uploadFileToS3(file: File | Buffer, key: string, contentType?: string): Promise<string> {
  try {
    const client = getS3Client()
    const bucketName = process.env.AWS_S3_BUCKET_NAME || ""

    const upload = new Upload({
      client,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: file,
        ContentType: contentType || file instanceof File ? file.type : undefined,
        ACL: "public-read", // Make the file publicly accessible
      },
    })

    await upload.done()

    // Return the URL to the uploaded file
    return `https://${bucketName}.s3.amazonaws.com/${key}`
  } catch (error) {
    console.error("Error uploading file to S3:", error)
    throw error
  }
}

// Get a signed URL for downloading a file (time-limited access)
export async function getSignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  try {
    const client = getS3Client()
    const bucketName = process.env.AWS_S3_BUCKET_NAME || ""

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    return await getSignedUrl(client, command, { expiresIn })
  } catch (error) {
    console.error("Error generating signed URL:", error)
    throw error
  }
}

// Delete a file from S3
export async function deleteFileFromS3(key: string): Promise<boolean> {
  try {
    const client = getS3Client()
    const bucketName = process.env.AWS_S3_BUCKET_NAME || ""

    await client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    )

    return true
  } catch (error) {
    console.error("Error deleting file from S3:", error)
    return false
  }
}

// List files in an S3 bucket/prefix
export async function listFilesInS3(prefix = ""): Promise<{ key: string; size: number; lastModified: Date }[]> {
  try {
    const client = getS3Client()
    const bucketName = process.env.AWS_S3_BUCKET_NAME || ""

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    })

    const response = await client.send(command)

    if (!response.Contents) {
      return []
    }

    return response.Contents.map((item) => ({
      key: item.Key || "",
      size: item.Size || 0,
      lastModified: item.LastModified || new Date(),
    }))
  } catch (error) {
    console.error("Error listing files in S3:", error)
    return []
  }
}

// Generate a public URL for an S3 object
export function getPublicS3Url(key: string): string {
  const bucketName = process.env.AWS_S3_BUCKET_NAME || ""
  return `https://${bucketName}.s3.amazonaws.com/${key}`
}

// Check if a file exists in S3
export async function checkFileExistsInS3(key: string): Promise<boolean> {
  try {
    const client = getS3Client()
    const bucketName = process.env.AWS_S3_BUCKET_NAME || ""

    await client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    )

    return true
  } catch (error) {
    if ((error as any).name === "NoSuchKey") {
      return false
    }
    console.error("Error checking if file exists in S3:", error)
    throw error
  }
}
