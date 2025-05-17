"use client"

import { useState, useEffect } from "react"
import { Menu, X, Home, FileText, Briefcase, BookOpen, Headphones, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { throttle } from "@/lib/utils"

export default function FloatingNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleOpen = () => setIsOpen(!isOpen)

  const buttonVariants = {
    closed: { scale: 1 },
    open: { scale: 1.1 },
  }

  const itemVariants = {
    closed: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  }

  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: "Home", href: "/" },
    { icon: <FileText className="h-5 w-5" />, label: "Resume", href: "/resume" },
    { icon: <Briefcase className="h-5 w-5" />, label: "Work", href: "/work" },
    { icon: <BookOpen className="h-5 w-5" />, label: "Blog", href: "/blog" },
    { icon: <Headphones className="h-5 w-5" />, label: "Podcast", href: "/podcast" },
    { icon: <Mail className="h-5 w-5" />, label: "Contact", href: "/contact" },
  ]

  // Close menu when pathname changes (page navigation)
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".floating-nav-container")) {
        setIsOpen(false)
      }
    }

    const closeTimeout = setTimeout(() => {
      document.addEventListener("click", handleClickOutside)
    }, 100)

    return () => {
      document.removeEventListener("click", handleClickOutside)
      clearTimeout(closeTimeout)
    }
  }, [isOpen])

  // Handle scroll events to close menu when scrolling
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (isOpen) {
        setIsOpen(false)
      }
    }, 100)

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isOpen])

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-3 floating-nav-container">
      <AnimatePresence>
        {isOpen && (
          <>
            {navItems.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={itemVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="w-full"
              >
                <Link href={item.href}>
                  <motion.button
                    className={`${
                      pathname === item.href ? "glass-panel text-white" : "glass-panel text-white"
                    } p-3 rounded-full shadow-lg flex items-center gap-2 min-w-[140px] justify-center hover:bg-white/10 transition-colors relative overflow-hidden ${
                      pathname === item.href ? "hover-glow" : "hover-glow-pink"
                    }`}
                    whileHover={{
                      scale: 1.05,
                      x: -5,
                      transition: { type: "spring", stiffness: 400, damping: 10 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/5 z-0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.span className="relative z-10" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                      {item.icon}
                    </motion.span>
                    <span className="relative z-10">{item.label}</span>
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.button
        className="glass-panel text-white p-4 rounded-full shadow-lg hover:bg-white/10 transition-colors"
        onClick={toggleOpen}
        variants={buttonVariants}
        animate={isOpen ? "open" : "closed"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </motion.button>
    </div>
  )
}
