"use client"

import { useRef, useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MarqueeTextProps {
  children: ReactNode
  className?: string
  direction?: "left" | "right"
  speed?: number
  pauseOnHover?: boolean
}

export default function MarqueeText({
  children,
  className = "",
  direction = "left",
  speed = 30,
  pauseOnHover = true,
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const duplicateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    const duplicate = duplicateRef.current

    if (!container || !content || !duplicate) return

    // Set initial positions
    const contentWidth = content.offsetWidth

    if (direction === "left") {
      content.style.transform = "translateX(0)"
      duplicate.style.transform = `translateX(${contentWidth}px)`
    } else {
      content.style.transform = `translateX(${-contentWidth}px)`
      duplicate.style.transform = "translateX(0)"
    }

    // Calculate animation duration based on content width and speed
    const duration = contentWidth / speed

    // Apply animation
    const keyframes =
      direction === "left"
        ? [
            { transform: "translateX(0)", offset: 0 },
            { transform: `translateX(${-contentWidth}px)`, offset: 1 },
          ]
        : [
            { transform: `translateX(${-contentWidth}px)`, offset: 0 },
            { transform: "translateX(0)", offset: 1 },
          ]

    const contentAnimation = content.animate(keyframes, {
      duration: duration * 1000,
      iterations: Number.POSITIVE_INFINITY,
      easing: "linear",
    })

    const duplicateKeyframes =
      direction === "left"
        ? [
            { transform: `translateX(${contentWidth}px)`, offset: 0 },
            { transform: "translateX(0)", offset: 1 },
          ]
        : [
            { transform: "translateX(0)", offset: 0 },
            { transform: `translateX(${contentWidth}px)`, offset: 1 },
          ]

    const duplicateAnimation = duplicate.animate(duplicateKeyframes, {
      duration: duration * 1000,
      iterations: Number.POSITIVE_INFINITY,
      easing: "linear",
    })

    // Pause on hover if enabled
    if (pauseOnHover) {
      container.addEventListener("mouseenter", () => {
        contentAnimation.pause()
        duplicateAnimation.pause()
      })

      container.addEventListener("mouseleave", () => {
        contentAnimation.play()
        duplicateAnimation.play()
      })
    }

    return () => {
      contentAnimation.cancel()
      duplicateAnimation.cancel()
    }
  }, [direction, speed, pauseOnHover])

  return (
    <div ref={containerRef} className={cn("overflow-hidden whitespace-nowrap", className)}>
      <div className="inline-flex">
        <div ref={contentRef} className="inline-block">
          {children}
        </div>
        <div ref={duplicateRef} className="inline-block">
          {children}
        </div>
      </div>
    </div>
  )
}
