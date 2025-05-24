import Link from "next/link"
import Image from "next/image"
import { Github, Globe, ArrowRight } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    slug: string
    description: string | null
    featured_image: string | null
    technologies: string[] | null
    url: string | null
    github_url: string | null
    is_featured: boolean
  }
  featured?: boolean
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <div
      className={`glass-panel rounded-lg overflow-hidden hover-glow transition-all duration-300 h-full flex flex-col ${
        featured ? "col-span-2 row-span-2" : ""
      }`}
    >
      <div className={`relative ${featured ? "h-64" : "h-48"} w-full`}>
        <Image
          src={project.featured_image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover"
          sizes={featured ? "100vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        {project.is_featured && !featured && (
          <div className="absolute top-2 right-2 bg-white/10 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className={`${featured ? "text-2xl" : "text-xl"} font-bold text-white mb-2`}>{project.title}</h3>

        {project.description && <p className="text-white/70 mb-4 flex-1">{project.description}</p>}

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, index) => (
              <span key={index} className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/80">
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
          <div className="flex gap-2">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                title="View Live"
              >
                <Globe className="h-4 w-4 text-white/70" />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                title="View on GitHub"
              >
                <Github className="h-4 w-4 text-white/70" />
              </a>
            )}
          </div>

          <Link href={`/projects/${project.slug}`} className="text-white hover:text-white/80 flex items-center gap-1">
            View Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
