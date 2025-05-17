"use client"

import { BarChart3, LineChart, Users, Mail, Search, TrendingUp, Megaphone, Smartphone } from "lucide-react"
import { motion } from "framer-motion"
import AnimatedText from "@/components/animated-text"
import AnimatedCounter from "@/components/animated-counter"
import AnimatedSkillBar from "@/components/animated-skill-bar"

export default function ExpertiseSection() {
  const expertiseAreas = [
    {
      title: "Programmatic Advertising",
      description: "Managing global programmatic campaigns across major DSPs like DV360, TTD, and Amazon.",
      icon: <LineChart className="w-10 h-10" />,
      percentage: 95,
    },
    {
      title: "Performance Marketing",
      description: "Developing data-driven strategies to maximize ROI and campaign performance.",
      icon: <BarChart3 className="w-10 h-10" />,
      percentage: 92,
    },
    {
      title: "Media Planning & Buying",
      description: "Strategic media planning and buying across multiple channels and regions.",
      icon: <Users className="w-10 h-10" />,
      percentage: 90,
    },
    {
      title: "PPC & Paid Media",
      description: "Managing and optimizing PPC campaigns with high CTR and conversion rates.",
      icon: <Mail className="w-10 h-10" />,
      percentage: 94,
    },
    {
      title: "Analytics & Reporting",
      description: "Leveraging GA4, Tableau, and Salesforce for actionable insights and reporting.",
      icon: <Search className="w-10 h-10" />,
      percentage: 88,
    },
    {
      title: "Budget Management",
      description: "Efficiently managing large advertising budgets to maximize performance and ROI.",
      icon: <TrendingUp className="w-10 h-10" />,
      percentage: 93,
    },
    {
      title: "Audience Targeting",
      description: "Precise audience segmentation and targeting for optimal campaign results.",
      icon: <Megaphone className="w-10 h-10" />,
      percentage: 91,
    },
    {
      title: "Campaign Optimization",
      description: "Continuous testing and optimization to improve campaign performance.",
      icon: <Smartphone className="w-10 h-10" />,
      percentage: 89,
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
    <section className="py-20 px-4 md:px-10 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <AnimatedText
            text="My Expertise"
            tag="h2"
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
            speed={80}
          />
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            With over 8 years of experience in digital marketing and media buying, I've developed expertise in various
            areas that help businesses maximize their online presence and achieve exceptional ROI.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {expertiseAreas.map((area, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 p-6 rounded-lg hover-lift hover-glow relative overflow-hidden"
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
                className="mb-4 text-black relative z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {area.icon}
              </motion.div>
              <div className="relative z-10">
                <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
                <p className="text-muted-foreground mb-4">{area.description}</p>
                <AnimatedSkillBar skill={area.title} percentage={area.percentage} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gray-50 p-6 rounded-lg">
            <AnimatedCounter end={600} suffix="%" className="text-3xl md:text-4xl font-bold mb-2" />
            <p className="text-sm text-muted-foreground">Average ROI</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <AnimatedCounter end={50} suffix="+" className="text-3xl md:text-4xl font-bold mb-2" />
            <p className="text-sm text-muted-foreground">Global Clients</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <AnimatedCounter end={8} suffix="+" className="text-3xl md:text-4xl font-bold mb-2" />
            <p className="text-sm text-muted-foreground">Years Experience</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <AnimatedCounter end={200} suffix="+" className="text-3xl md:text-4xl font-bold mb-2" />
            <p className="text-sm text-muted-foreground">Campaigns Managed</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
