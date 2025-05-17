"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { throttle } from "@/lib/utils"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
}

export function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Create a throttled observer callback for better performance
    const handleIntersection = throttle((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active")
        }
      })
    }, 100)

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "0px 0px -10% 0px", // Trigger a bit earlier
    })

    observer.observe(section)

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  return (
    <div ref={sectionRef} className={`reveal fade-bottom ${className}`}>
      {children}
    </div>
  )
}
