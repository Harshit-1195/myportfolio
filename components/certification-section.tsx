"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import AnimatedText from "@/components/animated-text"

export default function CertificationSection() {
  const certifications = [
    {
      name: "Google Ads",
      logo: "/placeholder.svg?height=80&width=80",
      issuer: "Google",
      year: "2023",
    },
    {
      name: "Meta Blueprint",
      logo: "/placeholder.svg?height=80&width=80",
      issuer: "Meta",
      year: "2023",
    },
    {
      name: "Google Analytics",
      logo: "/placeholder.svg?height=80&width=80",
      issuer: "Google",
      year: "2022",
    },
    {
      name: "Trade Desk Edge Academy",
      logo: "/placeholder.svg?height=80&width=80",
      issuer: "The Trade Desk",
      year: "2023",
    },
    {
      name: "Amazon Advertising",
      logo: "/placeholder.svg?height=80&width=80",
      issuer: "Amazon",
      year: "2022",
    },
    {
      name: "HubSpot Marketing",
      logo: "/placeholder.svg?height=80&width=80",
      issuer: "HubSpot",
      year: "2021",
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
    <section className="py-20 px-4 md:px-10 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <AnimatedText
            text="Certifications"
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-4 text-black"
            speed={80}
          />
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Professional certifications that validate my expertise in digital marketing, programmatic advertising, and
            media buying.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden hover-glow-yellow"
              variants={item}
              whileHover={{
                y: -10,
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                transition: { type: "spring", stiffness: 400, damping: 10 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/5 z-0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="relative w-20 h-20 mb-4 z-10"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Image src={cert.logo || "/placeholder.svg"} alt={cert.name} fill className="object-contain" />
              </motion.div>
              <div className="relative z-10">
                <h3 className="text-base font-medium text-black">{cert.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {cert.issuer} • {cert.year}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
