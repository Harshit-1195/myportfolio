"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { throttle } from "@/lib/utils"

export default function InteractiveCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastMouseMoveRef = useRef<number>(0)
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Only show cursor after a short delay to prevent initial flash
    const showTimeout = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    // Throttled mouse move handler
    const handleMouseMove = throttle((e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      lastMouseMoveRef.current = Date.now()

      // Clear any existing timeout
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current)
      }

      // Set a timeout to hide cursor after inactivity
      mouseMoveTimeoutRef.current = setTimeout(() => {
        const timeSinceLastMove = Date.now() - lastMouseMoveRef.current
        if (timeSinceLastMove > 3000) {
          setIsVisible(false)
        }
      }, 3000)
    }, 10)

    const handleMouseOver = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement).tagName === "A" ||
        (e.target as HTMLElement).tagName === "BUTTON" ||
        (e.target as HTMLElement).closest("a") ||
        (e.target as HTMLElement).closest("button")
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    // Detect scrolling to simplify cursor during scroll
    const handleScroll = throttle(() => {
      setIsScrolling(true)

      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Set timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }, 16)

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseover", handleMouseOver)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      clearTimeout(showTimeout)
      if (mouseMoveTimeoutRef.current) clearTimeout(mouseMoveTimeoutRef.current)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseover", handleMouseOver)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Simplified cursor during scrolling
  const cursorVariants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      mixBlendMode: "difference" as const,
    },
    hover: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      height: 80,
      width: 80,
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      mixBlendMode: "difference" as const,
    },
    scrolling: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      height: 16,
      width: 16,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      mixBlendMode: "difference" as const,
    },
  }

  if (!isVisible) return null

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 border border-white/30"
        variants={cursorVariants}
        animate={isScrolling ? "scrolling" : isHovering ? "hover" : "default"}
        transition={{
          type: "spring",
          stiffness: isScrolling ? 1000 : 500,
          damping: isScrolling ? 50 : 28,
          mass: isScrolling ? 0.5 : 1,
        }}
      />
      {!isScrolling && (
        <motion.div
          className="fixed top-0 left-0 rounded-full pointer-events-none z-50 bg-white/50"
          style={{
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            height: 8,
            width: 8,
          }}
          transition={{ type: "spring", stiffness: 1000, damping: 28 }}
        />
      )}
    </>
  )
}
