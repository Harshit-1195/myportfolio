"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface LogoStoryCardProps {
  title: string
  description: string
  image: string
  process?: string
  challenge?: string
  solution?: string
}

export function LogoStoryCard({ title, description, image, process, challenge, solution }: LogoStoryCardProps) {
  const [isActive, setIsActive] = useState(false)

  return (
    <motion.div
      className="flex-shrink-0 snap-center w-full max-w-sm glass-panel rounded-lg overflow-hidden hover-lift hover-glow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{
        y: -5,
        scale: 1.01,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => setIsActive(!isActive)}
            aria-expanded={isActive}
            aria-label={isActive ? "Collapse description" : "Expand description"}
          >
            <ChevronDown
              className={`h-5 w-5 transition-transform duration-300 ${isActive ? "transform rotate-180" : ""}`}
            />
          </Button>
        </div>

        {/* Larger, more prominent image */}
        <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4 border border-white/20">
          <Image src={image || "/placeholder.svg"} alt={`${title} logo design`} fill className="object-contain p-4" />
        </div>

        {/* Collapsible description */}
        <div className={`overflow-hidden transition-all duration-500 ${isActive ? "max-h-[500px]" : "max-h-20"}`}>
          <p className="text-white/90">{description}</p>

          {/* Additional content that shows when expanded */}
          {isActive && process && (
            <div className="mt-4">
              <h4 className="font-semibold text-white mb-2">Design Process</h4>
              <p className="text-white/90">{process}</p>
            </div>
          )}

          {isActive && challenge && (
            <div className="mt-4">
              <h4 className="font-semibold text-white mb-2">Challenge</h4>
              <p className="text-white/90">{challenge}</p>
            </div>
          )}

          {isActive && solution && (
            <div className="mt-4">
              <h4 className="font-semibold text-white mb-2">Solution</h4>
              <p className="text-white/90">{solution}</p>
            </div>
          )}
        </div>

        {/* Read more/less indicator */}
        {!isActive && description.length > 150 && (
          <button onClick={() => setIsActive(true)} className="text-white/80 hover:text-white text-sm mt-1 underline">
            Read more
          </button>
        )}
        {isActive && (
          <button onClick={() => setIsActive(false)} className="text-white/80 hover:text-white text-sm mt-4 underline">
            Read less
          </button>
        )}
      </div>
    </motion.div>
  )
}
