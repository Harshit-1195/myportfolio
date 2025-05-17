"use server"

import { getSupabaseServerClient } from "@/lib/supabase"

// Helper function to handle Supabase errors
const handleSupabaseError = (error: any, message: string) => {
  console.error(message, error)
  return null // Return null instead of throwing an error
}

// Blog Posts
export async function getAllBlogPosts() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if the table exists first
    const { error: tableCheckError } = await supabase.from("blog_posts").select("count").limit(1).single()

    // If the table doesn't exist, return an empty array
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.warn("The blog_posts table does not exist yet. Please run the database setup.")
      return []
    }

    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching blog posts:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching blog posts:", error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

    if (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Unexpected error fetching blog post with slug ${slug}:`, error)
    return null
  }
}

export async function createBlogPost(post: any) {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase.from("blog_posts").insert([post]).select().single()

    if (error) {
      handleSupabaseError(error, "Error creating blog post")
      return null
    }

    return data || null
  } catch (error: any) {
    console.error("Error creating blog post:", error)
    return null
  }
}

export async function updateBlogPost(id: string, updates: any) {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase.from("blog_posts").update(updates).eq("id", id).select().single()

    if (error) {
      handleSupabaseError(error, `Error updating blog post with id ${id}`)
      return null
    }

    return data || null
  } catch (error: any) {
    console.error(`Error updating blog post with id ${id}:`, error)
    return null
  }
}

export async function deleteBlogPost(id: string) {
  const supabase = getSupabaseServerClient()

  try {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id)

    if (error) {
      handleSupabaseError(error, `Error deleting blog post with id ${id}`)
      return false
    }

    return !error
  } catch (error: any) {
    console.error(`Error deleting blog post with id ${id}:`, error)
    return false
  }
}

// Projects
export async function getAllProjects() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if the table exists first
    const { error: tableCheckError } = await supabase.from("projects").select("count").limit(1).single()

    // If the table doesn't exist, return an empty array
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.warn("The projects table does not exist yet. Please run the database setup.")
      return []
    }

    const { data, error } = await supabase.from("projects").select("*").order("order_index", { ascending: true })

    if (error) {
      console.error("Error fetching projects:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching projects:", error)
    return []
  }
}

export async function getProjectBySlug(slug: string) {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).single()

    if (error) {
      handleSupabaseError(error, `Error fetching project with slug ${slug}`)
      return null
    }

    return data || null
  } catch (error: any) {
    console.error(`Error fetching project with slug ${slug}:`, error)
    return null
  }
}

export async function createProject(project: any) {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase.from("projects").insert([project]).select().single()

    if (error) {
      handleSupabaseError(error, "Error creating project")
      return null
    }

    return data || null
  } catch (error: any) {
    console.error("Error creating project:", error)
    return null
  }
}

export async function updateProject(id: string, updates: any) {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select().single()

    if (error) {
      handleSupabaseError(error, `Error updating project with id ${id}`)
      return null
    }

    return data || null
  } catch (error: any) {
    console.error(`Error updating project with id ${id}:`, error)
    return null
  }
}

export async function deleteProject(id: string) {
  const supabase = getSupabaseServerClient()

  try {
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      handleSupabaseError(error, `Error deleting project with id ${id}`)
      return false
    }

    return !error
  } catch (error: any) {
    console.error(`Error deleting project with id ${id}:`, error)
    return false
  }
}

// Case Studies
export async function getAllCaseStudies() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if the table exists first
    const { error: tableCheckError } = await supabase.from("case_studies").select("count").limit(1).single()

    // If the table doesn't exist, return an empty array
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.warn("The case_studies table does not exist yet. Please run the database setup.")
      return []
    }

    const { data, error } = await supabase.from("case_studies").select("*").order("order_index", { ascending: true })

    if (error) {
      console.error("Error fetching case studies:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching case studies:", error)
    return []
  }
}

export async function getCaseStudyBySlug(slug: string) {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase.from("case_studies").select("*").eq("slug", slug).single()

    if (error) {
      handleSupabaseError(error, `Error fetching case study with slug ${slug}`)
      return null
    }

    return data || null
  } catch (error: any) {
    console.error(`Error fetching case study with slug ${slug}:`, error)
    return null
  }
}

export async function createCaseStudy(caseStudy: any) {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase.from("case_studies").insert([caseStudy]).select().single()

    if (error) {
      handleSupabaseError(error, "Error creating case study")
      return null
    }

    return data || null
  } catch (error: any) {
    console.error("Error creating case study:", error)
    return null
  }
}

export async function updateCaseStudy(id: string, updates: any) {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase.from("case_studies").update(updates).eq("id", id).select().single()

    if (error) {
      handleSupabaseError(error, `Error updating case study with id ${id}`)
      return null
    }

    return data || null
  } catch (error: any) {
    console.error(`Error updating case study with id ${id}:`, error)
    return null
  }
}

export async function deleteCaseStudy(id: string) {
  const supabase = getSupabaseServerClient()

  try {
    const { error } = await supabase.from("case_studies").delete().eq("id", id)

    if (error) {
      handleSupabaseError(error, `Error deleting case study with id ${id}`)
      return false
    }

    return !error
  } catch (error: any) {
    console.error(`Error deleting case study with id ${id}:`, error)
    return false
  }
}

// Logo Stories
export async function getAllLogoStories() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if the table exists first
    const { error: tableCheckError } = await supabase.from("logo_stories").select("count").limit(1).single()

    // If the table doesn't exist, return an empty array
    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      console.warn("The logo_stories table does not exist yet. Please run the database setup.")
      return []
    }

    const { data, error } = await supabase.from("logo_stories").select("*").order("order_index", { ascending: true })

    if (error) {
      console.error("Error fetching logo stories:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error fetching logo stories:", error)
    return []
  }
}

export async function getLogoStoryById(id: string) {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase.from("logo_stories").select("*").eq("id", id).single()

    if (error) {
      handleSupabaseError(error, `Error fetching logo story with id ${id}`)
      return null
    }

    return data || null
  } catch (error: any) {
    console.error(`Error fetching logo story with id ${id}:`, error)
    return null
  }
}

export async function createLogoStory(logoStory: any) {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase.from("logo_stories").insert([logoStory]).select().single()

    if (error) {
      handleSupabaseError(error, "Error creating logo story")
      return null
    }

    return data || null
  } catch (error: any) {
    console.error("Error creating logo story:", error)
    return null
  }
}

export async function updateLogoStory(id: string, updates: any) {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase.from("logo_stories").update(updates).eq("id", id).select().single()

    if (error) {
      handleSupabaseError(error, `Error updating logo story with id ${id}`)
      return null
    }

    return data || null
  } catch (error: any) {
    console.error(`Error updating logo story with id ${id}:`, error)
    return null
  }
}

export async function deleteLogoStory(id: string) {
  const supabase = getSupabaseServerClient()

  try {
    const { error } = await supabase.from("logo_stories").delete().eq("id", id)

    if (error) {
      handleSupabaseError(error, `Error deleting logo story with id ${id}`)
      return false
    }

    return !error
  } catch (error: any) {
    console.error(`Error deleting logo story with id ${id}:`, error)
    return false
  }
}

export async function createSampleData() {
  try {
    const supabase = getSupabaseServerClient()

    // Sample blog posts
    const blogPosts = [
      {
        title: "The Future of Programmatic Advertising in 2024",
        slug: "future-programmatic-advertising-2024",
        excerpt: "Explore the latest trends and technologies shaping programmatic advertising in 2024.",
        content: "# The Future of Programmatic Advertising in 2024",
        featured_image: "/digital-advertising-technology.png",
        author: "Harshit Dabhi",
        category: "Programmatic",
        tags: ["Programmatic", "Advertising", "AI", "Technology", "Digital Marketing"],
        published_at: new Date().toISOString(),
        is_published: true,
        views: 245,
      },
      {
        title: "Maximizing ROI with Omnichannel Media Buying",
        slug: "maximizing-roi-omnichannel-media-buying",
        excerpt: "Learn how to create cohesive campaigns across multiple channels to maximize your marketing ROI.",
        content: "# Maximizing ROI with Omnichannel Media Buying",
        featured_image: "/omnichannel-marketing.png",
        author: "Harshit Dabhi",
        category: "Media Buying",
        tags: ["Media Buying", "Omnichannel", "ROI", "Strategy", "Digital Marketing"],
        published_at: new Date().toISOString(),
        is_published: true,
        views: 189,
      },
      {
        title: "Data-Driven Decision Making in Digital Marketing",
        slug: "data-driven-decision-making-digital-marketing",
        excerpt: "Discover how to leverage analytics tools to make informed marketing decisions that drive results.",
        content: "# Data-Driven Decision Making in Digital Marketing",
        featured_image: "/data-analytics-dashboard.png",
        author: "Harshit Dabhi",
        category: "Analytics",
        tags: ["Analytics", "Data", "Decision Making", "Digital Marketing", "Strategy"],
        published_at: new Date().toISOString(),
        is_published: true,
        views: 210,
      },
    ]

    // Insert blog posts
    const { error: blogError } = await supabase.from("blog_posts").insert(blogPosts)
    if (blogError) {
      console.error("Error creating blog posts:", blogError)
      return { success: false, error: blogError.message }
    }

    return {
      success: true,
      message: "Sample data created successfully",
      counts: {
        blogPosts: blogPosts.length,
      },
    }
  } catch (error: any) {
    console.error("Error creating sample data:", error)
    return { success: false, error: error.message }
  }
}
