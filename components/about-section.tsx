"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import AnimatedText from "@/components/animated-text"

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section ref={sectionRef} className="py-20 px-4 md:px-10 bg-gray-50 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-black/5 -z-10" style={{ y, opacity }} />
      <motion.div
        className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-black/5 -z-10"
        style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]), opacity }}
      />

      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row gap-16">
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

            <motion.p
              className="text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Throughout my career, I've successfully managed campaigns across MENA, Asia, Russia, Americas, and Europe,
              collaborating with major DSPs like DV360, The Trade Desk, Amazon, and more. I'm passionate about
              data-driven strategies that deliver measurable results and exceptional ROI for clients across diverse
              industries.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-white/5 z-0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <Button variant="outline" className="gap-2 relative overflow-hidden group hover-glow">
                  <motion.span
                    className="w-4 h-4 relative z-10"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FileDown className="w-4 h-4" />
                  </motion.span>
                  <span className="relative z-10">Download Resume</span>
                  <span className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out z-0" />
                  <span className="absolute inset-0 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex items-center justify-center z-0" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-white/5 z-0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <Link href="/work">
                  <Button className="bg-black text-white hover:bg-black/80 w-full sm:w-auto relative overflow-hidden group hover-glow-pink">
                    <span className="relative z-10">View My Work</span>
                    <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out z-0" />
                    <span className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300 ease-out delay-100 z-0" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-6">Professional Journey</h3>
            <div className="space-y-8">
              <motion.div
                className="border-l-2 border-black pl-6 pb-8 relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="absolute w-4 h-4 bg-black rounded-full -left-[9px] top-0"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
                />
                <h4 className="font-medium text-lg">Performance & Programmatic Manager</h4>
                <p className="text-sm text-muted-foreground mb-2">Media Agency Group • 2024 - Present</p>
                <p className="text-muted-foreground">
                  Managing global programmatic campaigns for major accounts including NHS, Ariana Grande Perfumes, and
                  Kuwait Airways. Generated an average 6:1 ROI and was recognized as the best performer for consecutive
                  quarters.
                </p>
              </motion.div>

              <motion.div
                className="border-l-2 border-black pl-6 pb-8 relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  className="absolute w-4 h-4 bg-black rounded-full -left-[9px] top-0"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4, type: "spring" }}
                />
                <h4 className="font-medium text-lg">Performance Marketing Manager</h4>
                <p className="text-sm text-muted-foreground mb-2">Vazir Group • 2023 - 2024</p>
                <p className="text-muted-foreground">
                  Led high-performing media buying campaigns resulting in a 126% increase in website traffic and a 1173%
                  boost in social media engagement. Achieved an 86% increase in CTR and a 62.7% rise in conversion
                  rates.
                </p>
              </motion.div>

              <motion.div
                className="border-l-2 border-black pl-6 relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.div
                  className="absolute w-4 h-4 bg-black rounded-full -left-[9px] top-0"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6, type: "spring" }}
                />
                <h4 className="font-medium text-lg">Digital & Marketing Manager</h4>
                <p className="text-sm text-muted-foreground mb-2">UNO CAPITAL • 2022 - 2023</p>
                <p className="text-muted-foreground">
                  Achieved a 1.68% conversion rate, the highest in the industry, through data-driven digital strategies.
                  Enhanced lead quality by 34.8% within six months and drove a 77.8% increase in lead generation
                  year-over-year.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
