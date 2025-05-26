import { getSupabaseClient } from "./supabase"

export interface ContentSection {
  id: string
  section_key: string
  section_name: string
  content: any
  page: string
  section_order: number
  is_active: boolean
}

export interface NavigationMenu {
  id: string
  menu_key: string
  menu_name: string
  items: any[]
  is_active: boolean
}

export interface PageContent {
  id: string
  page_slug: string
  page_title: string
  content: any
  meta_title?: string
  meta_description?: string
  is_published: boolean
}

// Content Sections
export async function getContentSections(page = "homepage"): Promise<ContentSection[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("content_sections")
    .select("*")
    .eq("page", page)
    .eq("is_active", true)
    .order("section_order")

  if (error) {
    console.error("Error fetching content sections:", error)
    return []
  }

  return data || []
}

export async function getContentSection(sectionKey: string): Promise<ContentSection | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("content_sections")
    .select("*")
    .eq("section_key", sectionKey)
    .eq("is_active", true)
    .single()

  if (error) {
    console.error(`Error fetching content section ${sectionKey}:`, error)
    return null
  }

  return data
}

// Navigation Menus
export async function getNavigationMenu(menuKey: string): Promise<NavigationMenu | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("navigation_menus")
    .select("*")
    .eq("menu_key", menuKey)
    .eq("is_active", true)
    .single()

  if (error) {
    console.error(`Error fetching navigation menu ${menuKey}:`, error)
    return null
  }

  return data
}

export async function getAllNavigationMenus(): Promise<NavigationMenu[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("navigation_menus").select("*").eq("is_active", true)

  if (error) {
    console.error("Error fetching navigation menus:", error)
    return []
  }

  return data || []
}

// Page Content
export async function getPageContent(pageSlug: string): Promise<PageContent | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("page_content")
    .select("*")
    .eq("page_slug", pageSlug)
    .eq("is_published", true)
    .single()

  if (error) {
    console.error(`Error fetching page content ${pageSlug}:`, error)
    return null
  }

  return data
}

export async function getAllPageContent(): Promise<PageContent[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("page_content").select("*").eq("is_published", true)

  if (error) {
    console.error("Error fetching page content:", error)
    return []
  }

  return data || []
}

// Helper functions for specific content types
export async function getHeroContent() {
  return await getContentSection("hero")
}

export async function getStatsContent() {
  return await getContentSection("stats")
}

export async function getAboutContent() {
  return await getContentSection("about")
}

export async function getExpertiseContent() {
  return await getContentSection("expertise")
}

export async function getContactCTAContent() {
  return await getContentSection("contact_cta")
}

export async function getMainNavigation() {
  return await getNavigationMenu("main_nav")
}

export async function getFooterNavigation() {
  return await getNavigationMenu("footer_nav")
}
