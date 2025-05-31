import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = getSupabaseClient()

    console.log("Creating default content...")

    // Create default homepage sections
    const defaultSections = [
      {
        section_key: "hero",
        section_name: "Hero Section",
        content: {
          title: "Harshit Dabhi",
          subtitle: "Performance & Programmatic Manager",
          description: "Digital Marketing Professional & Strategist",
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
            { value: "50+", label: "Global Clients" },
            { value: "8+", label: "Years Experience" },
            { value: "200+", label: "Campaigns" },
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
            "I am a Performance & Programmatic Manager with over 8 years of experience in digital marketing and media buying.",
          cta_text: "View Resume",
          cta_link: "/resume",
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
              description: "Managing global campaigns across major DSPs like DV360, TTD, and Amazon.",
              color: "hover-glow",
            },
            {
              title: "Performance Marketing",
              description: "Data-driven strategies to maximize ROI and campaign performance.",
              color: "hover-glow-pink",
            },
            {
              title: "Media Planning & Buying",
              description: "Strategic media planning and buying across multiple channels and regions.",
              color: "hover-glow-yellow",
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
            "Looking for a digital marketing professional with expertise in programmatic advertising and media buying?",
          buttons: [
            { text: "Call Me", link: "tel:+971556453208", icon: "phone" },
            { text: "Schedule a Meeting", link: "https://calendly.com/harshitdabhi/30min", icon: "calendar" },
            { text: "Send Email", link: "mailto:dabhiharshit11@gmail.com", icon: "mail" },
          ],
        },
        page: "homepage",
        section_order: 5,
        is_active: true,
      },
    ]

    // Insert sections
    for (const section of defaultSections) {
      console.log("Inserting section:", section.section_key)

      const { error } = await supabase.from("content_sections").upsert(section, { onConflict: "section_key" })

      if (error) {
        console.error(`Error creating section ${section.section_key}:`, error)
        return NextResponse.json(
          { error: `Failed to create ${section.section_name}: ${error.message}` },
          { status: 500 },
        )
      }
    }

    console.log("Default content created successfully")
    return NextResponse.json({ success: true, message: "Default content created successfully" })
  } catch (error) {
    console.error("Error creating default content:", error)
    return NextResponse.json(
      { error: `Failed to create default content: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
