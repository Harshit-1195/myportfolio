/**
 * This file contains data functions that use Supabase
 */
import {
  getResumeUrl as getResumeUrlFromCMS,
  getPresentationUrl as getPresentationUrlFromCMS,
  trackAssetDownload,
} from "./cms-service"

// Function to get resume URL - making it async
export async function getResumeUrl(): Promise<string> {
  try {
    return await getResumeUrlFromCMS()
  } catch (error) {
    console.error("Error getting resume URL:", error)
    // Return a static URL to the resume PDF as fallback
    return "/resume.pdf"
  }
}

// Function to get presentation URL - making it async
export async function getPresentationUrl(): Promise<string> {
  try {
    return await getPresentationUrlFromCMS()
  } catch (error) {
    console.error("Error getting presentation URL:", error)
    // Return a static URL to the presentation file as fallback
    return "/portfolio.pptx"
  }
}

// Function to track downloads (already async)
export async function trackDownload(assetId: string, userAgent?: string, referrer?: string): Promise<void> {
  try {
    await trackAssetDownload(assetId, userAgent, referrer)
  } catch (error) {
    // In a real app, this would track the download in a database
    console.log(`Download tracked: ${assetId}`, { userAgent, referrer })
  }
}
