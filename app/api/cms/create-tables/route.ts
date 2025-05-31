import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = getSupabaseClient()

    console.log("Creating CMS tables...")

    // Create content_sections table
    const createContentSections = `
      CREATE TABLE IF NOT EXISTS content_sections (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          section_key VARCHAR(100) UNIQUE NOT NULL,
          section_name VARCHAR(200) NOT NULL,
          content JSONB NOT NULL DEFAULT '{}',
          page VARCHAR(100) NOT NULL DEFAULT 'homepage',
          section_order INTEGER NOT NULL DEFAULT 0,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Create navigation_menus table
    const createNavigationMenus = `
      CREATE TABLE IF NOT EXISTS navigation_menus (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          menu_key VARCHAR(100) UNIQUE NOT NULL,
          menu_name VARCHAR(200) NOT NULL,
          items JSONB NOT NULL DEFAULT '[]',
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Create page_content table
    const createPageContent = `
      CREATE TABLE IF NOT EXISTS page_content (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          page_slug VARCHAR(200) UNIQUE NOT NULL,
          page_title VARCHAR(300) NOT NULL,
          content JSONB NOT NULL DEFAULT '{}',
          meta_title VARCHAR(300),
          meta_description TEXT,
          is_published BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Execute table creation queries
    const { error: error1 } = await supabase.rpc("exec_sql", { sql: createContentSections })
    if (error1) console.error("Error creating content_sections:", error1)

    const { error: error2 } = await supabase.rpc("exec_sql", { sql: createNavigationMenus })
    if (error2) console.error("Error creating navigation_menus:", error2)

    const { error: error3 } = await supabase.rpc("exec_sql", { sql: createPageContent })
    if (error3) console.error("Error creating page_content:", error3)

    // Insert default data
    await insertDefaultData(supabase)

    return NextResponse.json({ success: true, message: "CMS tables created successfully" })
  } catch (error) {
    console.error("Error creating CMS tables:", error)
    return NextResponse.json({ error: "Failed to create CMS tables" }, { status: 500 })
  }
}

async function insertDefaultData(supabase: any) {
  // Insert default content sections
  const defaultSections = [
    {
      section_key: "hero",
      section_name: "Hero Section",
      content: {
        title: "Digital Marketing Strategist",
        subtitle: "Data-Driven Growth Expert",
        description:
          "Transforming businesses through strategic digital marketing, programmatic advertising, and data analytics.",
        cta_text: "View My Work",
        cta_link: "/work",
      },
      page: "homepage",
      section_order: 1,
      is_active: true,
    },
    {
      section_key: "stats",
      section_name: "Statistics Section",
      content: {
        stats: [
          { value: "600%", label: "Average ROI" },
          { value: "50M+", label: "Ad Impressions" },
          { value: "200+", label: "Campaigns" },
          { value: "15+", label: "Industries" },
        ],
      },
      page: "homepage",
      section_order: 2,
      is_active: true,
    },
    {
      section_key: "about",
      section_name: "About Section",
      content: {
        title: "About Me",
        content:
          "I am a results-driven digital marketing professional with expertise in programmatic advertising, data analytics, and strategic campaign management. My passion lies in leveraging data to drive meaningful business growth.",
        cta_text: "Learn More",
        cta_link: "/about",
      },
      page: "homepage",
      section_order: 3,
      is_active: true,
    },
    {
      section_key: "expertise",
      section_name: "Expertise Section",
      content: {
        title: "My Expertise",
        items: [
          {
            title: "Programmatic Advertising",
            description: "Advanced programmatic strategies across DSPs, RTB optimization, and audience targeting.",
          },
          {
            title: "Data Analytics",
            description: "Deep-dive analytics, attribution modeling, and performance optimization.",
          },
          {
            title: "Strategic Planning",
            description: "Comprehensive digital marketing strategies and campaign architecture.",
          },
        ],
      },
      page: "homepage",
      section_order: 4,
      is_active: true,
    },
    {
      section_key: "contact_cta",
      section_name: "Contact CTA Section",
      content: {
        title: "Let's Work Together",
        description:
          "Ready to take your digital marketing to the next level? Let's discuss how we can achieve your goals.",
        buttons: [
          {
            text: "Get In Touch",
            link: "/contact",
            icon: "mail",
          },
          {
            text: "View Resume",
            link: "/resume",
            icon: "download",
          },
        ],
      },
      page: "homepage",
      section_order: 5,
      is_active: true,
    },
  ]

  // Insert sections
  for (const section of defaultSections) {
    const { error } = await supabase.from("content_sections").upsert(section, { onConflict: "section_key" })

    if (error) {
      console.error("Error inserting section:", section.section_key, error)
    }
  }

  // Insert default navigation menus
  const defaultMenus = [
    {
      menu_key: "main_nav",
      menu_name: "Main Navigation",
      items: [
        { label: "Home", href: "/", order: 1 },
        { label: "About", href: "/about", order: 2 },
        { label: "Work", href: "/work", order: 3 },
        { label: "Blog", href: "/blog", order: 4 },
        { label: "Contact", href: "/contact", order: 5 },
      ],
      is_active: true,
    },
    {
      menu_key: "footer_nav",
      menu_name: "Footer Navigation",
      items: [
        { label: "Privacy Policy", href: "/privacy", order: 1 },
        { label: "Terms of Service", href: "/terms", order: 2 },
        { label: "Sitemap", href: "/sitemap.xml", order: 3 },
      ],
      is_active: true,
    },
  ]

  // Insert menus
  for (const menu of defaultMenus) {
    const { error } = await supabase.from("navigation_menus").upsert(menu, { onConflict: "menu_key" })

    if (error) {
      console.error("Error inserting menu:", menu.menu_key, error)
    }
  }

  // Insert default page content
  const defaultPages = [
    {
      page_slug: "home",
      page_title: "Home - Digital Marketing Strategist",
      content: {},
      meta_title: "Harshit Dabhi - Digital Marketing Strategist",
      meta_description:
        "Expert digital marketing strategist specializing in programmatic advertising, data analytics, and growth strategies.",
      is_published: true,
    },
    {
      page_slug: "about",
      page_title: "About - Harshit Dabhi",
      content: {},
      meta_title: "About Harshit Dabhi - Digital Marketing Expert",
      meta_description:
        "Learn about Harshit Dabhi's experience in digital marketing, programmatic advertising, and data-driven strategies.",
      is_published: true,
    },
    {
      page_slug: "contact",
      page_title: "Contact - Get In Touch",
      content: {},
      meta_title: "Contact Harshit Dabhi - Digital Marketing Consultant",
      meta_description:
        "Get in touch with Harshit Dabhi for digital marketing consulting, programmatic advertising, and growth strategies.",
      is_published: true,
    },
  ]

  // Insert pages
  for (const page of defaultPages) {
    const { error } = await supabase.from("page_content").upsert(page, { onConflict: "page_slug" })

    if (error) {
      console.error("Error inserting page:", page.page_slug, error)
    }
  }
}
