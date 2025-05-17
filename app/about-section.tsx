"use client"

import { motion } from "framer-motion"
import AnimatedText from "@/components/animated-text"
import Image from "next/image"

const AboutSection = () => {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8">
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <AnimatedText
            text="About Me"
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-6 text-gradient"
            speed={80}
          />

          {/* Add profile image for mobile view */}
          <motion.div
            className="profile-image-container mb-8 md:hidden"
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

          <motion.p
            className="text-muted-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            I'm a Performance & Programmatic Manager with over 8 years of experience in digital marketing and media
            buying. My expertise spans across programmatic advertising, performance marketing, and strategic campaign
            management for global brands.
          </motion.p>

          {/* Rest of the content remains the same */}
        </motion.div>

        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/placeholder.svg?height=600&width=600"
            alt="Harshit Dabhi"
            width={600}
            height={600}
            className="rounded-lg shadow-md hidden md:block"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
