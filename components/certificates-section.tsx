"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { X, ExternalLink, Award } from "lucide-react"
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

export default function CertificatesSection() {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

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
      logo: "/placeholder.svg?height=60&width=60&query=Magnite logo",
    },
    {
      name: "Contextual 101",
      organization: "Seedtag",
      issuedDate: "Aug 2024",
      credentialId: "bf0JbU9tfw",
      skills: ["Programmatic Media Buying", "Programmatic Advertising"],
      logo: "/placeholder.svg?height=60&width=60&query=Seedtag logo",
    },
    {
      name: "Marketing & Brand Strategy",
      organization: "CIM | The Chartered Institute of Marketing",
      issuedDate: "Jan 2024",
      pdfUrl: "/Marketing & Brand Strategy CIM.pdf",
      logo: "/placeholder.svg?height=60&width=60&query=CIM logo",
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
    <section className="py-20 px-4 md:px-10 bg-gray-50 overflow-hidden">
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

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {certificates.map((cert, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm flex flex-col hover-lift"
              variants={item}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start mb-4">
                <div className="relative w-12 h-12 mr-4 flex-shrink-0">
                  <Image
                    src={cert.logo || "/placeholder.svg"}
                    alt={cert.organization}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.organization}</p>
                </div>
              </div>

              <div className="mb-4 text-sm text-gray-600">
                <p>
                  Issued {cert.issuedDate}
                  {cert.expiryDate ? ` · Expires ${cert.expiryDate}` : ""}
                </p>
                {cert.credentialId && <p className="text-xs text-gray-500">Credential ID {cert.credentialId}</p>}
              </div>

              <button
                onClick={() => setSelectedCertificate(cert)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors mb-4 flex items-center"
              >
                Show credential <ExternalLink className="ml-1 h-3 w-3" />
              </button>

              {cert.skills && cert.skills.length > 0 && (
                <div className="mt-auto">
                  <p className="text-xs text-gray-500 mb-1">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.map((skill, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      {selectedCertificate && (
        <motion.div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
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
                  <div className="relative w-16 h-16 mr-4">
                    <Image
                      src={selectedCertificate.logo || "/placeholder.svg"}
                      alt={selectedCertificate.organization}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedCertificate.name}</h3>
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
                    <Award className="h-5 w-5 mr-2 text-blue-600" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCertificate.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
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
    </section>
  )
}
