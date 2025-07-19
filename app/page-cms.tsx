"use client"

import { useRef, useEffect, useState, useCallback, memo } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowDown } from "lucide-react"
import SectionTransition from "@/components/section-transition"
import AnimatedHeading from "@/components/animated-heading" 
import { Button } from "@/components/ui/button"
import { Calendar, Mail, Phone } from "lucide-react"
import { throttle } from "@/lib/utils"
import { OrganizationJsonLd } from "@/components/json-ld"
// import {
//   getHeroContent,
//   getStatsContent,
//   getAboutContent,
//   getExpertiseContent,
//   getContactCTAContent,
// } from "@/lib/content-service"

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

export default function CMSHomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

  // CMS Content State
  const [heroContent, setHeroContent] = useState<any>(null)
  const [statsContent, setStatsContent] = useState<any>(null)
  const [aboutContent, setAboutContent] = useState<any>(null)
  const [expertiseContent, setExpertiseContent] = useState<any>(null)
  const [contactCTAContent, setContactCTAContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Load CMS content
  // useEffect(() => {
  //   const loadContent = async () => {
  //     try {
  //       const [hero, stats, about, expertise, contactCTA] = await Promise.all([
  //         getHeroContent(),
  //         getStatsContent(),
  //         getAboutContent(),
  //         getExpertiseContent(),
  //         getContactCTAContent(),
  //       ])

  //       setHeroContent(hero?.content)
  //       setStatsContent(stats?.content)
  //       setAboutContent(about?.content)
  //       setExpertiseContent(expertise?.content)
  //       setContactCTAContent(contactCTA?.content)
  //     } catch (error) {
  //       console.error("Error loading CMS content:", error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   loadContent()
  // }, [])

  // Track scroll position for parallax effects with throttling
  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrollY(window.scrollY)
    }, 16) // ~60fps

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Certificates data (this could also be moved to CMS)
  const certificates: Certificate[] = [
    {
      name: "Digital Out-of-Home Certification Course",
      organization: "StackAdapt",
      issuedDate: "Jan 2025",
      credentialId: "tzh6e53cn7ih",
      skills: ["Programmatic Advertising", "Programmatic Media Buying", "DOOH"],
      logo: "/stackadapt-logo.png",
    },
    // ... rest of certificates
  ]

  // Featured projects data (this should pull from CMS projects)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

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
        {/* Hero Section - CMS Driven */}
        {heroContent && (
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
                  className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4 block font-light"
                >
                  {heroContent.subtitle}
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="signature-name mb-6"
                >
                  {heroContent.title}
                  <span className="signature-line"></span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-xl md:text-2xl text-white/70 mb-8 font-light"
                >
                  {heroContent.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Link href={heroContent.cta_link || "/work"}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 rounded-full glass-panel text-white hover-glow transition-all duration-300 flex items-center gap-2"
                    >
                      {heroContent.cta_text || "View My Work"}
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Stats Section - CMS Driven */}
            {statsContent && (
              <motion.div
                className="container mx-auto max-w-4xl mt-20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {statsContent.stats?.map((stat: any, index: number) => (
                    <div key={index} className="glass-panel p-4 rounded-lg">
                      <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                      <p className="text-sm text-white/60">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

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
        )}

        {/* About Section - CMS Driven */}
        {aboutContent && (
          <MemoizedSectionTransition className="min-h-screen flex items-center py-20 px-4 md:px-10">
            <div className="container mx-auto max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <MemoizedAnimatedHeading
                    text={aboutContent.title || "About Me"}
                    className="text-4xl md:text-5xl font-light mb-8 text-gradient"
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="space-y-6 text-white/70"
                  >
                    {aboutContent.content?.split("\n\n").map((paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    ))}

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                      <Link href={aboutContent.cta_link || "/resume"}>
                        <button className="px-8 py-3 rounded-full glass-panel text-white hover-glow-pink transition-all duration-300 flex items-center gap-2 mt-4">
                          {aboutContent.cta_text || "View Resume"}
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
                    transform: `translateY(${scrollY * 0.1}px)`,
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
        )}

        {/* Expertise Section - CMS Driven */}
        {expertiseContent && (
          <MemoizedSectionTransition className="py-20 px-4 md:px-10">
            <div className="container mx-auto max-w-6xl">
              <MemoizedAnimatedHeading
                text={expertiseContent.title || "My Expertise"}
                className="text-4xl md:text-5xl font-light mb-16 text-gradient text-center"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expertiseContent.items?.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    animate={{
                      y: [0, -10, 0],
                      transition: {
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: index * 0.5,
                      },
                    }}
                    className={`glass-panel p-8 rounded-lg ${item.color || "hover-glow"} transition-all duration-300`}
                  >
                    <h3 className="text-xl font-medium mb-4 text-white">{item.title}</h3>
                    <p className="text-white/70">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </MemoizedSectionTransition>
        )}

        {/* Contact CTA Section - CMS Driven */}
        {contactCTAContent && (
          <MemoizedSectionTransition className="py-20 px-4 md:px-10">
            <div className="container mx-auto max-w-4xl text-center">
              <MemoizedAnimatedHeading
                text={contactCTAContent.title || "Let's Work Together"}
                className="text-4xl md:text-5xl font-light mb-6 text-gradient"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/70 mb-10 max-w-2xl mx-auto"
              >
                {contactCTAContent.description}
              </motion.p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {contactCTAContent.buttons?.map((button: any, index: number) => {
                  const IconComponent =
                    button.icon === "phone"
                      ? Phone
                      : button.icon === "calendar"
                        ? Calendar
                        : button.icon === "mail"
                          ? Mail
                          : null

                  return (
                    <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => {
                          if (button.link.startsWith("tel:") || button.link.startsWith("mailto:")) {
                            window.location.href = button.link
                          } else {
                            window.open(button.link, "_blank")
                          }
                        }}
                        className="px-8 py-6 rounded-lg glass-panel text-white hover-glow transition-all duration-300 flex items-center gap-3"
                      >
                        {IconComponent && <IconComponent className="h-5 w-5" />}
                        {button.text}
                      </Button>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </MemoizedSectionTransition>
        )}

        {/* Rest of the sections remain the same for now */}
        {/* Featured Projects, Professional Journey, Latest Blog Posts, Profile Image, Certifications */}
        {/* These can be converted to CMS-driven content in the next iteration */}
      </div>
    </>
  )
}
