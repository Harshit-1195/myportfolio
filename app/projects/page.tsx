import Image from "next/image"
import Link from "next/link"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"

// Static projects data to replace contentlayer
const projects = [
  {
    slug: "3k-learning-academy",
    title: "3K Learning Academy Website Development",
    description: "E-learning platform with interactive courses and student management system",
    date: "2022-06-15",
    category: "Web Development",
    image: "/placeholder.svg",
    tags: ["Web Development", "UI/UX", "E-Learning"],
  },
  {
    slug: "digitalwit-media",
    title: "The DigitalWit Media Marketing Campaign",
    description: "Digital marketing campaigns increasing engagement by 45%",
    date: "2023-03-10",
    category: "Digital Marketing",
    image: "/placeholder.svg",
    tags: ["Digital Marketing", "Social Media", "Analytics"],
  },
  {
    slug: "chandrika-kumar-tarot",
    title: "Chandrika Kumar - Tarot",
    description: "Professional website with online booking and payment integration",
    date: "2023-08-22",
    category: "Website",
    image: "/placeholder.svg",
    tags: ["Website", "Payment Integration", "Booking System"],
  },
]

export default function ProjectsPage() {
  // Sort projects by date
  const allProjects = projects.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <div className="container mx-auto py-28 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">My Projects</h1>
      <p className="text-white/70 mb-10 max-w-2xl">
        A showcase of my digital marketing projects and campaigns. Each project represents strategic thinking, creative
        execution, and measurable results.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allProjects.map((project, index) => (
          <ScrollRevealWrapper key={project.slug} className={`animate-delay-${index * 100}`}>
            <Link href={`/projects/${project.slug}`}>
              <div className="group glass-panel rounded-lg overflow-hidden hover-lift hover-glow">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="text-white border-white hover:bg-white hover:text-black px-4 py-2 rounded border">
                      View Details
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm font-medium text-white/60 mb-2">{project.category}</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{project.title}</h3>
                  <p className="text-white/70 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full glass-panel text-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </ScrollRevealWrapper>
        ))}
      </div>
    </div>
  )
}
