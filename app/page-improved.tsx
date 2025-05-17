"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowDown, ChevronRight } from "lucide-react"
import SectionTransition from "@/components/section-transition"
import AnimatedHeading from "@/components/animated-heading"
import { Button } from "@/components/ui/button"
import { Calendar, Mail, Phone } from "lucide-react"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Featured projects data
  const featuredProjects = [
    {
      title: "3K Learning Academy",
      description: "E-learning platform with interactive courses and student management system",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Web Development", "UI/UX", "E-Learning"],
    },
    {
      title: "The DigitalWit Media",
      description: "Digital marketing campaigns increasing engagement by 45%",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Digital Marketing", "Social Media", "Analytics"],
    },
    {
      title: "Chandrika Kumar - Tarot",
      description: "Professional website with online booking and payment integration",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Website", "Payment Integration", "Booking System"],
    },
  ]

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section - Modern and Centered */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="z-10 text-center"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4 block"
            >
              Performance & Programmatic Manager
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 text-gradient glow-text"
            >
              HARSHIT DABHI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-white/70 mb-8 max-w-2xl mx-auto"
            >
              Digital marketing professional with 8+ years of experience in programmatic advertising, media buying, and
              campaign optimization.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/work">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full glass-panel text-white hover-glow transition-all duration-300 flex items-center gap-2"
                >
                  View My Work
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Section - Immediately below hero */}
        <motion.div
          className="container mx-auto max-w-4xl mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="glass-panel p-4 rounded-lg">
              <h3 className="text-3xl font-bold text-white mb-1">600%</h3>
              <p className="text-sm text-white/60">Average ROI</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <h3 className="text-3xl font-bold text-white mb-1">50+</h3>
              <p className="text-sm text-white/60">Global Clients</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <h3 className="text-3xl font-bold text-white mb-1">8+</h3>
              <p className="text-sm text-white/60">Years Experience</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <h3 className="text-3xl font-bold text-white mb-1">200+</h3>
              <p className="text-sm text-white/60">Campaigns</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-10 text-white/30 vertical-text text-sm tracking-widest"
        >
          DIGITAL • STRATEGY • MARKETING
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 right-10 text-white/30 text-sm tracking-widest"
        >
          EST. 2015
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <span className="text-white/50 text-sm mb-2">Scroll Down</span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
            <ArrowDown className="text-white/50 h-5 w-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <SectionTransition className="py-20 px-4 md:px-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <AnimatedHeading text="Featured Projects" className="text-3xl md:text-4xl font-light text-gradient" />
            <Link href="/work">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/70 hover:text-white flex items-center gap-1 transition-colors"
              >
                View All Projects <ChevronRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={index}
                className="glass-panel rounded-lg overflow-hidden hover-lift"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative h-48 w-full">
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-white mb-2">{project.title}</h3>
                  <p className="text-white/70 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full glass-panel text-white/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/case-study/${index + 1}`}>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="text-white/70 hover:text-white flex items-center gap-1 transition-colors text-sm"
                    >
                      View Case Study <ArrowRight className="h-3 w-3" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionTransition>

      {/* Expertise Section with Floating Cards */}
      <SectionTransition className="py-20 px-4 md:px-10">
        <div className="container mx-auto max-w-6xl">
          <AnimatedHeading
            text="My Expertise"
            className="text-4xl md:text-5xl font-light mb-16 text-gradient text-center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Programmatic Advertising",
                description: "Managing global campaigns across major DSPs like DV360, TTD, and Amazon.",
                color: "hover-glow",
                delay: 0,
              },
              {
                title: "Performance Marketing",
                description: "Data-driven strategies to maximize ROI and campaign performance.",
                color: "hover-glow-pink",
                delay: 0.1,
              },
              {
                title: "Media Planning & Buying",
                description: "Strategic media planning and buying across multiple channels and regions.",
                color: "hover-glow-yellow",
                delay: 0.2,
              },
              {
                title: "PPC & Paid Media",
                description: "Managing and optimizing PPC campaigns with high CTR and conversion rates.",
                color: "hover-glow-blue",
                delay: 0.3,
              },
              {
                title: "Analytics & Reporting",
                description: "Leveraging GA4, Tableau, and Salesforce for actionable insights.",
                color: "hover-glow",
                delay: 0.4,
              },
              {
                title: "Budget Management",
                description: "Efficiently managing large advertising budgets to maximize performance.",
                color: "hover-glow-pink",
                delay: 0.5,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: item.delay }}
                whileHover={{ y: -10 }}
                // Add floating animation
                animate={{
                  y: [0, -10, 0],
                  transition: {
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: index * 0.5,
                  },
                }}
                className={`glass-panel p-8 rounded-lg ${item.color} transition-all duration-300`}
              >
                <h3 className="text-xl font-medium mb-4 text-white">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionTransition>

      {/* Professional Journey Section */}
      <SectionTransition className="py-20 px-4 md:px-10">
        <div className="container mx-auto max-w-6xl">
          <AnimatedHeading
            text="Professional Journey"
            className="text-4xl md:text-5xl font-light mb-16 text-gradient text-center"
          />

          <div className="timeline-container ml-4 md:ml-10">
            {[
              {
                role: "Performance & Programmatic Manager",
                company: "Media Agency Group",
                period: "2024 - Present",
                description:
                  "Managing global programmatic campaigns for major accounts including NHS, Ariana Grande Perfumes, and Kuwait Airways.",
              },
              {
                role: "Performance Marketing Manager",
                company: "Vazir Group",
                period: "2023 - 2024",
                description:
                  "Led high-performing media buying campaigns resulting in a 126% increase in website traffic and a 1173% boost in social media engagement.",
              },
              {
                role: "Digital & Marketing Manager",
                company: "UNO CAPITAL",
                period: "2022 - 2023",
                description:
                  "Achieved a 1.68% conversion rate, the highest in the industry, through data-driven digital strategies.",
              },
              {
                role: "Founder",
                company: "The DigitalWit",
                period: "2016 - 2021",
                description: "Founded and led a digital agency specializing in comprehensive marketing solutions.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="timeline-content"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="timeline-dot" />
                <div className="glass-panel p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-white mb-1">{item.role}</h3>
                  <div className="flex justify-between mb-2">
                    <p className="text-white/70">{item.company}</p>
                    <p className="text-white/50 text-sm">{item.period}</p>
                  </div>
                  <p className="text-white/70 text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/resume">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full glass-panel text-white hover-glow transition-all duration-300 inline-flex items-center gap-2"
              >
                View Full Resume
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </SectionTransition>

      {/* Latest Blog Posts */}
      <SectionTransition className="py-20 px-4 md:px-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <AnimatedHeading text="Latest Insights" className="text-3xl md:text-4xl font-light text-gradient" />
            <Link href="/blog">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/70 hover:text-white flex items-center gap-1 transition-colors"
              >
                View All Posts <ChevronRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "The Future of Programmatic Advertising in 2024",
                excerpt: "Explore the latest trends and technologies shaping programmatic advertising in 2024.",
                date: "April 2, 2024",
                category: "Programmatic",
              },
              {
                title: "Maximizing ROI with Omnichannel Media Buying",
                excerpt:
                  "Learn how to create cohesive campaigns across multiple channels to maximize your marketing ROI.",
                date: "March 15, 2024",
                category: "Media Buying",
              },
              {
                title: "Data-Driven Decision Making in Digital Marketing",
                excerpt:
                  "Discover how to leverage analytics tools to make informed marketing decisions that drive results.",
                date: "February 28, 2024",
                category: "Analytics",
              },
            ].map((post, index) => (
              <motion.div
                key={index}
                className="glass-panel rounded-lg overflow-hidden hover-lift"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs px-2 py-1 rounded-full glass-panel text-white/80">{post.category}</span>
                    <span className="text-white/50 text-xs">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">{post.title}</h3>
                  <p className="text-white/70 mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${index + 1}`}>
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="text-white/70 hover:text-white flex items-center gap-1 transition-colors text-sm"
                    >
                      Read More <ArrowRight className="h-3 w-3" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionTransition>

      {/* Certificate Carousel Section */}
      <SectionTransition className="py-20 px-4 md:px-10 bg-black/30">
        <div className="container mx-auto max-w-6xl">
          {/* Carousel Container - Now placed above the text */}
          <div className="relative mb-16">
            {/* Carousel - Removed the glass-panel wrapper */}
            <div className="overflow-hidden">
              <div
                className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {[
                  { name: "Google Ads", logo: "/placeholder.svg?height=80&width=80", year: "2023" },
                  { name: "Meta Blueprint", logo: "/placeholder.svg?height=80&width=80", year: "2023" },
                  { name: "Google Analytics", logo: "/placeholder.svg?height=80&width=80", year: "2022" },
                  { name: "Trade Desk Edge", logo: "/placeholder.svg?height=80&width=80", year: "2023" },
                  { name: "Amazon Advertising", logo: "/placeholder.svg?height=80&width=80", year: "2022" },
                  { name: "HubSpot Marketing", logo: "/placeholder.svg?height=80&width=80", year: "2021" },
                  { name: "DV360", logo: "/placeholder.svg?height=80&width=80", year: "2023" },
                  { name: "Salesforce", logo: "/placeholder.svg?height=80&width=80", year: "2022" },
                  { name: "Tableau", logo: "/placeholder.svg?height=80&width=80", year: "2022" },
                  { name: "TikTok Ads", logo: "/placeholder.svg?height=80&width=80", year: "2023" },
                  { name: "LinkedIn Ads", logo: "/placeholder.svg?height=80&width=80", year: "2022" },
                  { name: "Snapchat Ads", logo: "/placeholder.svg?height=80&width=80", year: "2022" },
                ].map((cert, index) => (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 snap-center w-full max-w-xs glass-panel p-6 rounded-lg flex items-center space-x-4 hover-glow-yellow relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{
                      y: -5,
                      scale: 1.05,
                      transition: { type: "spring", stiffness: 400, damping: 10 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/5 z-0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="relative w-16 h-16 flex-shrink-0 z-10"
                      whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
                    >
                      <Image src={cert.logo || "/placeholder.svg"} alt={cert.name} fill className="object-contain" />
                    </motion.div>
                    <div className="flex-1 relative z-10">
                      <p className="text-lg font-medium text-white">{cert.name}</p>
                      <p className="text-sm text-white/50">Certified {cert.year}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Slider Controls */}
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
              <p className="text-xs text-white/50">Slide to view more</p>
            </div>

            {/* Mouse Indicator */}
            <motion.div
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <p className="text-xs text-white/50 mb-1">Scroll horizontally</p>
              <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center items-start p-1">
                <motion.div
                  className="w-1 h-2 bg-white/50 rounded-full"
                  animate={{
                    y: [0, 4, 0],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.5,
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Title and description now come after the carousel */}
          <AnimatedHeading
            text="Certifications & Credentials"
            className="text-3xl md:text-4xl font-light mb-6 text-gradient text-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 max-w-2xl mx-auto text-center"
          >
            Professional certifications that validate my expertise in digital marketing, programmatic advertising, and
            media buying.
          </motion.p>
        </div>
      </SectionTransition>

      {/* Contact CTA Section */}
      <SectionTransition className="py-20 px-4 md:px-10">
        <div className="container mx-auto max-w-4xl text-center">
          <AnimatedHeading text="Let's Work Together" className="text-4xl md:text-5xl font-light mb-6 text-gradient" />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 mb-10 max-w-2xl mx-auto"
          >
            Looking for a digital marketing professional with expertise in programmatic advertising and media buying?
            I'd love to discuss how I can help elevate your marketing strategy.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => (window.location.href = "tel:+971556453208")}
                className="px-8 py-6 rounded-lg glass-panel text-white hover-glow transition-all duration-300 flex items-center gap-3"
              >
                <Phone className="h-5 w-5" />
                Call Me
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => window.open("https://calendly.com/harshitdabhi/30min", "_blank")}
                className="px-8 py-6 rounded-lg glass-panel text-white hover-glow-yellow transition-all duration-300 flex items-center gap-3"
              >
                <Calendar className="h-5 w-5" />
                Schedule a Meeting
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => (window.location.href = "mailto:dabhiharshit11@gmail.com")}
                className="px-8 py-6 rounded-lg glass-panel text-white hover-glow-pink transition-all duration-300 flex items-center gap-3"
              >
                <Mail className="h-5 w-5" />
                Send Email
              </Button>
            </motion.div>
          </div>
        </div>
      </SectionTransition>
    </div>
  )
}
