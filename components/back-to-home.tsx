"use client"

import { usePathname } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function BackToHome() {
  const pathname = usePathname()

  // Don't show on home page
  if (pathname === "/") return null

  return (
    <motion.div
      className="fixed bottom-8 left-8 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Link href="/">
        <motion.div
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-black/80 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={16} />
          <span className="font-medium">Back to Home</span>
        </motion.div>
      </Link>
    </motion.div>
  )
}
