"use client"

import { usePathname } from "next/navigation"
import { Home } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function BackToHomeAlt() {
  const pathname = usePathname()

  // Don't show on home page
  if (pathname === "/") return null

  return (
    <motion.div
      className="fixed top-4 left-4 z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Link href="/">
        <motion.div
          className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full shadow-lg hover:bg-black/80 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Home size={20} />
        </motion.div>
      </Link>
    </motion.div>
  )
}
