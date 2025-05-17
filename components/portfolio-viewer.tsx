"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PortfolioImage {
  id: number
  image: string
  caption: string
  description?: string
  category?: string
}

interface PortfolioViewerProps {
  images: PortfolioImage[]
  initialIndex?: number
}

export function PortfolioViewer({ images, initialIndex = 0 }: PortfolioViewerProps) {
  const [activeImage, setActiveImage] = useState(initialIndex)

  // Function to navigate carousel
  const navigate = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    } else {
      setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }
  }

  if (images.length === 0) {
    return (
      <div className="glass-panel rounded-lg p-8 flex flex-col items-center justify-center h-64">
        <p className="text-white/60">No portfolio images available</p>
      </div>
    )
  }

  return (
    <div>
      {/* Main carousel */}
      <div className="relative glass-panel rounded-lg overflow-hidden mb-6">
        {/* Navigation arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full glass-panel text-white border-white/20 hover:bg-white/10"
          onClick={() => navigate("prev")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full glass-panel text-white border-white/20 hover:bg-white/10"
          onClick={() => navigate("next")}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>

        {/* Main image */}
        <div className="relative w-full h-[500px]">
          {images.map((item, index) => (
            <motion.div
              key={item.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: activeImage === index ? 1 : 0,
                zIndex: activeImage === index ? 1 : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <Image src={item.image || "/placeholder.svg"} alt={item.caption} fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                <p className="text-white text-lg font-medium">{item.caption}</p>
                {item.description && <p className="text-white/80 text-sm mt-1">{item.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Thumbnail navigation */}
      <div className="flex justify-center gap-2 mb-4">
        {images.map((item, index) => (
          <button
            key={item.id}
            className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
              activeImage === index ? "border-white scale-110" : "border-white/30 opacity-70"
            }`}
            onClick={() => setActiveImage(index)}
          >
            <Image src={item.image || "/placeholder.svg"} alt={item.caption} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
