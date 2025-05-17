"use client"

import { useRef, useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: "up" | "down" | "left" | "right"
}

export default function ParallaxSection({
  children,
  className = "",
  speed = 0.1,
  direction = "up",
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const handleScroll = () => {
      const sectionRect = section.getBoundingClientRect()
      const scrollPosition = window.scrollY

      // Only apply parallax when section is in view
      if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
        const offset = (scrollPosition - (sectionRect.top + scrollPosition - window.innerHeight / 2)) * speed

        let transform = ""
        switch (direction) {
          case "up":
            transform = `translateY(${-offset}px)`
            break
          case "down":
            transform = `translateY(${offset}px)`
            break
          case "left":
            transform = `translateX(${-offset}px)`
            break
          case "right":
            transform = `translateX(${offset}px)`
            break
        }

        content.style.transform = transform
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial position

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [speed, direction])

  return (
    <div ref={sectionRef} className={cn("overflow-hidden", className)}>
      <div ref={contentRef} className="transition-transform duration-300 ease-out">
        {children}
      </div>
    </div>
  )
}
