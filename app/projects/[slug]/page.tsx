import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Image from "next/image"
import { BackToHomeAlt } from "@/components/back-to-home-alt"
import { ProjectJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"

async function getProject(slug: string) {
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase.from("projects").select("*").eq("slug", slug).single()

  if (!data) {
    notFound()
  }

  return data
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)

  // Use SEO fields if available, otherwise fall back to regular content
  const seoTitle = project.seo_title || project.title
  const seoDescription = project.seo_description || project.description
  const canonicalUrl = project.canonical_url || `${process.env.NEXT_PUBLIC_BASE_URL}/projects/${project.slug}`
  const ogImage = project.og_image || project.image

  // Format date for structured data
  const projectDate = project.date ? new Date(project.date).toISOString() : new Date().toISOString()

  return (
    <>
      <ProjectJsonLd
        name={seoTitle}
        description={seoDescription}
        images={project.image ? [project.image] : []}
        url={canonicalUrl}
        dateCreated={projectDate}
        creator={project.client || "Your Name"}
        keywords={project.tags || []}
      />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${process.env.NEXT_PUBLIC_BASE_URL}/` },
          { name: "Projects", item: `${process.env.NEXT_PUBLIC_BASE_URL}/projects` },
          { name: project.title, item: canonicalUrl },
        ]}
      />

      <div className="container mx-auto py-28 px-4">
        <BackToHomeAlt />

        <div className="glass-panel p-8 rounded-lg mb-10">
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{project.title}</h1>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="text-sm text-white/70">
              <span className="font-medium text-white">Category:</span> {project.category}
            </div>
            <div className="text-sm text-white/70">
              <span className="font-medium text-white">Date:</span> {new Date(project.date).toLocaleDateString()}
            </div>
          </div>

          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: project.content }} />
        </div>
      </div>
    </>
  )
}
