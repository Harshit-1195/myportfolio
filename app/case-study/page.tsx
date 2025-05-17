"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"
import PageParticles from "@/components/page-particles"

// Case study data
const caseStudies = [
  {
    id: "vazir-investments",
    title: "Vazir Investments Website Redesign",
    client: "Vazir Investments",
    category: "Financial Services",
    image: "/vaziri-investments-hero.jpg",
    description:
      "A complete website redesign for a citizenship by investment advisory firm, focusing on luxury branding and clear information architecture.",
    tags: ["Web Design", "Financial Services", "Luxury Branding", "UX/UI"],
  },
  {
    id: "uno-capital",
    title: "Uno Capital Digital Presence",
    client: "Uno Capital",
    category: "Investment Banking",
    image: "/modern-investment-banking-website.png",
    description:
      "Creating a sophisticated digital presence for a boutique investment firm with focus on security, trust, and professional aesthetics.",
    tags: ["Web Development", "Financial Services", "Branding", "Security"],
  },
  {
    id: "vg-and-partners",
    title: "VG & Partners Brand Refresh",
    client: "VG & Partners",
    category: "Consulting",
    image: "/consulting-firm-website.png",
    description:
      "A comprehensive brand refresh and website redesign for a growing consulting firm looking to attract high-value clients.",
    tags: ["Branding", "Web Design", "Consulting", "Digital Strategy"],
  },
  {
    id: "findove",
    title: "Findove Prototype Development",
    client: "Findove",
    category: "Startup",
    image: "/modern-startup-prototype.png",
    description:
      "Developing a functional prototype for a startup using Wix as a rapid development platform to validate business concepts.",
    tags: ["Prototyping", "Startup", "Wix Development", "MVP"],
  },
  {
    id: "3k-learning-academy",
    title: "3K Learning Academy Website Development",
    client: "3K Learning Academy",
    category: "E-Learning",
    image: "/e-learning-dashboard.png",
    description:
      "A comprehensive e-learning platform with course management, student tracking, and payment processing capabilities.",
    tags: ["E-Learning", "Web Development", "UX/UI Design"],
  },
  {
    id: "digitalwit-media",
    title: "DigitalWit Media Marketing Campaign",
    client: "DigitalWit Media",
    category: "Digital Marketing",
    image: "/digital-marketing-dashboard.png",
    description:
      "A multi-channel digital marketing campaign that increased brand awareness and lead generation for a digital agency.",
    tags: ["Digital Marketing", "Content Strategy", "PPC", "Analytics"],
  },
  {
    id: "chandrika-kumar-tarot",
    title: "Chandrika Kumar - Tarot Website",
    client: "Chandrika Kumar",
    category: "Web Design",
    image: "/mystical-tarot-website.png",
    description: "A visually stunning website with online booking system for a professional tarot card reader.",
    tags: ["Web Design", "E-commerce", "Booking System", "Branding"],
  },
  {
    id: "ecommerce-rebranding",
    title: "E-commerce Rebranding Campaign",
    client: "Fashion Retailer",
    category: "Digital Marketing",
    image: "/ecommerce-rebranding-results.png",
    description: "A complete digital marketing overhaul that repositioned a fashion retailer for younger demographics.",
    tags: ["Rebranding", "E-commerce", "Digital Marketing", "Social Media"],
  },
  {
    id: "social-media-growth",
    title: "Social Media Growth Strategy",
    client: "Lifestyle Brand",
    category: "Social Media",
    image: "/social-media-dashboard.png",
    description:
      "A multi-platform social media strategy that increased engagement and followers for a lifestyle brand.",
    tags: ["Social Media", "Content Strategy", "Influencer Marketing"],
  },
]

export default function CaseStudiesPage() {
  const [filter, setFilter] = useState("all")
  const [filteredCaseStudies, setFilteredCaseStudies] = useState(caseStudies)

  // Get unique categories
  const categories = ["all", ...new Set(caseStudies.map((study) => study.category))]

  // Filter case studies when filter changes
  useEffect(() => {
    if (filter === "all") {
      setFilteredCaseStudies(caseStudies)
    } else {
      setFilteredCaseStudies(caseStudies.filter((study) => study.category === filter))
    }
  }, [filter])

  return (
    <>
      <PageParticles />
      <div className="container mx-auto py-28 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Case Studies</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Explore our portfolio of successful projects and discover how we've helped businesses achieve their goals.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm ${filter === category ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Case studies grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCaseStudies.map((study) => (
            <ScrollRevealWrapper key={study.id}>
              <Link href={`/case-study/${study.id}`}>
                <motion.div
                  className="glass-panel rounded-lg overflow-hidden h-full"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="relative h-60">
                    <Image src={study.image || "/placeholder.svg"} alt={study.title} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white">{study.title}</h3>
                    <p className="text-white/70 mb-4">{study.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {study.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs px-2 py-1 rounded-full glass-panel text-white/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </ScrollRevealWrapper>
          ))}
        </div>
      </div>
    </>
  )
}
