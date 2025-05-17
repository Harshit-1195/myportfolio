import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"

interface ProjectPageProps {
  params: {
    slug: string
  }
}

// Static project data
const projects = [
  {
    id: 1,
    title: "3K Learning Academy Website Development",
    description: "E-learning platform with interactive courses and student management system",
    content: `
      <h2>Challenge</h2>
      <p>An established e-learning platform needed a complete website redesign to improve user experience and incorporate interactive course features. They wanted a system that would allow easy management of students, courses, and learning materials.</p>
      
      <h2>Strategy</h2>
      <p>I developed a comprehensive website strategy that included:</p>
      <ul>
        <li>Complete website redesign with improved UX/UI and mobile optimization</li>
        <li>Interactive course platform with progress tracking</li>
        <li>Student management system with user profiles</li>
        <li>Content management system for easy updates</li>
        <li>Payment integration for course purchases</li>
      </ul>
      
      <h2>Implementation</h2>
      <p>The implementation was phased over 3 months:</p>
      <ol>
        <li>Phase 1: Research, strategy development, and website design</li>
        <li>Phase 2: Development of core website and CMS</li>
        <li>Phase 3: Implementation of course platform and student management system</li>
      </ol>
      
      <h2>Results</h2>
      <p>The website redesign delivered exceptional results:</p>
      <ul>
        <li>200% increase in course enrollments</li>
        <li>156% increase in website traffic</li>
        <li>45% improvement in user engagement</li>
        <li>320% growth in mobile users</li>
        <li>28% reduction in course abandonment rate</li>
      </ul>
    `,
    image: "/placeholder.svg?height=400&width=600",
    category: "Web Development",
    slug: "3k-learning-academy",
    date: "2022-06-15",
    tags: ["Web Development", "UI/UX", "E-Learning"],
  },
  {
    id: 2,
    title: "The DigitalWit Media Marketing Campaign",
    description: "Digital marketing campaigns increasing engagement by 45%",
    content: `
      <h2>Challenge</h2>
      <p>A media company wanted to increase their digital presence and reach a younger audience. They had limited engagement on their existing platforms and needed a fresh approach to stand out in a crowded market.</p>
      
      <h2>Strategy</h2>
      <p>I created a multi-platform digital marketing strategy focused on authentic storytelling and user engagement:</p>
      <ul>
        <li>Developed a consistent brand voice and visual identity across platforms</li>
        <li>Created a hashtag challenge campaign that encouraged user participation</li>
        <li>Partnered with micro-influencers who aligned with the brand values</li>
        <li>Implemented a content calendar with platform-specific content formats</li>
        <li>Set up social listening tools to monitor brand mentions and sentiment</li>
      </ul>
      
      <h2>Results</h2>
      <p>The campaign exceeded all expectations:</p>
      <ul>
        <li>Reached over 2 million users organically across platforms</li>
        <li>Generated 15,000+ user-generated content pieces using the campaign hashtag</li>
        <li>Increased follower count by 78% within 3 months</li>
        <li>Improved engagement rate from 1.2% to 4.8%</li>
        <li>Drove a 45% increase in website traffic from social channels</li>
      </ul>
    `,
    image: "/placeholder.svg?height=400&width=600",
    category: "Digital Marketing",
    slug: "digitalwit-media",
    date: "2023-03-10",
    tags: ["Digital Marketing", "Social Media", "Analytics"],
  },
  {
    id: 3,
    title: "Chandrika Kumar - Tarot",
    description: "Professional website with online booking and payment integration",
    content: `
      <h2>Challenge</h2>
      <p>A professional tarot card reader needed a website that would showcase her services, allow clients to book sessions online, and process payments securely. She wanted a mystical yet professional design that would appeal to her target audience.</p>
      
      <h2>Strategy</h2>
      <p>I developed a comprehensive website strategy that included:</p>
      <ul>
        <li>Custom website design with mystical elements and professional layout</li>
        <li>Online booking system with calendar integration</li>
        <li>Secure payment processing for session bookings</li>
        <li>Testimonials and service descriptions</li>
        <li>Mobile-responsive design for on-the-go bookings</li>
      </ul>
      
      <h2>Implementation</h2>
      <p>The website was developed in phases:</p>
      <ol>
        <li>Phase 1: Design and development of core website</li>
        <li>Phase 2: Integration of booking system and calendar</li>
        <li>Phase 3: Implementation of payment processing and testing</li>
      </ol>
      
      <h2>Results</h2>
      <p>The website launch delivered impressive results:</p>
      <ul>
        <li>150% increase in monthly bookings</li>
        <li>80% of bookings now made online (previously phone-only)</li>
        <li>35% increase in average session value</li>
        <li>Expanded client base to new geographic areas</li>
        <li>Reduced administrative work by 10 hours per week</li>
      </ul>
    `,
    image: "/placeholder.svg?height=400&width=600",
    category: "Website",
    slug: "chandrika-kumar-tarot",
    date: "2023-08-22",
    tags: ["Website", "Payment Integration", "Booking System"],
  },
  {
    id: 4,
    title: "E-commerce Rebranding Campaign",
    description: "Complete digital marketing overhaul for an established e-commerce brand",
    content: `
      <h2>Challenge</h2>
      <p>An established e-commerce brand was struggling with outdated brand perception and declining sales. They needed a complete digital marketing overhaul to reposition themselves in the market and appeal to a younger demographic while retaining their loyal customer base.</p>
      
      <h2>Strategy</h2>
      <p>I developed a comprehensive rebranding strategy that included:</p>
      <ul>
        <li>Complete website redesign with improved UX/UI and mobile optimization</li>
        <li>New content strategy focusing on storytelling and user-generated content</li>
        <li>Social media revamp across Instagram, TikTok, and Pinterest</li>
        <li>Influencer marketing campaign with 15 micro-influencers in the target niche</li>
        <li>Email marketing automation with personalized customer journeys</li>
        <li>Targeted PPC campaigns on Google and social platforms</li>
      </ul>
      
      <h2>Implementation</h2>
      <p>The implementation was phased over 3 months:</p>
      <ol>
        <li>Phase 1: Research, strategy development, and website redesign</li>
        <li>Phase 2: Content creation, social media revamp, and email automation setup</li>
        <li>Phase 3: Influencer campaign launch, PPC campaign optimization, and performance tracking</li>
      </ol>
      
      <h2>Results</h2>
      <p>The rebranding campaign delivered exceptional results:</p>
      <ul>
        <li>200% increase in online sales within 6 months</li>
        <li>156% increase in website traffic</li>
        <li>45% improvement in conversion rate</li>
        <li>320% growth in social media engagement</li>
        <li>28% reduction in customer acquisition cost</li>
        <li>75% increase in email open rates and 43% increase in click-through rates</li>
      </ul>
    `,
    image: "/placeholder.svg?height=400&width=600",
    category: "Digital Marketing",
    slug: "ecommerce-rebranding",
    date: "2023-05-20",
    tags: ["Digital Marketing", "Branding", "E-commerce"],
  },
  {
    id: 5,
    title: "Social Media Growth Strategy",
    description: "Multi-platform social media strategy focused on authentic storytelling",
    content: `
      <h2>Challenge</h2>
      <p>A fashion brand wanted to increase their social media presence and reach a younger audience. They had limited engagement on their existing platforms and needed a fresh approach to stand out in a crowded market.</p>
      
      <h2>Strategy</h2>
      <p>I created a multi-platform social media strategy focused on authentic storytelling and user engagement:</p>
      <ul>
        <li>Developed a consistent brand voice and visual identity across platforms</li>
        <li>Created a hashtag challenge campaign that encouraged user participation</li>
        <li>Partnered with micro-influencers who aligned with the brand values</li>
        <li>Implemented a content calendar with platform-specific content formats</li>
        <li>Set up social listening tools to monitor brand mentions and sentiment</li>
      </ul>
      
      <h2>Results</h2>
      <p>The campaign exceeded all expectations:</p>
      <ul>
        <li>Reached over 2 million users organically across platforms</li>
        <li>Generated 15,000+ user-generated content pieces using the campaign hashtag</li>
        <li>Increased follower count by 78% within 3 months</li>
        <li>Improved engagement rate from 1.2% to 4.8%</li>
        <li>Drove a 45% increase in website traffic from social channels</li>
      </ul>
    `,
    image: "/placeholder.svg?height=400&width=600",
    category: "Social Media",
    slug: "social-media-growth",
    date: "2022-11-15",
    tags: ["Social Media", "Content Strategy", "Engagement"],
  },
  {
    id: 6,
    title: "Programmatic Advertising Campaign",
    description: "Programmatic campaign across multiple channels for a travel agency",
    content: `
      <h2>Challenge</h2>
      <p>A travel agency needed to increase bookings during the post-pandemic recovery period. They wanted to reach potential travelers across multiple channels with targeted messaging based on their interests and travel history.</p>
      
      <h2>Strategy</h2>
      <p>I designed and executed a comprehensive programmatic advertising campaign that included:</p>
      <ul>
        <li>Audience segmentation based on travel interests, past behavior, and demographics</li>
        <li>Multi-channel approach including display, video, native, and CTV</li>
        <li>Dynamic creative optimization to personalize ad content</li>
        <li>Retargeting strategy to re-engage website visitors</li>
        <li>Contextual targeting to reach users consuming travel-related content</li>
        <li>Continuous optimization based on performance data</li>
      </ul>
      
      <h2>Implementation</h2>
      <p>The campaign was implemented across major DSPs including DV360, The Trade Desk, and Amazon DSP, with a focus on:</p>
      <ol>
        <li>Phase 1: Audience research and campaign setup</li>
        <li>Phase 2: Initial launch and data collection</li>
        <li>Phase 3: Optimization and scaling of top-performing segments and channels</li>
      </ol>
      
      <h2>Results</h2>
      <p>The programmatic campaign delivered outstanding results:</p>
      <ul>
        <li>Achieved 12:1 ROAS (Return on Ad Spend)</li>
        <li>Increased booking conversions by 67%</li>
        <li>Reduced cost per acquisition by 42%</li>
        <li>Expanded reach to 5 new geographic markets</li>
        <li>Improved click-through rates by 85% compared to previous campaigns</li>
        <li>Generated 35% of total bookings during the campaign period</li>
      </ul>
    `,
    image: "/placeholder.svg?height=400&width=600",
    category: "Programmatic",
    slug: "programmatic-campaign",
    date: "2023-07-10",
    tags: ["Programmatic", "Advertising", "Multi-channel"],
  },
]

export default function ProjectPage({ params }: ProjectPageProps) {
  // Find the project by slug
  const project = projects.find((p) => p.slug === params.slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-28 px-4">
      <Link href="/work" className="inline-flex items-center text-sm font-medium hover:underline mb-8 text-white">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Work
      </Link>

      <ScrollRevealWrapper>
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
      </ScrollRevealWrapper>
    </div>
  )
}
