"use client"

import type React from "react"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import PageParticles from "@/components/page-particles"
import { LogoStoryCard } from "@/components/logo-story-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Calendar, Phone, Mail } from "lucide-react"
import { motion } from "framer-motion"
import AnimatedText from "@/components/animated-text"

// Static case studies data
const caseStudies = [
  {
    id: 1,
    title: "Vazir Investments Website Redesign",
    description: "Luxury website for citizenship by investment advisory firm",
    image: "/vaziri-investments-hero.jpg",
    category: "Financial Services",
    slug: "vazir-investments",
    date: "2023-03-15",
  },
  {
    id: 2,
    title: "Uno Capital Digital Presence",
    description: "Sophisticated digital presence for boutique investment firm",
    image: "/modern-investment-banking-website.png",
    category: "Investment Banking",
    slug: "uno-capital",
    date: "2022-11-10",
  },
  {
    id: 3,
    title: "VG & Partners Brand Refresh",
    description: "Brand refresh and website redesign for consulting firm",
    image: "/consulting-firm-website.png",
    category: "Consulting",
    slug: "vg-and-partners",
    date: "2023-07-22",
  },
  {
    id: 4,
    title: "Findove Prototype Development",
    description: "Rapid prototype development for sustainable fashion startup",
    image: "/modern-startup-prototype.png",
    category: "Startup",
    slug: "findove",
    date: "2023-02-15",
  },
  {
    id: 5,
    title: "3K Learning Academy Website Development",
    description: "E-learning platform with interactive courses and student management system",
    image: "/e-learning-dashboard.png",
    category: "Web Development",
    slug: "3k-learning-academy",
    date: "2022-06-15",
  },
  {
    id: 6,
    title: "The DigitalWit Media Marketing Campaign",
    description: "Digital marketing campaigns increasing engagement by 45%",
    image: "/digital-marketing-dashboard.png",
    category: "Digital Marketing",
    slug: "digitalwit-media",
    date: "2023-03-10",
  },
  {
    id: 7,
    title: "Chandrika Kumar - Tarot",
    description: "Professional website with online booking and payment integration",
    image: "/mystical-tarot-website.png",
    category: "Website",
    slug: "chandrika-kumar-tarot",
    date: "2023-08-22",
  },
  {
    id: 8,
    title: "E-commerce Rebranding Campaign",
    description: "Complete digital marketing overhaul for an established e-commerce brand",
    image: "/ecommerce-rebranding-results.png",
    category: "Digital Marketing",
    slug: "ecommerce-rebranding",
    date: "2023-05-20",
  },
  {
    id: 9,
    title: "Social Media Growth Strategy",
    description: "Multi-platform social media strategy focused on authentic storytelling",
    image: "/social-media-dashboard.png",
    category: "Social Media",
    slug: "social-media-growth",
    date: "2022-11-15",
  },
  {
    id: 10,
    title: "Programmatic Advertising Campaign",
    description: "Programmatic campaign across multiple channels for a travel agency",
    image: "/placeholder.svg?key=mnkkf",
    category: "Programmatic",
    slug: "programmatic-campaign",
    date: "2023-07-10",
  },
]

// Logo Stories data
const logoStories = [
  {
    id: 1,
    title: "3K Learning Academy",
    description:
      "The 3k depicts the half part of a butterfly it clearly conveys that when kids join the schooling they are in a form of caterpillars but when they will leave this place by that time they will be transformed into butterflies and let to explore the opportunities around the world. The tag line conveys that the learning process shouldn't be confined to only classrooms it should be free and the vibe of the place should be free-flowing so the kids have a friendly, positive, creative atmosphere where they are nourished.",
    image: "/placeholder.svg?key=dwdvc",
  },
  {
    id: 2,
    title: "Chandrika Kumar - Tarot Queen",
    description:
      'Chandrika Kumar A tarot card reader wanted a logo that gave an image of her to the person who looks at this logo with big brown almond eyes filled with positivity and a sense of energy which instincts your gut power to make a particular desicison in the right manner "Trust your gut feeling" you know.',
    image: "/placeholder.svg?key=8hx9x",
  },
  {
    id: 3,
    title: "The DigitalWit Media & Advertising",
    description:
      'The DigitalWit Media & Advertising "Ideate Through". The idea of this logo is a simple digitally intelligent business, with a mission to provide digital services and help small businesses to advertise & market them into digital space within their budget. The marketing brain with lighting passing through is filled with ideas.',
    image: "/digital-marketing-logo.png",
  },
  {
    id: 4,
    title: "Espada Technical Services",
    description:
      "The logo of Espada Technical Services gives the look of an architectural & 3d perception of a wall where the name is placed inside the square. When you see from the right, the name will come first, but when you see from the left,t the name is inside. As their work is of fitouts and interior design, which covers the inside and the outside of any architectural project.",
    image: "/architectural-3d-square-logo.png",
  },
  {
    id: 5,
    title: "Villa Holidays",
    description:
      "A travel agency Villa Holidays their only aim is to provide the best and something different experience to its clients and the logo has a clear image of two mountains which also gives an image of villas and bungalows roofs as their main niche was to provide villas and bungalows to the tourist.",
    image: "/travel-agency-logo-mountain-villas.png",
  },
  {
    id: 6,
    title: "Fitness Brand Identity",
    description:
      "A modern fitness brand needed a logo that conveyed energy, strength, and motivation. The design uses dynamic shapes and bold typography to create a sense of movement and vitality, appealing to fitness enthusiasts of all levels.",
    image: "/placeholder.svg?key=fitness-brand",
  },
]

// Portfolio items for carousel
const portfolioItems = [
  {
    id: 1,
    title: "Digital Strategy",
    description: "Comprehensive digital strategies aligning business goals with online presence and customer journeys",
    image: "/portfolio-image-1.png",
  },
  {
    id: 2,
    title: "Programmatic Media Buying",
    description: "Data-driven programmatic campaigns across DSPs like DV360, The Trade Desk, and Amazon",
    image: "/programmatic-advertising.png",
  },
  {
    id: 3,
    title: "Brand Identity",
    description: "Strategic brand identity development including visual elements, voice, and positioning",
    image: "/brand-identity-design.png",
  },
  {
    id: 4,
    title: "Media Buying & Planning",
    description: "Strategic media planning and buying across multiple channels for optimal audience reach",
    image: "/portfolio-image-3.png",
  },
  {
    id: 5,
    title: "Copywriting",
    description: "Persuasive copywriting for ads, websites, and marketing materials that drive conversions",
    image: "/portfolio-image-4.png",
  },
  {
    id: 6,
    title: "PPC & Social Media Marketing",
    description: "Performance-focused paid search and social campaigns with high ROI and engagement",
    image: "/social-media-advertising.png",
  },
]

export default function WorkPage() {
  // Refs for carousel scrolling
  const portfolioRef = useRef<HTMLDivElement>(null)
  const caseStudiesRef = useRef<HTMLDivElement>(null)
  const logoStoriesRef = useRef<HTMLDivElement>(null)

  // Scroll handlers for carousels
  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (!ref.current) return

    const scrollAmount = ref.current.clientWidth * 0.8
    const newScrollLeft =
      direction === "left" ? ref.current.scrollLeft - scrollAmount : ref.current.scrollLeft + scrollAmount

    ref.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }

  return (
    <>
      <PageParticles />
      <div className="container mx-auto py-28 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">My Work</h1>
        <p className="text-white/90 mb-10 max-w-2xl">
          A showcase of my digital marketing projects, campaigns, and design work. Each project represents strategic
          thinking, creative execution, and measurable results.
        </p>

        {/* Portfolio Highlights Carousel */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <AnimatedText
              text="Portfolio Highlights"
              tag="h2"
              className="text-3xl font-bold text-gradient"
              speed={80}
            />
          </div>

          <div className="relative">
            {/* Carousel Navigation Buttons */}
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full glass-panel text-white border-white/20 hover:bg-white/10 hover-glow"
                onClick={() => scrollCarousel(portfolioRef, "left")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full glass-panel text-white border-white/20 hover:bg-white/10 hover-glow"
                onClick={() => scrollCarousel(portfolioRef, "right")}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Portfolio Carousel */}
            <div
              ref={portfolioRef}
              className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="flex-shrink-0 snap-center w-full max-w-sm glass-panel rounded-lg overflow-hidden hover-lift hover-glow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    scale: 1.01,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                >
                  <div className="relative h-60 w-full">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/90">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="mt-6 flex items-center justify-center space-x-2">
              <div className="w-full max-w-md glass-panel h-1 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "30%" }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <p className="text-xs text-white/80">Scroll to view more</p>
            </div>
          </div>
        </section>

        {/* Case Studies Carousel */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <AnimatedText text="Case Studies" tag="h2" className="text-3xl font-bold text-gradient" speed={80} />
          </div>

          <div className="relative">
            {/* Carousel Navigation Buttons */}
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full glass-panel text-white border-white/20 hover:bg-white/10 hover-glow"
                onClick={() => scrollCarousel(caseStudiesRef, "left")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full glass-panel text-white border-white/20 hover:bg-white/10 hover-glow"
                onClick={() => scrollCarousel(caseStudiesRef, "right")}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Case Studies Carousel */}
            <div
              ref={caseStudiesRef}
              className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  className="flex-shrink-0 snap-center w-full max-w-sm glass-panel rounded-lg overflow-hidden hover-lift hover-glow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    scale: 1.01,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                >
                  <Link href={`/case-study/${study.slug}`}>
                    <div className="relative h-60 w-full overflow-hidden">
                      <Image
                        src={study.image || "/placeholder.svg"}
                        alt={study.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 glass-panel text-white text-xs px-2 py-1 rounded">
                        {study.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{study.title}</h3>
                      <p className="text-white/90 mb-4">{study.description}</p>
                      <div className="text-white font-medium flex items-center gap-1 hover:text-white/80">
                        Read Case Study <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="mt-6 flex items-center justify-center space-x-2">
              <div className="w-full max-w-md glass-panel h-1 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "30%" }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <p className="text-xs text-white/80">Scroll to view more</p>
            </div>
          </div>
        </section>

        {/* Logo Stories Carousel */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <AnimatedText text="Logo Stories" tag="h2" className="text-3xl font-bold text-gradient" speed={80} />
          </div>

          <div className="relative">
            {/* Carousel Navigation Buttons */}
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full glass-panel text-white border-white/20 hover:bg-white/10 hover-glow"
                onClick={() => scrollCarousel(logoStoriesRef, "left")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full glass-panel text-white border-white/20 hover:bg-white/10 hover-glow"
                onClick={() => scrollCarousel(logoStoriesRef, "right")}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Logo Stories Carousel */}
            <div
              ref={logoStoriesRef}
              className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {logoStories.map((story, index) => (
                <LogoStoryCard key={story.id} title={story.title} description={story.description} image={story.image} />
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="mt-6 flex items-center justify-center space-x-2">
              <div className="w-full max-w-md glass-panel h-1 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "30%" }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <p className="text-xs text-white/80">Scroll to view more</p>
            </div>
          </div>
        </section>

        {/* Call to Action Section with Schedule, Call, Email buttons */}
        <motion.div
          className="glass-panel p-10 rounded-lg text-center hover-glow mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to Elevate Your Brand?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Let's collaborate to create impactful designs and marketing strategies that help your business stand out and
            achieve exceptional results. Get in touch today to discuss your project needs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {/* Schedule Button */}
            <Link href="/schedule">
              <Button
                className="w-full glass-panel text-white hover-glow border-white/20 hover:bg-white/10 flex items-center justify-center gap-2"
                size="lg"
              >
                <Calendar className="h-5 w-5" />
                <span>Schedule</span>
              </Button>
            </Link>

            {/* Call Button */}
            <Link href="tel:+1234567890">
              <Button
                className="w-full glass-panel text-white hover-glow-blue border-white/20 hover:bg-white/10 flex items-center justify-center gap-2"
                size="lg"
              >
                <Phone className="h-5 w-5" />
                <span>Call</span>
              </Button>
            </Link>

            {/* Email Button */}
            <Link href="mailto:contact@example.com">
              <Button
                className="w-full glass-panel text-white hover-glow-pink border-white/20 hover:bg-white/10 flex items-center justify-center gap-2"
                size="lg"
              >
                <Mail className="h-5 w-5" />
                <span>Email</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}
