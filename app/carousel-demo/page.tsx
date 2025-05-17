import { SquareCarousel } from "@/components/square-carousel"

// Sample carousel items
const carouselItems = [
  {
    id: 1,
    image: "/digital-marketing-dashboard.png",
    title: "Digital Marketing Campaign",
    description:
      "A comprehensive digital marketing campaign for a retail client that increased online sales by 45% and reduced customer acquisition costs by 30%. The strategy included social media advertising, email marketing, and search engine optimization. The campaign ran for 3 months and targeted customers in the 25-45 age range with interests in fashion and lifestyle products.",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=500&width=500&query=website redesign project",
    title: "Website Redesign Project",
    description:
      "Complete overhaul of an e-commerce website with a focus on user experience and conversion rate optimization. The redesign included a streamlined checkout process, improved product filtering, and mobile optimization. After launch, the site experienced a 60% increase in mobile conversions and a 25% reduction in cart abandonment rate.",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=500&width=500&query=brand identity design",
    title: "Brand Identity Design",
    description:
      "Development of a comprehensive brand identity for a startup in the health and wellness space. The project included logo design, color palette selection, typography guidelines, and brand voice development. The new identity helped the client secure venture capital funding and establish a strong market presence within their first year of operation.",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=500&width=500&query=social media content strategy",
    title: "Social Media Content Strategy",
    description:
      "Creation and implementation of a 6-month social media content strategy for a B2B software company. The strategy focused on thought leadership content, case studies, and industry insights. Results included a 78% increase in engagement, 45% growth in followers, and 12 qualified leads directly attributed to social media content.",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=500&width=500&query=email marketing automation",
    title: "Email Marketing Automation",
    description:
      "Design and implementation of an automated email marketing funnel for a SaaS company. The project included welcome sequences, educational content, and re-engagement campaigns. The automation increased trial-to-paid conversion rates by 35% and reduced customer churn by 20% through targeted retention campaigns.",
  },
]

export default function CarouselDemoPage() {
  return (
    <div className="container mx-auto py-28 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white text-center">Portfolio Showcase</h1>

      <SquareCarousel items={carouselItems} autoPlay={true} autoPlayInterval={8000} />

      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">About This Carousel</h2>
        <div className="prose prose-invert">
          <p>
            This 1000x1000 square carousel showcases portfolio items with a clean, modern design. Each slide features an
            image in the top half and scrollable content in the bottom half.
          </p>
          <p>The carousel supports:</p>
          <ul>
            <li>Touch/swipe navigation</li>
            <li>Arrow navigation</li>
            <li>Dot indicators</li>
            <li>Auto-play functionality</li>
            <li>Smooth transitions between slides</li>
          </ul>
          <p>
            The square format ensures consistent presentation across all devices while maintaining the 1:1 aspect ratio
            requested.
          </p>
        </div>
      </div>
    </div>
  )
}
