"use client"

import { useRef, useEffect, useState } from "react"
import { throttle } from "@/lib/utils"

// This is a simpler version of the particle effect specifically for pages where the main effect isn't showing
export default function PageParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const [isVisible, setIsVisible] = useState(false)
  const particlesRef = useRef<
    {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }[]
  >([])
  const devicePerformance = useRef<"low" | "medium" | "high">("medium")

  // Detect scroll events to reduce animation complexity during scrolling
  const isScrolling = useRef(false)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if this component is in the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (canvasRef.current) {
      observer.observe(canvasRef.current)
    }

    // Detect device performance based on screen size and pixel ratio
    const detectPerformance = () => {
      const width = window.innerWidth
      const dpr = window.devicePixelRatio || 1

      if (width < 768 || dpr > 2) {
        devicePerformance.current = "low"
      } else if (width < 1200) {
        devicePerformance.current = "medium"
      } else {
        devicePerformance.current = "high"
      }
    }

    detectPerformance()

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with performance considerations
    const handleResize = () => {
      detectPerformance()

      // Use a lower resolution for the canvas on lower-end devices
      const dpr = devicePerformance.current === "low" ? 1 : window.devicePixelRatio || 1

      // Set logical size
      canvas.style.width = "100vw"
      canvas.style.height = "100vh"

      // Set actual size in memory (scaled to account for extra pixel density)
      const width = window.innerWidth
      const height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr

      // Scale context to ensure correct drawing operations
      ctx.scale(dpr, dpr)

      // Recreate particles when resizing
      initParticles()
    }

    // Track mouse position with throttling
    const handleMouseMove = throttle((e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }, 16) // ~60fps

    const handleScroll = throttle(() => {
      isScrolling.current = true

      // Clear previous timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      // Set a timeout to detect when scrolling stops
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false
      }, 150)
    }, 16)

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleResize()

    // Create particles based on device performance
    function initParticles() {
      // Clear existing particles
      particlesRef.current = []

      // Adjust particle count based on device performance
      let particleCount

      switch (devicePerformance.current) {
        case "low":
          particleCount = Math.min(Math.floor(window.innerWidth / 100), 15)
          break
        case "medium":
          particleCount = Math.min(Math.floor(window.innerWidth / 50), 30)
          break
        case "high":
          particleCount = Math.min(Math.floor(window.innerWidth / 25), 50)
          break
      }

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.2,
        })
      }
    }

    // Animation loop with optimizations
    const animate = () => {
      if (!isVisible) {
        // Skip rendering when not visible
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Simplified rendering during scrolling
      const isCurrentlyScrolling = isScrolling.current

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = window.innerWidth
        if (particle.x > window.innerWidth) particle.x = 0
        if (particle.y < 0) particle.y = window.innerHeight
        if (particle.y > window.innerHeight) particle.y = 0

        // Skip complex calculations during scrolling
        if (!isCurrentlyScrolling && devicePerformance.current !== "low") {
          // Calculate distance from mouse
          const dx = mousePosition.current.x - particle.x
          const dy = mousePosition.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Make particles follow the cursor with subtle attraction
          if (distance < 200) {
            const angle = Math.atan2(dy, dx)
            const force = 0.2 * (1 - distance / 200)
            particle.speedX += Math.cos(angle) * force
            particle.speedY += Math.sin(angle) * force

            // Add some damping to prevent excessive speed
            particle.speedX *= 0.95
            particle.speedY *= 0.95
          }

          // Adjust particle based on mouse proximity
          let particleOpacity = particle.opacity
          let particleSize = particle.size

          if (distance < 100) {
            particleOpacity = Math.min(1, particle.opacity + ((100 - distance) / 100) * 0.5)
            particleSize = particle.size + ((100 - distance) / 100) * 2
          }

          // Draw particle
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${particleOpacity})`
          ctx.fill()
        } else {
          // Simplified drawing during scrolling
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
          ctx.fill()
        }
      })

      // Draw connections only when not scrolling and on medium/high performance devices
      if (!isCurrentlyScrolling && devicePerformance.current !== "low") {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
        ctx.lineWidth = 0.5

        // Limit the number of connections to improve performance
        const connectionLimit = Math.min(
          particlesRef.current.length,
          devicePerformance.current === "high" ? particlesRef.current.length : particlesRef.current.length / 2,
        )

        for (let i = 0; i < connectionLimit; i += 2) {
          // Skip every other particle for performance
          for (let j = i + 1; j < Math.min(particlesRef.current.length, i + 4); j++) {
            // Limit connections per particle
            const dx = particlesRef.current[i].x - particlesRef.current[j].x
            const dy = particlesRef.current[i].y - particlesRef.current[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              // Calculate opacity based on distance
              const opacity = 0.05 * (1 - distance / 100)
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`

              ctx.beginPath()
              ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y)
              ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y)
              ctx.stroke()
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isVisible])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 opacity-50 pointer-events-none"
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: 0,
      }}
    />
  )
}
