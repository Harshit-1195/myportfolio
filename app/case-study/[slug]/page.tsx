"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Tag, Award, CheckCircle } from "lucide-react"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"
import PageParticles from "@/components/page-particles"

// Case study data
const caseStudies = {
  "vazir-investments": {
    title: "Vazir Investments Website Redesign",
    client: "Vazir Investments",
    date: "March 2023",
    category: "Financial Services",
    tags: ["Web Design", "Financial Services", "Luxury Branding", "UX/UI", "Responsive Design"],
    image: "/vaziri-investments-hero.jpg",
    challenge:
      "Vazir Investments, a prestigious citizenship by investment advisory firm, needed a complete website redesign to better reflect their premium services and improve user experience. Their existing website lacked visual appeal, had confusing navigation, and wasn't effectively communicating their unique value proposition to high-net-worth individuals seeking citizenship or residency through investment programs.",
    approach: [
      "Conducted extensive research on the citizenship by investment industry and competitor analysis",
      "Created user personas focusing on high-net-worth individuals and their specific needs",
      "Developed a sophisticated design language that conveys trust, luxury, and professionalism",
      "Implemented a clear information architecture to guide users through complex investment options",
      "Designed responsive layouts optimized for both desktop and mobile experiences",
      "Integrated multilingual support for their international clientele",
    ],
    solution:
      "We developed a premium website with a focus on luxury aesthetics and clear information architecture. The new design features stunning imagery of desirable locations, intuitive navigation guiding users through different citizenship and residency programs, and clear calls-to-action. We implemented a sophisticated content management system allowing the client to easily update program details, and integrated secure contact forms for confidential inquiries. The website was built with performance in mind, ensuring fast loading times even with high-resolution imagery.",
    results: [
      "42% increase in qualified leads within the first month after launch",
      "68% improvement in average session duration",
      "53% reduction in bounce rate on key landing pages",
      "35% increase in mobile conversions",
      "Positive feedback from existing clients on the professional presentation",
    ],
    testimonial: {
      quote:
        "The new website perfectly captures the premium nature of our services and has significantly improved our lead generation. The team understood our unique market position and translated it into a digital experience that resonates with our high-net-worth clients.",
      author: "Arman Vazir, Managing Director, Vazir Investments",
    },
    implementation: [
      {
        phase: "Phase 1: Discovery & Strategy",
        tasks: [
          "Stakeholder interviews and requirement gathering",
          "Competitor analysis and industry benchmarking",
          "User persona development and journey mapping",
          "Content strategy and information architecture planning",
        ],
      },
      {
        phase: "Phase 2: Design & Development",
        tasks: [
          "Brand refinement and visual identity development",
          "Wireframing and prototyping key user journeys",
          "High-fidelity design of all page templates",
          "Responsive development with focus on performance",
          "Content management system implementation",
          "Multilingual support integration",
        ],
      },
      {
        phase: "Phase 3: Launch & Optimization",
        tasks: [
          "Quality assurance and cross-browser testing",
          "SEO optimization for target markets",
          "Analytics implementation and goal tracking",
          "Staff training on content management",
          "Post-launch performance monitoring and optimization",
        ],
      },
    ],
    technologies: [
      "WordPress CMS",
      "Custom PHP Development",
      "SCSS",
      "JavaScript",
      "Cloudflare CDN",
      "Google Analytics 4",
      "HubSpot Integration",
    ],
    features: [
      "Interactive program comparison tool",
      "Secure document upload portal for applicants",
      "Multilingual content in 5 languages",
      "Location-based content personalization",
      "Integrated booking system for consultations",
      "Live chat support during business hours",
    ],
  },
  "uno-capital": {
    title: "Uno Capital Digital Presence",
    client: "Uno Capital",
    date: "November 2022",
    category: "Investment Banking",
    tags: ["Web Development", "Financial Services", "Branding", "Security", "Content Strategy"],
    image: "/modern-investment-banking-website.png",
    challenge:
      "Uno Capital, a boutique investment banking firm, needed to establish a sophisticated digital presence that would instill confidence in potential clients while maintaining strict compliance with financial regulations. They required a website that would effectively communicate their expertise, showcase their track record, and provide secure communication channels for sensitive client interactions, all while differentiating them from larger, more established competitors.",
    approach: [
      "Conducted in-depth interviews with partners to understand their unique value proposition",
      "Researched regulatory requirements for financial services websites in their operating regions",
      "Developed a content strategy focusing on thought leadership and expertise",
      "Created a visual identity that balances professionalism with approachability",
      "Designed secure contact protocols for sensitive client communications",
      "Implemented analytics that comply with privacy regulations",
    ],
    solution:
      "We created a comprehensive digital presence centered around a sophisticated yet approachable website design. The site features a clean, minimalist aesthetic with subtle animations that convey precision and attention to detail. We developed custom case study templates that highlight successful transactions without revealing confidential information, and implemented a secure client portal for document sharing and communications. The content strategy focused on establishing thought leadership through insightful market analyses and investment perspectives, positioning Uno Capital as knowledgeable advisors in their niche.",
    results: [
      "Successfully established brand presence in a competitive market",
      "Secured 5 major client engagements directly attributed to website inquiries",
      "Achieved 40% higher engagement with thought leadership content compared to industry average",
      "Reduced administrative workload by 25% through automated intake processes",
      "Received industry recognition for digital compliance excellence",
    ],
    testimonial: {
      quote:
        "Our new digital presence perfectly balances sophistication with accessibility, exactly what we needed to appeal to our target clients. The secure communication features have streamlined our client onboarding process, and the thought leadership platform has positioned us as experts in our field.",
      author: "Elena Moretti, Managing Partner, Uno Capital",
    },
    implementation: [
      {
        phase: "Phase 1: Strategy & Planning",
        tasks: [
          "Brand positioning and competitive analysis",
          "Regulatory compliance research and documentation",
          "Content strategy development",
          "User journey mapping for different client segments",
        ],
      },
      {
        phase: "Phase 2: Design & Development",
        tasks: [
          "Visual identity refinement",
          "Website wireframing and prototyping",
          "Secure client portal development",
          "Content creation and optimization",
          "Responsive implementation across devices",
        ],
      },
      {
        phase: "Phase 3: Launch & Growth",
        tasks: [
          "Security testing and vulnerability assessment",
          "Staff training on content management and client portal",
          "Analytics implementation with privacy controls",
          "Ongoing content calendar development",
          "Performance monitoring and optimization",
        ],
      },
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Prisma ORM",
      "PostgreSQL",
      "AWS S3",
      "Auth0",
      "Contentful CMS",
    ],
    features: [
      "Secure client portal with two-factor authentication",
      "Dynamic case study presentation system",
      "Regulatory-compliant contact forms",
      "Interactive team member profiles",
      "Integrated thought leadership blog",
      "Automated document signing workflow",
    ],
  },
  "vg-and-partners": {
    title: "VG & Partners Brand Refresh",
    client: "VG & Partners",
    date: "July 2023",
    category: "Consulting",
    tags: ["Branding", "Web Design", "Consulting", "Digital Strategy", "Content Marketing"],
    image: "/consulting-firm-website.png",
    challenge:
      "VG & Partners, an established consulting firm with over 15 years in the industry, was struggling with an outdated brand identity and website that no longer reflected their evolved service offerings and expertise. Their digital presence failed to convey their thought leadership and deep industry knowledge, resulting in difficulty attracting high-value clients and top talent. They needed a comprehensive brand refresh and website redesign that would position them as forward-thinking experts while honoring their established reputation.",
    approach: [
      "Facilitated brand workshops with leadership to identify core values and differentiators",
      "Conducted client interviews to understand perception and value proposition",
      "Analyzed competitor positioning and identified market gaps",
      "Developed a refined brand strategy and messaging framework",
      "Created a content strategy highlighting thought leadership and case studies",
      "Designed a modern visual identity system that evolved from their existing brand equity",
    ],
    solution:
      "We delivered a comprehensive brand refresh that maintained recognition while projecting a more sophisticated, contemporary image. The new visual identity featured refined typography, an expanded color palette, and a flexible graphic system that could adapt across various applications. The website redesign showcased their expertise through case studies, thought leadership content, and team member spotlights. We implemented a robust content management system that enabled easy updates and integrated with their CRM for lead tracking. The site architecture was completely restructured to better reflect their service offerings and create clear pathways for different client segments.",
    results: [
      "70% increase in qualified leads from target industries",
      "45% improvement in time-on-site for key service pages",
      "25% increase in job applications from qualified candidates",
      "Successfully secured 3 enterprise clients within 2 months of launch",
      "Positive feedback from existing clients on the evolved brand",
    ],
    testimonial: {
      quote:
        "The brand refresh has transformed how we're perceived in the market. We've maintained our recognition factor while projecting a much more sophisticated image that better reflects our expertise. The new website has become a powerful business development tool, effectively communicating our value proposition to potential clients.",
      author: "Victor Gallo, Founding Partner, VG & Partners",
    },
    implementation: [
      {
        phase: "Phase 1: Brand Strategy",
        tasks: [
          "Brand workshops and stakeholder interviews",
          "Market positioning analysis",
          "Messaging framework development",
          "Brand architecture refinement",
        ],
      },
      {
        phase: "Phase 2: Visual Identity & Design",
        tasks: [
          "Logo refinement and visual system development",
          "Typography and color palette selection",
          "Brand guidelines creation",
          "Marketing collateral templates",
          "Website design and prototyping",
        ],
      },
      {
        phase: "Phase 3: Website Development & Content",
        tasks: [
          "Content strategy and copywriting",
          "Website development and CMS implementation",
          "Case study creation and optimization",
          "Team member profile development",
          "CRM integration and lead tracking setup",
        ],
      },
    ],
    technologies: [
      "WordPress",
      "Advanced Custom Fields",
      "GSAP Animation",
      "HubSpot CRM Integration",
      "Cloudflare",
      "Google Analytics 4",
      "Hotjar",
    ],
    features: [
      "Interactive service explorer",
      "Filterable case study portfolio",
      "Team member expertise highlighting",
      "Integrated thought leadership blog",
      "Client testimonial video gallery",
      "Custom ROI calculator for services",
    ],
  },
  findove: {
    title: "Findove Prototype Development",
    client: "Findove",
    date: "February 2023",
    category: "Startup",
    tags: ["Prototyping", "Startup", "Wix Development", "MVP", "User Testing"],
    image: "/modern-startup-prototype.png",
    challenge:
      "Findove, an early-stage startup with a innovative concept for connecting independent designers with sustainable manufacturers, needed to quickly develop a functional prototype to validate their business model, attract initial users, and secure seed funding. With limited technical resources and a tight timeline, they required a solution that would allow them to test core functionality, gather user feedback, and demonstrate the concept to potential investors without significant upfront development costs.",
    approach: [
      "Conducted rapid discovery sessions to identify core features and user flows",
      "Created user personas and journey maps for both designers and manufacturers",
      "Developed low-fidelity wireframes to test information architecture",
      "Selected Wix as the rapid development platform for its balance of flexibility and speed",
      "Designed a phased implementation plan focusing on core functionality first",
      "Established metrics for success and user feedback mechanisms",
    ],
    solution:
      "We developed a fully functional prototype using Wix as the development platform, allowing for rapid iteration while maintaining a professional appearance. The prototype included user registration and profiles, a searchable directory of manufacturers with sustainability credentials, a portfolio showcase for designers, and a messaging system for initial connections. We implemented custom forms for gathering detailed requirements and integrated analytics to track user behavior. The design focused on clear value proposition communication and intuitive navigation, with special attention to mobile responsiveness for users working on-the-go.",
    results: [
      "Prototype completed in just 3 weeks, significantly faster than traditional development",
      "Successfully onboarded 45 designers and 12 manufacturers during initial testing phase",
      "Gathered critical user feedback leading to 3 major feature pivots",
      "Secured $150,000 in pre-seed funding based on prototype demonstration",
      "Validated core business assumptions before investing in custom development",
    ],
    testimonial: {
      quote:
        "The prototype was exactly what we needed at this stage of our journey. It allowed us to validate our concept with real users and make critical adjustments to our business model before investing in full-scale development. The speed of implementation was impressive, and the solution looked much more polished than we expected from a prototype.",
      author: "Sophia Chen, Founder, Findove",
    },
    implementation: [
      {
        phase: "Phase 1: Discovery & Planning",
        tasks: [
          "Concept refinement and feature prioritization",
          "User flow mapping and wireframing",
          "Platform evaluation and selection",
          "Technical requirements documentation",
        ],
      },
      {
        phase: "Phase 2: Rapid Development",
        tasks: [
          "Visual design and branding implementation",
          "Core functionality development",
          "User registration and profile creation",
          "Directory and search functionality",
          "Messaging system integration",
        ],
      },
      {
        phase: "Phase 3: Testing & Iteration",
        tasks: [
          "Internal quality assurance",
          "Initial user onboarding and feedback collection",
          "Analytics implementation and monitoring",
          "Iterative improvements based on user behavior",
          "Documentation for future development phases",
        ],
      },
    ],
    technologies: [
      "Wix Platform",
      "Wix Corvid (Velo)",
      "JavaScript",
      "Wix Database Collections",
      "RESTful APIs",
      "Google Analytics",
      "Hotjar",
    ],
    features: [
      "User registration and profile management",
      "Searchable manufacturer directory with filtering",
      "Designer portfolio showcase",
      "In-platform messaging system",
      "Sustainability credentials verification",
      "Project brief submission forms",
    ],
  },
  "3k-learning-academy": {
    title: "3K Learning Academy Website Development",
    client: "3K Learning Academy",
    date: "June 2022",
    category: "Web Development",
    tags: ["E-Learning", "UI/UX Design", "Web Development", "CMS Integration"],
    image: "/e-learning-dashboard.png",
    challenge:
      "3K Learning Academy needed a comprehensive e-learning platform to deliver their educational content to students. The platform needed to support interactive courses, student management, progress tracking, and secure payment processing. The client wanted a modern, intuitive interface that would appeal to both students and parents.",
    approach: [
      "Conducted extensive user research with students, parents, and teachers",
      "Created detailed wireframes and prototypes for key user journeys",
      "Developed a custom learning management system with progress tracking",
      "Implemented secure payment processing for course enrollments",
      "Built a responsive design that works seamlessly across all devices",
      "Integrated analytics to track student engagement and performance",
    ],
    solution:
      "We developed a comprehensive e-learning platform using Next.js for the frontend and Node.js for the backend. The platform features a custom learning management system, interactive course content, progress tracking, and secure payment processing. The design emphasizes ease of use and accessibility, with a clean, modern interface that appeals to both students and parents.",
    results: [
      "50% increase in student engagement compared to previous platform",
      "30% reduction in administrative workload for teachers",
      "95% positive feedback from students and parents",
      "20% increase in course enrollments within first 3 months",
    ],
    testimonial: {
      quote:
        "The new e-learning platform has transformed how we deliver educational content to our students. The intuitive interface and powerful features have made learning more engaging and accessible for everyone.",
      author: "Kiran Kumar, Director, 3K Learning Academy",
    },
    implementation: [
      {
        phase: "Phase 1: Research & Planning",
        tasks: [
          "Stakeholder interviews and requirement gathering",
          "User research with students, parents, and teachers",
          "Competitive analysis of other e-learning platforms",
          "Information architecture and user flow mapping",
        ],
      },
      {
        phase: "Phase 2: Design & Development",
        tasks: [
          "Wireframing and prototyping key user journeys",
          "Visual design and UI component development",
          "Frontend development using Next.js",
          "Backend development using Node.js and MongoDB",
          "Integration of payment processing and user authentication",
        ],
      },
      {
        phase: "Phase 3: Testing & Launch",
        tasks: [
          "Usability testing with target user groups",
          "Performance optimization and accessibility improvements",
          "Content migration and quality assurance",
          "Staff training and documentation",
          "Phased rollout to students and monitoring",
        ],
      },
    ],
    technologies: ["Next.js", "Node.js", "MongoDB", "AWS S3", "Stripe", "Tailwind CSS", "Framer Motion"],
    features: [
      "Interactive course content with multimedia support",
      "Student progress tracking and reporting",
      "Secure payment processing for course enrollments",
      "Administrative dashboard for teachers and staff",
      "Mobile-responsive design for learning on any device",
      "Real-time notifications and messaging system",
    ],
  },
  "digitalwit-media": {
    title: "The DigitalWit Media Marketing Campaign",
    client: "DigitalWit Media & Advertising",
    date: "March 2023",
    category: "Digital Marketing",
    tags: ["Social Media", "Content Strategy", "PPC", "Analytics"],
    image: "/digital-marketing-dashboard.png",
    challenge:
      "DigitalWit Media & Advertising needed to increase brand awareness and generate leads for their digital marketing services. They were struggling to stand out in a competitive market and wanted to showcase their expertise in a way that would resonate with potential clients.",
    approach: [
      "Conducted a comprehensive audit of their current marketing efforts",
      "Developed a multi-channel marketing strategy focused on thought leadership",
      "Created a content calendar with targeted blog posts, social media content, and email campaigns",
      "Implemented PPC campaigns targeting high-intent keywords",
      "Set up detailed analytics tracking to measure campaign performance",
    ],
    solution:
      "We developed a comprehensive digital marketing campaign that positioned DigitalWit Media as thought leaders in their industry. The campaign included a series of in-depth blog posts, social media content, email newsletters, and targeted PPC ads. We also implemented a lead generation system that captured and qualified potential clients.",
    results: [
      "45% increase in website traffic within 3 months",
      "60% increase in social media engagement",
      "35% increase in qualified leads",
      "25% reduction in cost per acquisition",
    ],
    testimonial: {
      quote:
        "The marketing campaign developed for us has transformed our business. We're now seen as thought leaders in our industry, and the increase in qualified leads has directly impacted our bottom line.",
      author: "Rahul Sharma, CEO, DigitalWit Media & Advertising",
    },
    implementation: [
      {
        phase: "Phase 1: Research & Strategy",
        tasks: [
          "Competitive analysis and market research",
          "Audience segmentation and persona development",
          "Keyword research and content gap analysis",
          "Channel strategy and budget allocation",
        ],
      },
      {
        phase: "Phase 2: Content Creation & Campaign Setup",
        tasks: [
          "Development of thought leadership content",
          "Design of social media assets and ad creatives",
          "Setup of PPC campaigns across Google and social platforms",
          "Implementation of email marketing automation",
        ],
      },
      {
        phase: "Phase 3: Optimization & Scaling",
        tasks: [
          "Performance analysis and campaign optimization",
          "A/B testing of ad creatives and landing pages",
          "Scaling of high-performing channels",
          "Reporting and strategy refinement",
        ],
      },
    ],
    technologies: [
      "Google Analytics",
      "Google Ads",
      "Meta Business Suite",
      "LinkedIn Campaign Manager",
      "Mailchimp",
      "SEMrush",
      "Hotjar",
    ],
    features: [
      "Comprehensive digital marketing strategy",
      "Multi-channel campaign implementation",
      "Detailed performance tracking and reporting",
      "Lead generation and qualification system",
      "Content marketing and thought leadership",
      "Conversion rate optimization",
    ],
  },
  "chandrika-kumar-tarot": {
    title: "Chandrika Kumar - Tarot Website",
    client: "Chandrika Kumar",
    date: "August 2023",
    category: "Website Development",
    tags: ["Web Design", "E-commerce", "Booking System", "Branding"],
    image: "/mystical-tarot-website.png",
    challenge:
      "Chandrika Kumar, a professional tarot card reader, needed a website that would showcase her services, allow clients to book sessions online, and establish her brand in the spiritual guidance space. She wanted a design that balanced mystical elements with professionalism to appeal to a diverse clientele.",
    approach: [
      "Developed a brand identity that balanced mystical elements with professionalism",
      "Created a user-friendly website with intuitive navigation and clear service offerings",
      "Implemented an online booking system with secure payment processing",
      "Designed a mobile-responsive layout for clients on the go",
      "Integrated testimonials and case studies to build credibility",
    ],
    solution:
      "We created a visually stunning website that perfectly captures Chandrika's unique approach to tarot reading. The site features an intuitive booking system, secure payment processing, and a blog section for sharing insights. The design balances mystical elements with a clean, professional layout that appeals to both spiritual seekers and corporate clients.",
    results: [
      "200% increase in online bookings within the first month",
      "40% of new clients discovered her services through the website",
      "Reduced administrative work by 15 hours per week",
      "Expanded client base to include corporate wellness programs",
    ],
    testimonial: {
      quote:
        "My new website perfectly captures the essence of my tarot practice. It's mystical yet professional, just like my approach to readings. The booking system has transformed my business, allowing me to focus on readings rather than administration.",
      author: "Chandrika Kumar, Professional Tarot Reader",
    },
    implementation: [
      {
        phase: "Phase 1: Brand Development & Design",
        tasks: [
          "Brand identity development",
          "Website wireframing and user flow mapping",
          "Visual design and mood board creation",
          "Content strategy and copywriting",
        ],
      },
      {
        phase: "Phase 2: Development & Integration",
        tasks: [
          "Frontend development with responsive design",
          "Integration of booking system and payment processing",
          "Blog setup and content management system",
          "SEO optimization and metadata setup",
        ],
      },
      {
        phase: "Phase 3: Launch & Marketing",
        tasks: [
          "Quality assurance and cross-browser testing",
          "Launch preparation and go-live",
          "Initial marketing campaign to drive traffic",
          "Analytics setup and performance monitoring",
        ],
      },
    ],
    technologies: ["WordPress", "WooCommerce", "Calendly", "Stripe", "Elementor", "Yoast SEO", "Google Analytics"],
    features: [
      "Intuitive online booking system",
      "Secure payment processing",
      "Mobile-responsive design",
      "Blog section for sharing insights",
      "Testimonials and case studies",
      "Service packages and gift certificates",
    ],
  },
  "ecommerce-rebranding": {
    title: "E-commerce Rebranding Campaign",
    client: "Fashion Retailer",
    category: "Digital Marketing",
    image: "/ecommerce-rebranding-results.png",
    challenge:
      "A well-established fashion retailer was struggling to connect with younger demographics while maintaining their loyal customer base. They needed a complete digital marketing overhaul to reposition their brand in the market.",
    approach: [
      "Conducted extensive market research and customer surveys",
      "Developed a new brand identity that appealed to both existing and target customers",
      "Created a comprehensive digital marketing strategy across multiple channels",
      "Redesigned the e-commerce website with improved UX and mobile optimization",
      "Implemented data-driven marketing campaigns with personalization",
    ],
    solution:
      "We developed a comprehensive rebranding campaign that included a refreshed visual identity, website redesign, and targeted digital marketing campaigns. The new brand positioning successfully bridged the gap between traditional values and contemporary trends, appealing to both existing customers and younger demographics.",
    results: [
      "200% increase in online sales within 6 months",
      "156% increase in website traffic",
      "45% improvement in conversion rate",
      "320% growth in social media engagement",
      "38% increase in average order value",
    ],
    testimonial: {
      quote:
        "The rebranding campaign has transformed our business. We've successfully attracted a younger audience without alienating our loyal customers. The results have exceeded our expectations in every metric.",
      author: "Marketing Director, Fashion Retailer",
    },
  },
  "social-media-growth": {
    title: "Social Media Growth Strategy",
    client: "Lifestyle Brand",
    category: "Social Media",
    image: "/social-media-dashboard.png",
    challenge:
      "A lifestyle brand wanted to increase their social media presence and engagement across multiple platforms. They were struggling with inconsistent posting, low engagement rates, and a lack of cohesive strategy.",
    approach: [
      "Conducted a social media audit and competitor analysis",
      "Developed platform-specific strategies for Instagram, TikTok, and Pinterest",
      "Created a content calendar with diverse content types",
      "Implemented a user-generated content campaign",
      "Established influencer partnerships and collaborations",
    ],
    solution:
      "We developed a multi-platform social media strategy focused on authentic storytelling and community building. The strategy included a mix of product features, lifestyle content, user-generated content, and influencer collaborations. We implemented a consistent posting schedule and engagement tactics to build a loyal following.",
    results: [
      "Reached over 2 million users organically across platforms",
      "Generated 15,000+ user-generated content pieces",
      "Increased follower count by 78% within 3 months",
      "Improved engagement rate from 1.2% to 4.8%",
      "Drove 35% of website traffic from social media channels",
    ],
    testimonial: {
      quote:
        "The social media strategy has completely transformed our brand presence online. We're now seeing consistent engagement and growth across all platforms, and our community feels more connected to our brand than ever before.",
      author: "Social Media Manager, Lifestyle Brand",
    },
  },
  "programmatic-campaign": {
    title: "Programmatic Advertising Campaign",
    client: "Travel Agency",
    category: "Programmatic",
    image: "/placeholder.svg?key=mnkkf",
    challenge:
      "A travel agency wanted to increase bookings during the post-pandemic recovery period. They needed a cost-effective advertising solution that could target potential travelers across multiple channels and devices.",
    approach: [
      "Developed audience segments based on travel interests and behaviors",
      "Created a programmatic advertising strategy across display, video, and native formats",
      "Implemented dynamic creative optimization for personalized messaging",
      "Established real-time bidding parameters and budget allocation",
      "Set up comprehensive tracking and attribution modeling",
    ],
    solution:
      "We designed and executed a programmatic advertising campaign that targeted potential travelers across multiple channels, including display, video, and native advertising. The campaign used dynamic creative optimization to deliver personalized messaging based on user interests and behaviors. We implemented a data-driven approach to optimize bidding and budget allocation in real-time.",
    results: [
      "Achieved 12:1 ROAS (Return on Ad Spend)",
      "Increased booking conversions by 67%",
      "Reduced cost per acquisition by 42%",
      "Expanded reach to 5 new geographic markets",
      "Improved click-through rate by 85% compared to previous campaigns",
    ],
    testimonial: {
      quote:
        "The programmatic campaign delivered exceptional results during a challenging time for the travel industry. The team's data-driven approach and strategic targeting helped us reach the right audiences with the right messages, resulting in a significant increase in bookings.",
      author: "Marketing Director, Travel Agency",
    },
  },
}

export default function CaseStudyPage() {
  const params = useParams()
  const slug = params.slug as string
  const [caseStudy, setCaseStudy] = useState<any>(null)

  useEffect(() => {
    // Get case study data based on slug
    if (slug && caseStudies[slug as keyof typeof caseStudies]) {
      setCaseStudy(caseStudies[slug as keyof typeof caseStudies])
    }
  }, [slug])

  if (!caseStudy) {
    return (
      <div className="container mx-auto py-28 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">Case Study Not Found</h1>
          <p className="text-white/70 mb-8">The case study you're looking for doesn't exist or has been moved.</p>
          <Link href="/work">
            <button className="flex items-center gap-2 text-white hover:text-white/80">
              <ArrowLeft className="h-4 w-4" /> Back to Work
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageParticles />
      <div className="container mx-auto py-28 px-4">
        {/* Back button */}
        <Link href="/work">
          <button className="flex items-center gap-2 text-white/70 hover:text-white mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Work
          </button>
        </Link>

        {/* Hero section */}
        <ScrollRevealWrapper>
          <div className="glass-panel rounded-lg overflow-hidden mb-12">
            <div className="relative h-[400px] w-full">
              <Image src={caseStudy.image || "/placeholder.svg"} alt={caseStudy.title} fill className="object-cover" />
            </div>
            <div className="p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{caseStudy.title}</h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-white/70">
                  <User className="h-4 w-4" />
                  <span>Client: {caseStudy.client}</span>
                </div>
                {caseStudy.date && (
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="h-4 w-4" />
                    <span>{caseStudy.date}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-white/70">
                  <Tag className="h-4 w-4" />
                  <span>{caseStudy.category}</span>
                </div>
              </div>

              {caseStudy.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {caseStudy.tags.map((tag: string, index: number) => (
                    <span key={index} className="text-xs px-2 py-1 rounded-full glass-panel text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollRevealWrapper>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Challenge section */}
            <ScrollRevealWrapper>
              <div className="glass-panel rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-white">The Challenge</h2>
                <p className="text-white/70">{caseStudy.challenge}</p>
              </div>
            </ScrollRevealWrapper>

            {/* Approach section */}
            {caseStudy.approach && (
              <ScrollRevealWrapper>
                <div className="glass-panel rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">Our Approach</h2>
                  <ul className="space-y-2">
                    {caseStudy.approach.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-white/70">
                        <CheckCircle className="h-5 w-5 text-white/50 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollRevealWrapper>
            )}

            {/* Solution section */}
            <ScrollRevealWrapper>
              <div className="glass-panel rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-white">The Solution</h2>
                <p className="text-white/70">{caseStudy.solution}</p>
              </div>
            </ScrollRevealWrapper>

            {/* Implementation section */}
            {caseStudy.implementation && (
              <ScrollRevealWrapper>
                <div className="glass-panel rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">Implementation Process</h2>
                  <div className="space-y-6">
                    {caseStudy.implementation.map((phase: any, index: number) => (
                      <div key={index}>
                        <h3 className="text-xl font-semibold mb-3 text-white">{phase.phase}</h3>
                        <ul className="space-y-2">
                          {phase.tasks.map((task: string, taskIndex: number) => (
                            <li key={taskIndex} className="flex items-start gap-2 text-white/70">
                              <CheckCircle className="h-5 w-5 text-white/50 flex-shrink-0 mt-0.5" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollRevealWrapper>
            )}
          </div>

          {/* Right column - 1/3 width */}
          <div>
            {/* Results section */}
            <ScrollRevealWrapper>
              <div className="glass-panel rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-white">Results</h2>
                <ul className="space-y-3">
                  {caseStudy.results.map((result: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                      <span className="text-white/70">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollRevealWrapper>

            {/* Technologies section */}
            {caseStudy.technologies && (
              <ScrollRevealWrapper>
                <div className="glass-panel rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">Technologies Used</h2>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.technologies.map((tech: string, index: number) => (
                      <span key={index} className="text-sm px-3 py-1 rounded-full glass-panel text-white/80">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollRevealWrapper>
            )}

            {/* Features section */}
            {caseStudy.features && (
              <ScrollRevealWrapper>
                <div className="glass-panel rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">Key Features</h2>
                  <ul className="space-y-2">
                    {caseStudy.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-white/70">
                        <CheckCircle className="h-5 w-5 text-white/50 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollRevealWrapper>
            )}

            {/* Testimonial section */}
            {caseStudy.testimonial && (
              <ScrollRevealWrapper>
                <div className="glass-panel rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">Client Testimonial</h2>
                  <blockquote className="border-l-2 border-white/20 pl-4 italic text-white/70">
                    "{caseStudy.testimonial.quote}"
                  </blockquote>
                  <p className="text-right text-white/50 mt-4">— {caseStudy.testimonial.author}</p>
                </div>
              </ScrollRevealWrapper>
            )}
          </div>
        </div>

        {/* CTA section */}
        <ScrollRevealWrapper>
          <div className="glass-panel rounded-lg p-8 text-center mt-12">
            <h2 className="text-2xl font-bold mb-4 text-white">Ready to Start Your Project?</h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Let's discuss how we can help you achieve similar results for your business.
            </p>
            <Link href="/contact">
              <button className="px-6 py-3 rounded-lg glass-panel text-white hover-glow border-white/20 hover:bg-white/10">
                Get in Touch
              </button>
            </Link>
          </div>
        </ScrollRevealWrapper>
      </div>
    </>
  )
}
