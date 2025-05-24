import { getSupabaseClient, getSupabaseAdmin } from "./supabase"

// Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: string
  author: string
  is_published: boolean
  published_at?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  canonical_url?: string
  og_image?: string
  views: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description?: string
  content: string
  featured_image?: string
  gallery?: string[]
  technologies?: string[]
  project_url?: string
  github_url?: string
  order_index: number
  published: boolean
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  canonical_url?: string
  og_image?: string
  created_at: string
  updated_at: string
}

export interface Media {
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

// Blog post functions
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }

  return data || []
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching published blog posts:", error)
    return []
  }

  return data || []
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error)
    return null
  }

  return data
}

export async function incrementBlogPostViews(slug: string): Promise<void> {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.rpc("increment_blog_post_views", { post_slug: slug })

  if (error) {
    console.error(`Error incrementing views for blog post with slug ${slug}:`, error)
  }
}

export async function createBlogPost(
  post: Omit<BlogPost, "id" | "created_at" | "updated_at" | "views">,
): Promise<BlogPost | null> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from("blog_posts")
    .insert([{ ...post, views: 0 }])
    .select()
    .single()

  if (error) {
    console.error("Error creating blog post:", error)
    return null
  }

  return data
}

export async function updateBlogPost(slug: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from("blog_posts").update(updates).eq("slug", slug).select().single()

  if (error) {
    console.error(`Error updating blog post with slug ${slug}:`, error)
    return null
  }

  return data
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("blog_posts").delete().eq("slug", slug)

  if (error) {
    console.error(`Error deleting blog post with slug ${slug}:`, error)
    return false
  }

  return true
}

// Project functions
export async function getAllProjects(): Promise<Project[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("projects").select("*").order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }

  return data || []
}

export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching published projects:", error)
    return []
  }

  return data || []
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching project with slug ${slug}:`, error)
    return null
  }

  return data
}

export async function createProject(
  project: Omit<Project, "id" | "created_at" | "updated_at">,
): Promise<Project | null> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from("projects").insert([project]).select().single()

  if (error) {
    console.error("Error creating project:", error)
    return null
  }

  return data
}

export async function updateProject(slug: string, updates: Partial<Project>): Promise<Project | null> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from("projects").update(updates).eq("slug", slug).select().single()

  if (error) {
    console.error(`Error updating project with slug ${slug}:`, error)
    return null
  }

  return data
}

export async function deleteProject(slug: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("projects").delete().eq("slug", slug)

  if (error) {
    console.error(`Error deleting project with slug ${slug}:`, error)
    return false
  }

  return true
}

// Media functions
export async function getAllMedia(): Promise<Media[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching media:", error)
    return []
  }

  return data || []
}

export async function getMediaById(id: string): Promise<Media | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("media").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching media with id ${id}:`, error)
    return null
  }

  return data
}

export async function createMedia(media: Omit<Media, "id" | "created_at" | "updated_at">): Promise<Media | null> {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from("media").insert([media]).select().single()

  if (error) {
    console.error("Error creating media:", error)
    return null
  }

  return data
}

export async function deleteMedia(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("media").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting media with id ${id}:`, error)
    return false
  }

  return true
}

// Storage functions
export async function uploadFile(file: File, path: string): Promise<string | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("Error uploading file:", error)
    return null
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(data.path)

  return publicUrl
}

export async function deleteFile(path: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.storage.from("media").remove([path])

  if (error) {
    console.error(`Error deleting file at path ${path}:`, error)
    return false
  }

  return true
}
