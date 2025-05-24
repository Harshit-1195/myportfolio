import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { ProjectCard } from "@/components/project-card"
import PageParticles from "@/components/page-particles"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"

export const revalidate = 3600 // Revalidate every hour

async function getProjects() {
  const supabase = createServerComponentClient({ cookies })

  const { data, error } = await supabase.from("projects").select("*").order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }

  return data || []
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  // Separate featured projects from regular projects
  const featuredProjects = projects.filter((project) => project.is_featured)
  const regularProjects = projects.filter((project) => !project.is_featured)

  return (
    <>
      <PageParticles />
      <div className="container mx-auto py-28 px-4 max-w-6xl">
        <ScrollRevealWrapper>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">Projects</h1>
          <p className="text-xl text-white/70 mb-12 text-center max-w-3xl mx-auto">
            A showcase of my work and expertise in design, development, and digital strategy.
          </p>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-white mb-2">No projects yet</h3>
              <p className="text-white/70">Check back soon for new content!</p>
            </div>
          ) : (
            <>
              {featuredProjects.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-white mb-6">Featured Projects</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredProjects.map((project) => (
                      <ScrollRevealWrapper key={project.id} delay={0.1}>
                        <ProjectCard project={project} featured={true} />
                      </ScrollRevealWrapper>
                    ))}
                  </div>
                </div>
              )}

              {regularProjects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">All Projects</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularProjects.map((project) => (
                      <ScrollRevealWrapper key={project.id} delay={0.1}>
                        <ProjectCard project={project} />
                      </ScrollRevealWrapper>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </ScrollRevealWrapper>
      </div>
    </>
  )
}
