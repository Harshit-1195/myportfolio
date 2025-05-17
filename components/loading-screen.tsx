"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // When countdown reaches 0, end loading
          setTimeout(() => setIsLoading(false), 500)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Simple countdown timer */}
          <motion.div
            className="absolute z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-white text-6xl md:text-8xl font-light opacity-30"
              key={countdown}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: [0, 1, 0], scale: [1.5, 1, 0.8] }}
              transition={{ duration: 1, times: [0, 0.2, 1] }}
            >
              {countdown}
            </motion.div>
          </motion.div>

          {/* Moon-like Interactive Particles */}
          <MoonParticles />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Moon-like particles that interact with cursor
function MoonParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<
    Array<{
      x: number
      y: number
      size: number
      baseSize: number
      speed: number
      vx: number
      vy: number
      color: string
      opacity: number
    }>
  >([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Recreate particles when resizing
      initParticles()
    }

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    handleResize()

    // Initialize particles
    function initParticles() {
      particlesRef.current = []
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), 150)

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          baseSize: Math.random() * 3 + 1,
          speed: Math.random() * 0.2 + 0.1,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          color: `rgba(${220 + Math.random() * 35}, ${220 + Math.random() * 35}, ${220 + Math.random() * 35}, ${Math.random() * 0.5 + 0.5})`,
          opacity: Math.random() * 0.5 + 0.3,
        })
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Calculate distance from mouse
        const dx = mousePosition.current.x - particle.x
        const dy = mousePosition.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        // Interactive behavior - particles are attracted to cursor
        if (distance < maxDistance) {
          // Calculate attraction force
          const force = (1 - distance / maxDistance) * 0.2
          const angle = Math.atan2(dy, dx)

          // Apply force to velocity
          particle.vx += Math.cos(angle) * force
          particle.vy += Math.sin(angle) * force

          // Increase size based on proximity to cursor
          particle.size = particle.baseSize + (1 - distance / maxDistance) * 3
        } else {
          // Gradually return to base size
          particle.size = particle.baseSize
        }

        // Apply velocity with damping
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.98
        particle.vy *= 0.98

        // Boundary check - wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle with glow effect
        ctx.save()
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.shadowColor = "white"
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.restore()

        // Draw connections between nearby particles
        particlesRef.current.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 70) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 70)})`
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  )
}
