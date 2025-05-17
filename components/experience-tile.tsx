"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin } from "lucide-react"

interface ExperienceTileProps {
  title: string
  company: string
  period: string
  location: string
  description: string[]
  index?: number
}

export default function ExperienceTile({
  title,
  company,
  period,
  location,
  description,
  index = 0,
}: ExperienceTileProps) {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-black">{title}</h3>
        <p className="text-gray-700 font-medium">{company}</p>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{period}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
        {description.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
