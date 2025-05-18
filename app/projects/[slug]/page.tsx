import { notFound } from "next/navigation"
import Image from "next/image"
import { BackToHomeAlt } from "@/components/back-to-home-alt"

// Static projects data
const projects = [
  {
    slug: "3k-learning-academy",
    title: "3K Learning Academy Website Development",
    description: "E-learning platform with interactive courses and student management system",
    date: "2022-06-15",
    category: "Web Development",
    image: "/placeholder.svg",
    tags: ["Web Development", "UI/UX", "E-Learning"],
    body: {
      html: `
        <h2>Challenge</h2>
        <p>An established e-learning platform needed a complete website redesign to improve user experience and incorporate interactive course features.</p>
        
        <h2>Strategy</h2>
        <p>I developed a comprehensive website strategy that included:</p>
        <ul>
          <li>Complete website redesign with improved UX/UI and mobile optimization</li>
          <li>Interactive course platform with progress tracking</li>
          <li>Student management system with user profiles</li>
        </ul>
        
        <h2>Results</h2>
        <p>The website redesign delivered exceptional results:</p>
        <ul>
          <li>200% increase in course enrollments</li>
          <li>156% increase in website traffic</li>
          <li>45% improvement in user engagement</li>
        </ul>
      `,
    },
  },
  {
    slug: "digitalwit-media",
    title: "The DigitalWit Media Marketing Campaign",
    description: "Digital marketing campaigns increasing engagement by 45%",
    date: "2023-03-10",
    category: "Digital Marketing",
    image: "/placeholder.svg",
    tags: ["Digital Marketing", "Social Media", "Analytics"],
    body: {
      html: `
        <h2>Challenge</h2>
        <p>A media company wanted to increase their digital presence and reach a younger audience.</p>
        
        <h2>Strategy</h2>
        <p>I created a multi-platform digital marketing strategy focused on authentic storytelling and user engagement.</p>
        
        <h2>Results</h2>
        <p>The campaign exceeded all expectations:</p>
        <ul>
          <li>Reached over 2 million users organically across platforms</li>
          <li>Generated 15,000+ user-generated content pieces</li>
          <li>Increased follower count by 78% within 3 months</li>
        </ul>
      `,
    },
  },
  {
    slug: "chandrika-kumar-tarot",
    title: "Chandrika Kumar - Tarot",
    description: "Professional website with online booking and payment integration",
    date: "2023-08-22",
    category: "Website",
    image: "/placeholder.svg",
    tags: ["Website", "Payment Integration", "Booking System"],
    body: {
      html: `
        <h2>Challenge</h2>
        <p>A professional tarot card reader needed a website that would showcase her services and allow clients to book sessions online.</p>
        
        <h2>Strategy</h2>
        <p>I developed a comprehensive website strategy with online booking and payment processing.</p>
        
        <h2>Results</h2>
        <p>The website launch delivered impressive results:</p>
        <ul>
          <li>150% increase in monthly bookings</li>
          <li>80% of bookings now made online (previously phone-only)</li>
          <li>35% increase in average session value</li>
        </ul>
      `,
    },
  },
]

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((project) => project.slug === params.slug)

  if (!project) {
    notFound()
  }

  return (
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

        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: project.body.html }} />
      </div>
    </div>
  )
}
