"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)
  const devicePerformance = useRef<"low" | "medium" | "high">("medium")

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

    // Set canvas to full screen with performance considerations
    const handleResize = () => {
      detectPerformance()

      // Use a lower resolution for the canvas on lower-end devices
      const dpr = devicePerformance.current === "low" ? 1 : window.devicePixelRatio || 1

      // Set logical size
      canvas.style.width = "100%"
      canvas.style.height = "100%"

      // Set actual size in memory (scaled to account for extra pixel density)
      const width = window.innerWidth
      const height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr

      // Scale context to ensure correct drawing operations
      ctx.scale(dpr, dpr)

      // Recreate particles when resizing
      createParticles()
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Create particles based on device performance
    function createParticles() {
      // Clear existing particles
      particlesRef.current = []

      // Adjust particle count based on device performance
      let particleCount

      switch (devicePerformance.current) {
        case "low":
          particleCount = Math.min(Math.floor(window.innerWidth / 50), 30)
          break
        case "medium":
          particleCount = Math.min(Math.floor(window.innerWidth / 25), 60)
          break
        case "high":
          particleCount = Math.min(Math.floor(window.innerWidth / 10), 100)
          break
      }

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
    }

    // Animation loop with performance optimizations
    const animate = () => {
      if (!isVisible) {
        // Skip rendering when not visible
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 0, 0, ${particle.opacity})`
        ctx.fill()
      })

      // Draw connections only on medium/high performance devices
      if (devicePerformance.current !== "low") {
        ctx.strokeStyle = "rgba(0, 0, 0, 0.03)"
        ctx.lineWidth = 1

        // Limit the number of particles to check for connections
        const connectionLimit = Math.min(
          particlesRef.current.length,
          devicePerformance.current === "high" ? particlesRef.current.length : particlesRef.current.length / 2,
        )

        for (let i = 0; i < connectionLimit; i++) {
          for (let j = i + 1; j < connectionLimit; j++) {
            const dx = particlesRef.current[i].x - particlesRef.current[j].x
            const dy = particlesRef.current[i].y - particlesRef.current[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.beginPath()
              ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y)
              ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y)
              ctx.stroke()
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isVisible])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-50" />
}
