"use client"

import { useState, useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"

interface AnimatedTextProps {
  text: string
  className?: string
  once?: boolean
  delay?: number
  speed?: number
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"
}

export default function AnimatedText({
  text,
  className = "",
  once = true,
  delay = 0,
  speed = 50,
  tag: Tag = "p",
}: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.1,
  })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!inView) return

    // Add delay before starting animation
    const delayTimeout = setTimeout(() => {
      setIsAnimating(true)
      let currentIndex = 0

      const animateText = () => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.substring(0, currentIndex))
          currentIndex++
          timeoutRef.current = setTimeout(animateText, speed)
        } else {
          setIsAnimating(false)
        }
      }

      animateText()
    }, delay)

    return () => {
      clearTimeout(delayTimeout)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [inView, text, delay, speed])

  return (
    <Tag ref={ref} className={cn(className)}>
      {displayedText}
      {isAnimating && <span className="cursor-blink"></span>}
    </Tag>
  )
}
