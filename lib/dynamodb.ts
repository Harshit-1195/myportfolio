// DynamoDB Configuration and Utilities
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb"
import { v4 as uuidv4 } from "uuid"

// Initialize DynamoDB client
let dynamoClient: DynamoDBClient | null = null
let docClient: DynamoDBDocumentClient | null = null

export function getDynamoClient() {
  if (!dynamoClient) {
    dynamoClient = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    })
  }
  return dynamoClient
}

export function getDocClient() {
  if (!docClient) {
    const client = getDynamoClient()
    docClient = DynamoDBDocumentClient.from(client)
  }
  return docClient
}

// Table names
export const ASSETS_TABLE = process.env.DYNAMODB_ASSETS_TABLE || "portfolio-assets"
export const SUBMISSIONS_TABLE = process.env.DYNAMODB_SUBMISSIONS_TABLE || "portfolio-submissions"
export const DOWNLOADS_TABLE = process.env.DYNAMODB_DOWNLOADS_TABLE || "portfolio-asset-downloads"
export const BLOG_POSTS_TABLE = process.env.DYNAMODB_BLOG_POSTS_TABLE || "portfolio-blog-posts"
export const PROJECTS_TABLE = process.env.DYNAMODB_PROJECTS_TABLE || "portfolio-projects"
export const CASE_STUDIES_TABLE = process.env.DYNAMODB_CASE_STUDIES_TABLE || "portfolio-case-studies"
export const LOGO_STORIES_TABLE = process.env.DYNAMODB_LOGO_STORIES_TABLE || "portfolio-logo-stories"

// Generic Types
export interface BaseItem {
  id: string
  created_at: string
  updated_at: string
}

// Asset type
export interface Asset extends BaseItem {
  name: string
  description: string | null
  file_url: string
  file_type: string
  file_size: number | null
  version: string | null
  is_active: boolean
}

// Form submission type
export interface FormSubmission extends BaseItem {
  first_name: string
  last_name: string
  email: string
  subject: string | null
  message: string
  user_agent: string | null
  referrer: string | null
}

// Asset download type
export interface AssetDownload extends BaseItem {
  asset_id: string
  user_agent: string | null
  referrer: string | null
}

// Blog post type
export interface BlogPost extends BaseItem {
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string | null
  author: string
  category: string
  tags: string[]
  published_at: string | null
  is_published: boolean
  views: number
}

// Project type
export interface Project extends BaseItem {
  title: string
  slug: string
  description: string
  content: string
  featured_image: string | null
  technologies: string[]
  url: string | null
  github_url: string | null
  is_featured: boolean
  order: number
}

// Case study type
export interface CaseStudy extends BaseItem {
  title: string
  slug: string
  client: string
  description: string
  content: string
  featured_image: string | null
  gallery: string[]
  challenge: string
  solution: string
  results: string
  testimonial: string | null
  testimonial_author: string | null
  is_featured: boolean
  order: number
}

// Logo story type
export interface LogoStory extends BaseItem {
  title: string
  client: string
  description: string
  image: string
  challenge: string
  solution: string
  result: string
  is_featured: boolean
  order: number
}

// Generic CRUD operations
async function getItem<T extends BaseItem>(tableName: string, id: string): Promise<T | null> {
  try {
    const client = getDocClient()
    const command = new GetCommand({
      TableName: tableName,
      Key: { id },
    })

    const response = await client.send(command)
    return (response.Item as T) || null
  } catch (error) {
    console.error(`Error getting item with id ${id} from ${tableName}:`, error)
    return null
  }
}

async function getAllItems<T extends BaseItem>(tableName: string): Promise<T[]> {
  try {
    const client = getDocClient()
    const command = new ScanCommand({
      TableName: tableName,
    })

    const response = await client.send(command)
    return (response.Items as T[]) || []
  } catch (error) {
    console.error(`Error getting all items from ${tableName}:`, error)
    return []
  }
}

async function createItem<T extends Omit<BaseItem, "id" | "created_at" | "updated_at">>(
  tableName: string,
  item: T,
): Promise<(T & BaseItem) | null> {
  try {
    const client = getDocClient()
    const now = new Date().toISOString()
    const newItem = {
      ...item,
      id: uuidv4(),
      created_at: now,
      updated_at: now,
    } as T & BaseItem

    const command = new PutCommand({
      TableName: tableName,
      Item: newItem,
    })

    await client.send(command)
    return newItem
  } catch (error) {
    console.error(`Error creating item in ${tableName}:`, error)
    return null
  }
}

async function updateItem<T extends BaseItem>(tableName: string, id: string, updates: Partial<T>): Promise<T | null> {
  try {
    // First get the existing item
    const existingItem = await getItem<T>(tableName, id)
    if (!existingItem) {
      return null
    }

    const client = getDocClient()
    const now = new Date().toISOString()

    // Build update expression
    let updateExpression = "set updated_at = :updated_at"
    const expressionAttributeValues: Record<string, any> = {
      ":updated_at": now,
    }

    // Add each update field to the expression
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "id" && key !== "created_at") {
        updateExpression += `, ${key} = :${key}`
        expressionAttributeValues[`:${key}`] = value
      }
    })

    const command = new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    })

    const response = await client.send(command)
    return response.Attributes as T
  } catch (error) {
    console.error(`Error updating item with id ${id} in ${tableName}:`, error)
    return null
  }
}

async function deleteItem(tableName: string, id: string): Promise<boolean> {
  try {
    const client = getDocClient()
    const command = new DeleteCommand({
      TableName: tableName,
      Key: { id },
    })

    await client.send(command)
    return true
  } catch (error) {
    console.error(`Error deleting item with id ${id} from ${tableName}:`, error)
    return false
  }
}

async function batchCreateItems<T extends Omit<BaseItem, "id" | "created_at" | "updated_at">>(
  tableName: string,
  items: T[],
): Promise<(T & BaseItem)[]> {
  try {
    const client = getDocClient()
    const now = new Date().toISOString()

    // Create new items with IDs and timestamps
    const newItems = items.map((item) => ({
      ...item,
      id: uuidv4(),
      created_at: now,
      updated_at: now,
    })) as (T & BaseItem)[]

    // DynamoDB has a limit of 25 items per batch write
    const batchSize = 25
    const batches = []

    for (let i = 0; i < newItems.length; i += batchSize) {
      const batch = newItems.slice(i, i + batchSize)

      const putRequests = batch.map((item) => ({
        PutRequest: {
          Item: item,
        },
      }))

      const command = new BatchWriteCommand({
        RequestItems: {
          [tableName]: putRequests,
        },
      })

      batches.push(client.send(command))
    }

    await Promise.all(batches)
    return newItems
  } catch (error) {
    console.error(`Error batch creating items in ${tableName}:`, error)
    return []
  }
}

// Export generic CRUD functions
export const dynamoDB = {
  getItem,
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  batchCreateItems,
}

// Asset specific functions
export async function getAllAssets(): Promise<Asset[]> {
  return dynamoDB.getAllItems<Asset>(ASSETS_TABLE)
}

export async function getAssetById(id: string): Promise<Asset | null> {
  return dynamoDB.getItem<Asset>(ASSETS_TABLE, id)
}

export async function createAsset(asset: Omit<Asset, "id" | "created_at" | "updated_at">): Promise<Asset | null> {
  return dynamoDB.createItem<Omit<Asset, "id" | "created_at" | "updated_at">>(ASSETS_TABLE, asset)
}

export async function updateAsset(id: string, updates: Partial<Asset>): Promise<Asset | null> {
  return dynamoDB.updateItem<Asset>(ASSETS_TABLE, id, updates)
}

export async function deleteAsset(id: string): Promise<boolean> {
  return dynamoDB.deleteItem(ASSETS_TABLE, id)
}

// Form submission functions
export async function getAllFormSubmissions(): Promise<FormSubmission[]> {
  return dynamoDB.getAllItems<FormSubmission>(SUBMISSIONS_TABLE)
}

export async function createFormSubmission(
  submission: Omit<FormSubmission, "id" | "created_at" | "updated_at">,
): Promise<FormSubmission | null> {
  return dynamoDB.createItem<Omit<FormSubmission, "id" | "created_at" | "updated_at">>(SUBMISSIONS_TABLE, submission)
}

// Asset download functions
export async function trackAssetDownload(
  assetId: string,
  userAgent?: string,
  referrer?: string,
): Promise<AssetDownload | null> {
  return dynamoDB.createItem<Omit<AssetDownload, "id" | "created_at" | "updated_at">>(DOWNLOADS_TABLE, {
    asset_id: assetId,
    user_agent: userAgent || null,
    referrer: referrer || null,
  })
}

// Blog post functions
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return dynamoDB.getAllItems<BlogPost>(BLOG_POSTS_TABLE)
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  return dynamoDB.getItem<BlogPost>(BLOG_POSTS_TABLE, id)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const client = getDocClient()
    const command = new QueryCommand({
      TableName: BLOG_POSTS_TABLE,
      IndexName: "SlugIndex", // You'll need to create this GSI
      KeyConditionExpression: "slug = :slug",
      ExpressionAttributeValues: {
        ":slug": slug,
      },
      Limit: 1,
    })

    const response = await client.send(command)
    return (response.Items?.[0] as BlogPost) || null
  } catch (error) {
    console.error(`Error getting blog post with slug ${slug}:`, error)
    return null
  }
}

export async function createBlogPost(
  post: Omit<BlogPost, "id" | "created_at" | "updated_at">,
): Promise<BlogPost | null> {
  return dynamoDB.createItem<Omit<BlogPost, "id" | "created_at" | "updated_at">>(BLOG_POSTS_TABLE, post)
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  return dynamoDB.updateItem<BlogPost>(BLOG_POSTS_TABLE, id, updates)
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  return dynamoDB.deleteItem(BLOG_POSTS_TABLE, id)
}

// Project functions
export async function getAllProjects(): Promise<Project[]> {
  return dynamoDB.getAllItems<Project>(PROJECTS_TABLE)
}

export async function getProjectById(id: string): Promise<Project | null> {
  return dynamoDB.getItem<Project>(PROJECTS_TABLE, id)
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const client = getDocClient()
    const command = new QueryCommand({
      TableName: PROJECTS_TABLE,
      IndexName: "SlugIndex", // You'll need to create this GSI
      KeyConditionExpression: "slug = :slug",
      ExpressionAttributeValues: {
        ":slug": slug,
      },
      Limit: 1,
    })

    const response = await client.send(command)
    return (response.Items?.[0] as Project) || null
  } catch (error) {
    console.error(`Error getting project with slug ${slug}:`, error)
    return null
  }
}

export async function createProject(
  project: Omit<Project, "id" | "created_at" | "updated_at">,
): Promise<Project | null> {
  return dynamoDB.createItem<Omit<Project, "id" | "created_at" | "updated_at">>(PROJECTS_TABLE, project)
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  return dynamoDB.updateItem<Project>(PROJECTS_TABLE, id, updates)
}

export async function deleteProject(id: string): Promise<boolean> {
  return dynamoDB.deleteItem(PROJECTS_TABLE, id)
}

// Case study functions
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  return dynamoDB.getAllItems<CaseStudy>(CASE_STUDIES_TABLE)
}

export async function getCaseStudyById(id: string): Promise<CaseStudy | null> {
  return dynamoDB.getItem<CaseStudy>(CASE_STUDIES_TABLE, id)
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    const client = getDocClient()
    const command = new QueryCommand({
      TableName: CASE_STUDIES_TABLE,
      IndexName: "SlugIndex", // You'll need to create this GSI
      KeyConditionExpression: "slug = :slug",
      ExpressionAttributeValues: {
        ":slug": slug,
      },
      Limit: 1,
    })

    const response = await client.send(command)
    return (response.Items?.[0] as CaseStudy) || null
  } catch (error) {
    console.error(`Error getting case study with slug ${slug}:`, error)
    return null
  }
}

export async function createCaseStudy(
  caseStudy: Omit<CaseStudy, "id" | "created_at" | "updated_at">,
): Promise<CaseStudy | null> {
  return dynamoDB.createItem<Omit<CaseStudy, "id" | "created_at" | "updated_at">>(CASE_STUDIES_TABLE, caseStudy)
}

export async function updateCaseStudy(id: string, updates: Partial<CaseStudy>): Promise<CaseStudy | null> {
  return dynamoDB.updateItem<CaseStudy>(CASE_STUDIES_TABLE, id, updates)
}

export async function deleteCaseStudy(id: string): Promise<boolean> {
  return dynamoDB.deleteItem(CASE_STUDIES_TABLE, id)
}

// Logo story functions
export async function getAllLogoStories(): Promise<LogoStory[]> {
  return dynamoDB.getAllItems<LogoStory>(LOGO_STORIES_TABLE)
}

export async function getLogoStoryById(id: string): Promise<LogoStory | null> {
  return dynamoDB.getItem<LogoStory>(LOGO_STORIES_TABLE, id)
}

export async function createLogoStory(
  logoStory: Omit<LogoStory, "id" | "created_at" | "updated_at">,
): Promise<LogoStory | null> {
  return dynamoDB.createItem<Omit<LogoStory, "id" | "created_at" | "updated_at">>(LOGO_STORIES_TABLE, logoStory)
}

export async function updateLogoStory(id: string, updates: Partial<LogoStory>): Promise<LogoStory | null> {
  return dynamoDB.updateItem<LogoStory>(LOGO_STORIES_TABLE, id, updates)
}

export async function deleteLogoStory(id: string): Promise<boolean> {
  return dynamoDB.deleteItem(LOGO_STORIES_TABLE, id)
}

// Helper functions for specific use cases
export async function getResumeUrl(): Promise<string> {
  try {
    const client = getDocClient()
    const command = new QueryCommand({
      TableName: ASSETS_TABLE,
      IndexName: "NameIndex", // You'll need to create this GSI
      KeyConditionExpression: "name = :name",
      ExpressionAttributeValues: {
        ":name": "resume",
      },
      FilterExpression: "is_active = :active",
      ExpressionAttributeValues: {
        ":active": true,
      },
      ScanIndexForward: false, // Sort in descending order (newest first)
      Limit: 1,
    })

    const response = await client.send(command)
    const asset = response.Items?.[0] as Asset

    if (asset) {
      return asset.file_url
    }

    return "/resume.pdf" // Fallback to local file
  } catch (error) {
    console.error("Error getting resume URL:", error)
    return "/resume.pdf" // Fallback to local file
  }
}

export async function getPresentationUrl(): Promise<string> {
  try {
    const client = getDocClient()
    const command = new QueryCommand({
      TableName: ASSETS_TABLE,
      IndexName: "NameIndex", // You'll need to create this GSI
      KeyConditionExpression: "name = :name",
      ExpressionAttributeValues: {
        ":name": "presentation",
      },
      FilterExpression: "is_active = :active",
      ExpressionAttributeValues: {
        ":active": true,
      },
      ScanIndexForward: false, // Sort in descending order (newest first)
      Limit: 1,
    })

    const response = await client.send(command)
    const asset = response.Items?.[0] as Asset

    if (asset) {
      return asset.file_url
    }

    return "/portfolio.pptx" // Fallback to local file
  } catch (error) {
    console.error("Error getting presentation URL:", error)
    return "/portfolio.pptx" // Fallback to local file
  }
}

// Statistics functions
export async function getFormSubmissionStats() {
  try {
    const client = getDocClient()

    // Get total count
    const countCommand = new ScanCommand({
      TableName: SUBMISSIONS_TABLE,
      Select: "COUNT",
    })
    const countResponse = await client.send(countCommand)
    const totalCount = countResponse.Count || 0

    // Get count for last week
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    const lastWeekIso = lastWeek.toISOString()

    const lastWeekCommand = new ScanCommand({
      TableName: SUBMISSIONS_TABLE,
      FilterExpression: "created_at >= :lastWeek",
      ExpressionAttributeValues: {
        ":lastWeek": lastWeekIso,
      },
      Select: "COUNT",
    })
    const lastWeekResponse = await client.send(lastWeekCommand)
    const lastWeekCount = lastWeekResponse.Count || 0

    // Get referrers
    const referrersCommand = new ScanCommand({
      TableName: SUBMISSIONS_TABLE,
      ProjectionExpression: "referrer",
      FilterExpression: "attribute_exists(referrer)",
    })
    const referrersResponse = await client.send(referrersCommand)
    const referrers = referrersResponse.Items || []

    // Count occurrences of each referrer
    const referrerCounts: Record<string, number> = {}
    referrers.forEach((item: any) => {
      if (item.referrer) {
        try {
          const domain = new URL(item.referrer).hostname
          referrerCounts[domain] = (referrerCounts[domain] || 0) + 1
        } catch (e) {
          // Skip invalid URLs
        }
      }
    })

    // Convert to array and sort
    const topReferrers = Object.entries(referrerCounts)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalCount,
      lastWeekCount,
      topReferrers,
    }
  } catch (error) {
    console.error("Error getting form submission stats:", error)
    return { totalCount: 0, lastWeekCount: 0, topReferrers: [] }
  }
}

// Create DynamoDB tables
export async function createDynamoDBTables() {
  // This function would use the AWS SDK to create the necessary tables
  // However, it's generally better to use AWS CloudFormation or the AWS CLI for this
  console.log("This function would create DynamoDB tables. Use AWS CloudFormation or CLI instead.")
}
