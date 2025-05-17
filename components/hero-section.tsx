"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import AnimatedText from "@/components/animated-text"
import { Calendar } from "lucide-react"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="min-h-screen pt-24 pb-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-4 md:px-10 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent z-10 rounded-full" />
        <Image src="/placeholder.svg" alt="Harshit Dabhi" fill className="object-cover" priority />

        <motion.div
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute inset-0 border-2 border-black/10 rounded-full z-20"
        />
      </motion.div>

      <div className="max-w-xl">
        <AnimatedText text="HELLO" tag="h1" className="text-7xl md:text-8xl font-bold mb-4" speed={150} />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-2xl md:text-3xl font-semibold mb-4"
        >
          I'm Harshit Dabhi
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="text-muted-foreground mb-6"
        >
          A Performance & Programmatic Manager with over 8 years of experience in digital marketing and media buying. I
          specialize in managing global programmatic campaigns, collaborating with major DSPs, and achieving exceptional
          ROI across diverse industries. Based in Dubai, I've worked with brands like NHS, Ariana Grande Perfumes,
          Kuwait Airways, and many more to deliver data-driven strategies that maximize performance and engagement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            className="bg-black text-white hover:bg-black/80 relative overflow-hidden group flex items-center gap-2"
            onClick={() => window.open("https://calendly.com/harshitdabhi/30min", "_blank")}
          >
            <Calendar className="h-4 w-4" />
            <span className="relative z-10">Schedule 1-1 Consultation</span>
            <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out z-0" />
            <span className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300 ease-out delay-100 z-0" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
