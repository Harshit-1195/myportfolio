"use client"

import { useRef, useEffect, useState, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowDown, ChevronRight, ExternalLink, X, Award } from "lucide-react"
import SectionTransition from "@/components/section-transition"
import AnimatedHeading from "@/components/animated-heading"
import { Button } from "@/components/ui/button"
import { Calendar, Mail, Phone } from "lucide-react"
import { throttle } from "@/lib/utils"
import { OrganizationJsonLd } from "@/components/json-ld"

type Certificate = {
  name: string
  organization: string
  issuedDate: string
  expiryDate?: string
  credentialId?: string
  skills?: string[]
  logo: string
  pdfUrl?: string
}

// Memoize static components to prevent unnecessary re-renders
const MemoizedSectionTransition = memo(SectionTransition)
const MemoizedAnimatedHeading = memo(AnimatedHeading)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

  // Track scroll position for parallax effects with throttling
  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrollY(window.scrollY)
    }, 16) // ~60fps

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Certificates data
  const certificates: Certificate[] = [
    {
      name: "Digital Out-of-Home Certification Course",
      organization: "StackAdapt",
      issuedDate: "Jan 2025",
      credentialId: "tzh6e53cn7ih",
      skills: ["Programmatic Advertising", "Programmatic Media Buying", "DOOH"],
      logo: "/stackadapt-logo.png",
    },
    {
      name: "In-Game Channel Certification",
      organization: "StackAdapt",
      issuedDate: "Jan 2025",
      credentialId: "5rq3crtofyuq",
      skills: ["Programmatic Advertising", "Programmatic Media Buying"],
      logo: "/stackadapt-logo.png",
    },
    {
      name: "Data Driven Planning",
      organization: "The Trade Desk",
      issuedDate: "Nov 2024",
      expiryDate: "Nov 2026",
      skills: ["Media Planning", "Programmatic Media Buying"],
      logo: "/the-trade-desk-logo.png",
    },
    {
      name: "Fundamentals and Applications of Attention",
      organization: "Adelaide",
      issuedDate: "Oct 2024",
      credentialId: "78ZOGS2HNA",
      skills: ["Programmatic Media Buying"],
      logo: "/adelaide-logo.png",
    },
    {
      name: "The Role of Attention Metrics in a Privacy-First World",
      organization: "Adelaide",
      issuedDate: "Oct 2024",
      credentialId: "Tf9MkRvhNA",
      skills: ["Programmatic Media Buying", "Programmatic Advertising"],
      logo: "/adelaide-logo.png",
    },
    {
      name: "Advanced TV for Advertisers",
      organization: "Magnite",
      issuedDate: "Aug 2024",
      credentialId: "225979876",
      skills: ["Programmatic Media Buying"],
      logo: "/magnite-logo.png",
    },
    {
      name: "Contextual 101",
      organization: "Seedtag",
      issuedDate: "Aug 2024",
      credentialId: "bf0JbU9tfw",
      skills: ["Programmatic Media Buying", "Programmatic Advertising"],
      logo: "/seedtag-logo.png",
    },
    {
      name: "Marketing & Brand Strategy",
      organization: "CIM | The Chartered Institute of Marketing",
      issuedDate: "Jan 2024",
      pdfUrl: "/Marketing & Brand Strategy CIM.pdf",
      logo: "/cim-logo.png",
    },
    // Second batch of certificates
    {
      name: "Advance Branding",
      organization: "LinkedIn",
      issuedDate: "Dec 2023",
      logo: "/linkedin-logo.png",
    },
    {
      name: "Data Strategy",
      organization: "LinkedIn",
      issuedDate: "Jul 2023",
      logo: "/linkedin-logo.png",
    },
    {
      name: "Digital Audio Foundations",
      organization: "Spotify",
      issuedDate: "May 2023",
      credentialId: "258657634",
      skills: ["Audio advertising"],
      logo: "/spotify-logo.png",
    },
    {
      name: "Intro to Ad Studio",
      organization: "Spotify",
      issuedDate: "May 2023",
      credentialId: "258658411",
      skills: ["Audio advertising"],
      logo: "/spotify-logo.png",
    },
    {
      name: "LinkedIn Marketing Fundamentals Certified",
      organization: "LinkedIn",
      issuedDate: "Feb 2023",
      credentialId: "mdd8eavrbz3g",
      skills: ["Advertising", "Lead Generation"],
      logo: "/linkedin-logo.png",
    },
    {
      name: "Google Ads Display Certification",
      organization: "Google",
      issuedDate: "Jan 2023",
      credentialId: "139814774",
      skills: ["Brand Awareness", "Pay Per Click (PPC)"],
      logo: "/google-logo.png",
    },
    {
      name: "Proofpoint Certified Phishing Specialist",
      organization: "Proofpoint",
      issuedDate: "Jan 2023",
      skills: ["Email Marketing"],
      logo: "/proofpoint-logo.png",
    },
    // Third batch of certificates
    {
      name: "Search Ads 360 Certification Exam",
      organization: "Google",
      issuedDate: "Jan 2023",
      credentialId: "138551587",
      skills: ["Brand Awareness", "Pay Per Click (PPC)"],
      logo: "/google-logo.png",
    },
    {
      name: "Waze Ads Fundamentals",
      organization: "Waze",
      issuedDate: "Jan 2023",
      credentialId: "138350039",
      skills: ["Brand Awareness", "Pay Per Click (PPC)"],
      logo: "/waze-logo.png",
    },
    {
      name: "ANA Marketing Growth Agenda",
      organization: "Cannes Lions International Festival of Creativity",
      issuedDate: "Mar 2022",
      skills: [
        "Online Advertising",
        "Marketing Strategy",
        "Online Marketing",
        "Content Strategy",
        "Management",
        "Marketing Communications",
        "Programmatic Media Buying",
        "Advertising",
        "Brand Awareness",
        "Paid Media Advertising",
        "Digital Marketing",
        "Google Analytics",
        "Media Buying",
        "Research",
        "Content Marketing",
        "Growth Strategies",
        "Performance Marketing",
        "Market Research",
        "Social Media Marketing",
        "Google Ads",
        "Data Analysis",
      ],
      logo: "/cannes-lions-logo.png",
    },
    {
      name: "Tiktok Academy Pro",
      organization: "TikTok For Business MEA",
      issuedDate: "Feb 2022",
      skills: [
        "Online Advertising",
        "Online Marketing",
        "Content Strategy",
        "Advertising",
        "Brand Awareness",
        "Digital Marketing",
        "Pay Per Click (PPC)",
        "Social Media Marketing",
      ],
      logo: "/tiktok-logo.png",
    },
    {
      name: "Email Marketing",
      organization: "HubSpot",
      issuedDate: "Jan 2022",
      credentialId: "aed285f7ae194db0a5f8416162e5671c",
      skills: [
        "Online Marketing",
        "Content Strategy",
        "Email Marketing",
        "Advertising",
        "Brand Awareness",
        "Digital Marketing",
        "Content Marketing",
      ],
      logo: "/hubspot-logo.png",
    },
    {
      name: "SEO",
      organization: "HubSpot",
      issuedDate: "Jan 2022",
      credentialId: "fddb6c654ad244b4bf94cc108f9f36aa",
      skills: [
        "Online Advertising",
        "Online Marketing",
        "Content Strategy",
        "Brand Awareness",
        "Digital Marketing",
        "Content Marketing",
        "Search Engine Optimization (SEO)",
      ],
      logo: "/hubspot-logo.png",
    },
    {
      name: "Google Tag Manager Fundamentals",
      organization: "Google",
      issuedDate: "Dec 2021",
      skills: [
        "Online Marketing",
        "Digital Marketing",
        "Google Analytics",
        "Search Engine Optimization (SEO)",
        "Data Analysis",
      ],
      logo: "/google-logo.png",
    },
  ]

  // Featured projects data
  const featuredProjects = [
    {
      title: "3K Learning Academy",
      description: "E-learning platform with interactive courses and student management system",
      image: "/e-learning-dashboard.png",
      tags: ["Web Development", "UI/UX", "E-Learning"],
      slug: "3k-learning-academy",
    },
    {
      title: "The DigitalWit Media",
      description: "Digital marketing campaigns increasing engagement by 45%",
      image: "/digital-marketing-dashboard.png",
      tags: ["Digital Marketing", "Social Media", "Analytics"],
      slug: "digitalwit-media",
    },
    {
      title: "Chandrika Kumar - Tarot",
      description: "Professional website with online booking and payment integration",
      image: "/mystical-tarot-website.png",
      tags: ["Website", "Payment Integration", "Booking System"],
      slug: "chandrika-kumar-tarot",
    },
  ]

  // Memoize the certificate selection handler
  const handleCertificateSelect = useCallback((cert: Certificate) => {
    setSelectedCertificate(cert)
  }, [])

  // Memoize the certificate close handler
  const handleCertificateClose = useCallback(() => {
    setSelectedCertificate(null)
  }, [])

  return (
    <>
      <OrganizationJsonLd
        name="Your Name"
        url={process.env.NEXT_PUBLIC_BASE_URL || "https://yourwebsite.com"}
        logo={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`}
        description="Digital marketing expert specializing in programmatic advertising, SEO, and content strategy."
        sameAs={[
          "https://twitter.com/yourhandle",
          "https://linkedin.com/in/yourprofile",
          "https://instagram.com/yourhandle",
        ]}
      />

      <div ref={containerRef} className="min-h-screen">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="z-10 text-center"
            >
              {/* Add profile image */}

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4 block font-light"
              >
                Performance & Programmatic Manager
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="signature-name mb-6"
              >
                Harshit Dabhi
                <span className="signature-line"></span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl text-white/70 mb-8 font-light"
              >
                Digital Marketing Professional & Strategist
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

        {/* About Section with Parallax */}
        <MemoizedSectionTransition className="min-h-screen flex items-center py-20 px-4 md:px-10">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <MemoizedAnimatedHeading
                  text="About Me"
                  className="text-4xl md:text-5xl font-light mb-8 text-gradient"
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="space-y-6 text-white/70"
                >
                  <p>
                    I'm a Performance & Programmatic Manager with over 8 years of experience in digital marketing and
                    media buying. My expertise spans across programmatic advertising, performance marketing, and
                    strategic campaign management for global brands.
                  </p>
                  <p>
                    Throughout my career, I've successfully managed campaigns across MENA, Asia, Russia, Americas, and
                    Europe, collaborating with major DSPs like DV360, The Trade Desk, Amazon, and more. I'm passionate
                    about data-driven strategies that deliver measurable results and exceptional ROI for clients across
                    diverse industries.
                  </p>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                    <Link href="/resume">
                      <button className="px-8 py-3 rounded-full glass-panel text-white hover-glow-pink transition-all duration-300 flex items-center gap-2 mt-4">
                        View Resume
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{
                  transform: `translateY(${scrollY * 0.1}px)`, // Use transform instead of y for better performance
                }}
                className="space-y-6"
              >
                {/* Professional Journey */}
                <div className="relative w-full glass-panel p-6 rounded-lg overflow-hidden">
                  <h3 className="text-2xl font-light text-white mb-4">Professional Journey</h3>
                  <div className="space-y-4 text-white/70">
                    <div>
                      <h4 className="font-medium">Performance & Programmatic Manager</h4>
                      <p className="text-sm">Media Agency Group • 2024 - Present</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Performance Marketing Manager</h4>
                      <p className="text-sm">Vazir Group • 2023 - 2024</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Digital & Marketing Manager</h4>
                      <p className="text-sm">UNO CAPITAL • 2022 - 2023</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Founder</h4>
                      <p className="text-sm">The DigitalWit • 2016 - 2021</p>
                    </div>
                  </div>
                </div>

                {/* Professional Image */}
                <motion.div
                  className="relative w-full h-[250px] md:h-[220px] glass-panel rounded-lg overflow-hidden"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Professional Image"
                    fill
                    className="object-cover opacity-70 mix-blend-luminosity"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-xl font-light text-white mb-1">Global Experience</h3>
                    <p className="text-sm text-white/70">
                      Working with brands across MENA, Asia, Russia, Americas, and Europe
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </MemoizedSectionTransition>

        {/* Featured Projects Section */}
        <MemoizedSectionTransition className="py-20 px-4 md:px-10">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-12">
              <MemoizedAnimatedHeading
                text="Featured Projects"
                className="text-3xl md:text-4xl font-light text-gradient"
              />
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
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
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
                    <Link href={`/case-study/${project.slug}`}>
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
        </MemoizedSectionTransition>

        {/* Expertise Section with Floating Cards */}
        <MemoizedSectionTransition className="py-20 px-4 md:px-10">
          <div className="container mx-auto max-w-6xl">
            <MemoizedAnimatedHeading
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
        </MemoizedSectionTransition>

        {/* Professional Journey Section */}
        <MemoizedSectionTransition className="py-20 px-4 md:px-10">
          <div className="container mx-auto max-w-6xl">
            <MemoizedAnimatedHeading
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
        </MemoizedSectionTransition>

        {/* Latest Blog Posts */}
        <MemoizedSectionTransition className="py-20 px-4 md:px-10">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-12">
              <MemoizedAnimatedHeading
                text="Latest Insights"
                className="text-3xl md:text-4xl font-light text-gradient"
              />
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
                  slug: "future-programmatic-advertising-2024",
                },
                {
                  title: "Maximizing ROI with Omnichannel Media Buying",
                  excerpt:
                    "Learn how to create cohesive campaigns across multiple channels to maximize your marketing ROI.",
                  date: "March 15, 2024",
                  category: "Media Buying",
                  slug: "maximizing-roi-omnichannel-media-buying",
                },
                {
                  title: "Data-Driven Decision Making in Digital Marketing",
                  excerpt:
                    "Discover how to leverage analytics tools to make informed marketing decisions that drive results.",
                  date: "February 28, 2024",
                  category: "Analytics",
                  slug: "data-driven-decision-making-digital-marketing",
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
                    <Link href={`/blog/${post.slug}`}>
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
        </MemoizedSectionTransition>

        {/* Profile Image Section */}
        <MemoizedSectionTransition className="py-20 px-4 md:px-10">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              className="profile-image-container mx-auto mb-10"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Harshit Dabhi"
                fill
                className="transition-transform duration-500 hover:scale-110"
              />
            </motion.div>

            <MemoizedAnimatedHeading
              text="The Face Behind The Strategy"
              className="text-3xl md:text-4xl font-light mb-6 text-gradient"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 mb-6 max-w-2xl mx-auto"
            >
              A dedicated digital marketing professional with a passion for creating data-driven strategies that deliver
              exceptional results for brands around the world.
            </motion.p>
          </div>
        </MemoizedSectionTransition>

        {/* Certificate Carousel Section */}
        <MemoizedSectionTransition className="py-20 px-4 md:px-10 bg-black/30">
          <div className="container mx-auto max-w-6xl">
            {/* Carousel Container - Now placed above the text */}
            <div className="relative mb-16">
              {/* Carousel - Removed the glass-panel wrapper */}
              <div className="overflow-hidden">
                <div
                  className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {certificates.map((cert, index) => (
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
                        <Image
                          src={cert.logo || "/placeholder.svg?height=64&width=64&query=logo"}
                          alt={cert.name}
                          fill
                          className="object-contain"
                        />
                      </motion.div>
                      <div className="flex-1 relative z-10">
                        <p className="text-lg font-medium text-white">{cert.name}</p>
                        <p className="text-sm text-white/50">{cert.organization}</p>
                        <button
                          onClick={() => handleCertificateSelect(cert)}
                          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors mt-2 flex items-center"
                        >
                          Show credential <ExternalLink className="ml-1 h-3 w-3" />
                        </button>
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
            <MemoizedAnimatedHeading
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
        </MemoizedSectionTransition>

        {/* Certificate Lightbox */}
        <AnimatePresence>
          {selectedCertificate && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCertificateClose}
            >
              <motion.div
                className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Certificate lightbox content (unchanged) */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      <div className="relative w-16 h-16 mr-4 bg-white/10 rounded-md p-2">
                        <Image
                          src={selectedCertificate.logo || "/placeholder.svg?height=64&width=64&query=logo"}
                          alt={selectedCertificate.organization}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedCertificate.name}</h3>
                        <p className="text-gray-300">{selectedCertificate.organization}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCertificateClose}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-lg mb-6 border border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Issued Date</p>
                        <p className="font-medium text-white">{selectedCertificate.issuedDate}</p>
                      </div>
                      {selectedCertificate.expiryDate && (
                        <div>
                          <p className="text-sm text-gray-400">Expiry Date</p>
                          <p className="font-medium text-white">{selectedCertificate.expiryDate}</p>
                        </div>
                      )}
                      {selectedCertificate.credentialId && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-400">Credential ID</p>
                          <p className="font-medium text-white">{selectedCertificate.credentialId}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedCertificate.skills && selectedCertificate.skills.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-medium mb-2 flex items-center text-white">
                        <Award className="h-5 w-5 mr-2 text-blue-400" />
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCertificate.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full border border-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCertificate.pdfUrl && (
                    <div className="mt-6">
                      <a
                        href={selectedCertificate.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Certificate PDF <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact CTA Section */}
        <MemoizedSectionTransition className="py-20 px-4 md:px-10">
          <div className="container mx-auto max-w-4xl text-center">
            <MemoizedAnimatedHeading
              text="Let's Work Together"
              className="text-4xl md:text-5xl font-light mb-6 text-gradient"
            />

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
                  <Calendar className="h-5 w5" />
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
        </MemoizedSectionTransition>
      </div>
    </>
  )
}
