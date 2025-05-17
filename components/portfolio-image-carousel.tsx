"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface PortfolioImage {
  id: number
  src: string
  alt: string
  caption: string
}

interface PortfolioImageCarouselProps {
  images: PortfolioImage[]
}

export function PortfolioImageCarousel({ images }: PortfolioImageCarouselProps) {
  const [activeImage, setActiveImage] = useState(0)

  const navigateCarousel = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    } else {
      setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          className="glass-panel rounded-lg overflow-hidden hover-lift hover-glow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <div className="relative h-48 w-full">
            <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
          </div>
          <div className="p-4">
            <p className="text-white font-medium">{image.caption}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
