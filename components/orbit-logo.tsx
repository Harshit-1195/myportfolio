"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function OrbitLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const animationFrameId = useRef<number>()
  const particles = useRef<{ x: number; y: number; size: number; speed: number; angle: number }[]>([])

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

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const size = Math.min(120, window.innerWidth / 8)
      canvas.width = size
      canvas.height = size
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create particles
    const createParticles = () => {
      particles.current = []
      const particleCount = 3
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      for (let i = 0; i < particleCount; i++) {
        const angle = ((Math.PI * 2) / particleCount) * i
        const distance = canvas.width * 0.3

        particles.current.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          size: 3,
          speed: 0.01 + Math.random() * 0.01,
          angle,
        })
      }
    }

    createParticles()

    // Draw function
    const draw = () => {
      if (!ctx || !canvas || !isVisible) {
        animationFrameId.current = requestAnimationFrame(draw)
        return
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw center circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
      ctx.fillStyle = "white"
      ctx.fill()

      // Update and draw particles
      particles.current.forEach((particle) => {
        // Update angle
        particle.angle += particle.speed

        // Calculate new position
        const distance = canvas.width * 0.3
        particle.x = centerX + Math.cos(particle.angle) * distance
        particle.y = centerY + Math.sin(particle.angle) * distance

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = "white"
        ctx.fill()

        // Draw orbit path
        ctx.beginPath()
        ctx.arc(centerX, centerY, distance, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw line to center
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(particle.x, particle.y)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Continue animation
      animationFrameId.current = requestAnimationFrame(draw)
    }

    // Start animation
    draw()

    // Cleanup
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", setCanvasDimensions)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [isVisible])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      <canvas ref={canvasRef} className="block" />
    </motion.div>
  )
}
