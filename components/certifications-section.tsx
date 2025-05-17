"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Award, ChevronDown, ArrowRight } from "lucide-react"
import AnimatedText from "@/components/animated-text"

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

export default function CertificationsSection() {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [showAllCertificates, setShowAllCertificates] = useState(false)

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
    // Third batch of certificates (continued)
    {
      name: "Sport Event Management",
      organization: "International Olympic Committee – IOC",
      issuedDate: "Dec 2021",
      skills: ["Marketing Communications", "Team Management", "Advertising", "Problem Solving"],
      logo: "/olympic-rings.png",
    },
    {
      name: "Sports Media",
      organization: "International Olympic Committee – IOC",
      issuedDate: "Dec 2021",
      skills: [
        "Online Marketing",
        "Content Strategy",
        "Programmatic Media Buying",
        "Advertising",
        "Brand Awareness",
        "Digital Marketing",
        "Media Buying",
        "Content Marketing",
        "Social Media Marketing",
        "Communication",
        "Search Engine Optimization (SEO)",
      ],
      logo: "/olympic-rings.png",
    },
    {
      name: "Sports Psychology",
      organization: "International Olympic Committee – IOC",
      issuedDate: "Dec 2021",
      skills: [
        "Research",
        "Professional Communication",
        "Marketing Communications",
        "Communication",
        "Problem Solving",
        "Digital Marketing",
      ],
      logo: "/olympic-rings.png",
    },
    {
      name: "Google Analytics",
      organization: "Google",
      issuedDate: "Nov 2021",
      skills: [
        "Online Marketing",
        "Digital Marketing",
        "Google Analytics",
        "Research",
        "Market Research",
        "Data Analysis",
      ],
      logo: "/google-logo.png",
    },
    {
      name: "Google My Business",
      organization: "Google",
      issuedDate: "Nov 2021",
      credentialId: "97287368",
      skills: [
        "Marketing Communications",
        "Brand Awareness",
        "Digital Marketing",
        "Research",
        "Content Marketing",
        "Performance Marketing",
      ],
      logo: "/google-logo.png",
    },
    {
      name: "Creative Effectiveness",
      organization: "Cannes Lions International Festival of Creativity",
      issuedDate: "Sep 2021",
      skills: [
        "Content Strategy",
        "Marketing Communications",
        "Problem Solving",
        "Brand Awareness",
        "Digital Marketing",
        "Content Marketing",
        "Growth Strategies",
        "Performance Marketing",
        "Communication",
      ],
      logo: "/cannes-lions-logo.png",
    },
    {
      name: "Applied Behavioral Science",
      organization: "Ogilvy",
      issuedDate: "Aug 2021",
      skills: [
        "Content Strategy",
        "Team Management",
        "Digital Marketing",
        "Research",
        "Content Marketing",
        "Professional Communication",
        "Market Research",
        "Communication",
      ],
      logo: "/placeholder-qjxa2.png",
    },
    {
      name: "Copywriting",
      organization: "Cannes Lions International Festival of Creativity",
      issuedDate: "Aug 2021",
      skills: [],
      logo: "/cannes-lions-logo.png",
    },
    // Fourth batch of certificates
    {
      name: "Digital Marketing",
      organization: "Cannes Lions International Festival of Creativity",
      issuedDate: "Aug 2021",
      skills: [
        "Online Advertising",
        "Marketing Strategy",
        "Online Marketing",
        "Content Strategy",
        "Email Marketing",
        "Programmatic Media Buying",
        "Advertising",
        "Brand Awareness",
        "Paid Media Advertising",
        "Digital Marketing",
        "Media Buying",
        "Content Marketing",
        "Performance Marketing",
        "Social Media Marketing",
        "Google Ads",
        "Search Engine Optimization (SEO)",
      ],
      logo: "/cannes-lions-logo.png",
    },
    {
      name: "Marketing Strategy",
      organization: "WARC",
      issuedDate: "Aug 2021",
      skills: [
        "Online Advertising",
        "Marketing Strategy",
        "Online Marketing",
        "Content Strategy",
        "Marketing Communications",
        "Email Marketing",
        "Programmatic Media Buying",
        "Advertising",
        "Brand Awareness",
        "Paid Media Advertising",
        "Digital Marketing",
        "Research",
        "Content Marketing",
        "Growth Strategies",
        "Professional Communication",
        "Performance Marketing",
        "Market Research",
        "Social Media Marketing",
        "Google Ads",
      ],
      logo: "/warc-logo.png",
    },
    {
      name: "Diploma In Consumer Psychology",
      organization: "Alison",
      issuedDate: "Jul 2021",
      skills: [
        "Online Marketing",
        "Marketing Communications",
        "Problem Solving",
        "Digital Marketing",
        "Research",
        "Professional Communication",
        "Market Research",
        "Communication",
      ],
      logo: "/alison-logo.png",
    },
    {
      name: "Digital Marketing",
      organization: "Accenture",
      issuedDate: "Apr 2021",
      skills: [
        "Online Advertising",
        "Online Marketing",
        "Content Strategy",
        "Management",
        "Marketing Communications",
        "Email Marketing",
        "Programmatic Media Buying",
        "Digital Marketing",
        "Content Marketing",
        "Social Media Marketing",
        "Google Ads",
      ],
      logo: "/accenture-logo.png",
    },
    {
      name: "Digital skill- User Experience",
      organization: "Accenture",
      issuedDate: "Mar 2021",
      skills: [
        "Online Advertising",
        "Content Strategy",
        "Digital Marketing",
        "Content Marketing",
        "Social Media Marketing",
        "Google Ads",
        "Data Analysis",
      ],
      logo: "/accenture-logo.png",
    },
    {
      name: "Google Digital Unlocked",
      organization: "Google",
      issuedDate: "May 2018",
      skills: [
        "Online Advertising",
        "Content Strategy",
        "Paid Media Advertising",
        "Digital Marketing",
        "Social Media Marketing",
        "Google Ads",
        "Search Engine Optimization (SEO)",
      ],
      logo: "/google-logo.png",
    },
    {
      name: "StartUp India Learning Program",
      organization: "Invest India",
      issuedDate: "Jun 2017",
      credentialId: "10755131",
      skills: [
        "Marketing Strategy",
        "Management",
        "Team Management",
        "Problem Solving",
        "Research",
        "Content Marketing",
        "Professional Communication",
        "Leadership",
        "Business Decision Making",
      ],
      logo: "/invest-india-logo.png",
    },
    {
      name: "Amazon FBA Master plan",
      organization: "Udemy",
      issuedDate: "Apr 2017",
      credentialId: "UC-HU774CQ2",
      skills: ["Research"],
      logo: "/udemy-logo.png",
    },
    {
      name: "Digital Marketing Certification Course",
      organization: "The Marketing Nerdz",
      issuedDate: "Mar 2016",
      skills: [
        "Online Advertising",
        "Content Strategy",
        "Marketing Communications",
        "Email Marketing",
        "Programmatic Media Buying",
        "Digital Marketing",
        "Content Marketing",
        "Social Media Marketing",
        "Google Ads",
      ],
      logo: "/marketing-nerdz-logo.png",
    },
    {
      name: "Professional Etiquette",
      organization: "Saylor Academy",
      issuedDate: "Aug 2015",
      skills: [
        "Management",
        "Team Management",
        "Content Marketing",
        "Communication",
        "Leadership",
        "Business Decision Making",
      ],
      logo: "/saylor-academy-logo.png",
    },
    {
      name: "Resume writting",
      organization: "Saylor Academy",
      issuedDate: "Aug 2015",
      skills: ["Content Marketing"],
      logo: "/saylor-academy-logo.png",
    },
    {
      name: "Spreadsheets",
      organization: "Saylor Academy",
      issuedDate: "Aug 2015",
      skills: [],
      logo: "/saylor-academy-logo.png",
    },
    {
      name: "CIM ACIM Member",
      organization: "CIM | The Chartered Institute of Marketing",
      issuedDate: "Dec 2023",
      expiryDate: "Jan 2025",
      skills: [],
      logo: "/cim-logo.png",
    },
    {
      name: "Campaign Manager 360",
      organization: "Google",
      issuedDate: "Jan 2024",
      expiryDate: "Jan 2025",
      credentialId: "253520954",
      skills: [],
      logo: "/google-logo.png",
    },
    {
      name: "Display & Video 360 Certification Exam",
      organization: "Google",
      issuedDate: "Jan 2024",
      expiryDate: "Jan 2025",
      skills: [],
      logo: "/google-logo.png",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="certifications" className="py-20 px-4 md:px-10 bg-gray-50 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <AnimatedText
          text="Professional Certifications"
          tag="h2"
          className="text-3xl md:text-4xl font-bold mb-4 text-center text-gradient"
          speed={80}
        />

        <motion.p
          className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Professional certifications that validate my expertise and commitment to staying current with industry
          standards and best practices.
        </motion.p>

        {/* Display first 8 certificates with improved styling */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {certificates.slice(0, 8).map((cert, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md flex flex-col hover-lift overflow-hidden h-full border border-gray-100"
              variants={item}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-start mb-3">
                  <div className="relative w-10 h-10 mr-3 flex-shrink-0 bg-gray-100 rounded-md p-1.5">
                    <Image
                      src={cert.logo || "/placeholder.svg?height=40&width=40&query=logo"}
                      alt={cert.organization}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-medium line-clamp-1">{cert.name}</h3>
                    <p className="text-xs text-gray-600">{cert.organization}</p>
                  </div>
                </div>

                <div className="mb-2 text-xs text-gray-600">
                  <p>Issued {cert.issuedDate}</p>
                </div>

                <button
                  onClick={() => setSelectedCertificate(cert)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors mt-auto flex items-center"
                >
                  Show credential <ExternalLink className="ml-1 h-3 w-3" />
                </button>
              </div>

              {cert.skills && cert.skills.length > 0 && (
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.slice(0, 2).map((skill, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-700">
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 2 && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-700">
                        +{cert.skills.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-10 gap-4">
          <button
            onClick={() => setShowAllCertificates(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all transform hover:scale-105 text-sm"
          >
            View All ({certificates.length})
            <ChevronDown className="h-4 w-4" />
          </button>

          <Link
            href="/resume#certifications"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full transition-all transform hover:scale-105 hover:shadow-lg text-sm"
          >
            Show More on Resume
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Certificate Lightbox - Keep this part unchanged */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div className="relative w-16 h-16 mr-4 bg-gray-100 rounded-md p-2">
                      <Image
                        src={selectedCertificate.logo || "/placeholder.svg?height=64&width=64&query=logo"}
                        alt={selectedCertificate.organization}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedCertificate.name}</h3>
                      <p className="text-gray-600">{selectedCertificate.organization}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCertificate(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Issued Date</p>
                      <p className="font-medium">{selectedCertificate.issuedDate}</p>
                    </div>
                    {selectedCertificate.expiryDate && (
                      <div>
                        <p className="text-sm text-gray-500">Expiry Date</p>
                        <p className="font-medium">{selectedCertificate.expiryDate}</p>
                      </div>
                    )}
                    {selectedCertificate.credentialId && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Credential ID</p>
                        <p className="font-medium">{selectedCertificate.credentialId}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedCertificate.skills && selectedCertificate.skills.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-2 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-blue-500" />
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCertificate.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100"
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

      {/* All Certificates Lightbox - Keep this part unchanged */}
      <AnimatePresence>
        {showAllCertificates && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAllCertificates(false)}
          >
            <motion.div
              className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-4">
                  <h3 className="text-2xl font-bold">All Certifications ({certificates.length})</h3>
                  <button
                    onClick={() => setShowAllCertificates(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {certificates.map((cert, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start mb-3">
                        <div className="relative w-10 h-10 mr-3 flex-shrink-0 bg-gray-100 rounded-md p-1.5">
                          <Image
                            src={cert.logo || "/placeholder.svg?height=40&width=40&query=logo"}
                            alt={cert.organization}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="text-base font-medium">{cert.name}</h4>
                          <p className="text-xs text-gray-600">{cert.organization}</p>
                        </div>
                      </div>

                      <div className="mb-3 text-xs text-gray-600">
                        <p>
                          Issued {cert.issuedDate}
                          {cert.expiryDate ? ` · Expires ${cert.expiryDate}` : ""}
                        </p>
                        {cert.credentialId && (
                          <p className="text-xs text-gray-500">Credential ID {cert.credentialId}</p>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCertificate(cert)
                          setShowAllCertificates(false)
                        }}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors mb-3 flex items-center"
                      >
                        Show credential <ExternalLink className="ml-1 h-3 w-3" />
                      </button>

                      {cert.skills && cert.skills.length > 0 && (
                        <div className="mt-auto">
                          <p className="text-xs text-gray-500 mb-1">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {cert.skills.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-700">
                                {skill}
                              </span>
                            ))}
                            {cert.skills.length > 3 && (
                              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-700">
                                +{cert.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
