"use server"

// Replace Supabase with static data for now
// Later we can implement AWS S3 and a database solution

// Types for our assets
export interface Asset {
  id: string
  name: string
  description: string | null
  file_url: string
  file_type: string
  file_size: number | null
  version: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Static data to replace database
const assets: Asset[] = [
  {
    id: "1",
    name: "resume",
    description: "Professional Resume",
    file_url: "/resume.pdf",
    file_type: "application/pdf",
    file_size: 500000,
    version: "1.0",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "presentation",
    description: "Portfolio Presentation",
    file_url: "/portfolio.pptx",
    file_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    file_size: 2000000,
    version: "1.0",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Function to track downloads
export async function trackDownload(assetId: string, userAgent?: string, referrer?: string) {
  // Just log for now, would be stored in a database in production
  console.log(`Download tracked: ${assetId}`, { userAgent, referrer })
}

// Function to get the latest active resume URL
export async function getResumeUrl(): Promise<string> {
  const resume = assets.find((asset) => asset.name === "resume" && asset.is_active)
  return resume?.file_url || "/resume.pdf"
}

// Function to get the latest active presentation URL
export async function getPresentationUrl(): Promise<string> {
  const presentation = assets.find((asset) => asset.name === "presentation" && asset.is_active)
  return presentation?.file_url || "/portfolio.pptx"
}

// Function to get all assets
export async function getAllAssets(): Promise<Asset[]> {
  return assets
}

// Function to create a new asset
export async function createAsset(asset: Omit<Asset, "id" | "created_at" | "updated_at">): Promise<Asset | null> {
  const newAsset: Asset = {
    ...asset,
    id: Math.random().toString(36).substring(2, 15),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  assets.push(newAsset)
  return newAsset
}

// Function to update an asset
export async function updateAsset(id: string, updates: Partial<Asset>): Promise<Asset | null> {
  const index = assets.findIndex((asset) => asset.id === id)
  if (index === -1) return null

  assets[index] = {
    ...assets[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  return assets[index]
}

// Function to delete an asset
export async function deleteAsset(id: string): Promise<boolean> {
  const index = assets.findIndex((asset) => asset.id === id)
  if (index === -1) return false

  assets.splice(index, 1)
  return true
}
