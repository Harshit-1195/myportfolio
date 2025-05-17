"use client"

import { useState } from "react"
import { Phone, Mail, Calendar, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  const buttonVariants = {
    closed: { scale: 1 },
    open: { scale: 1.1 },
  }

  const itemVariants = {
    closed: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  }

  const actions = [
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Call Me",
      action: () => window.open("tel:+971556453208", "_blank"),
      color: "bg-black text-white",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email Me",
      action: () => window.open("mailto:dabhiharshit11@gmail.com", "_blank"),
      color: "bg-black text-white",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Schedule",
      action: () => window.open("https://calendly.com/harshitdabhi/30min", "_blank"),
      color: "bg-black text-white",
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <>
            {actions.map((action, i) => (
              <motion.button
                key={i}
                custom={i}
                variants={itemVariants}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={action.action}
                className={`${action.color} p-3 rounded-full shadow-lg flex items-center gap-2 min-w-[120px] justify-center hover:bg-black/80 transition-colors relative overflow-hidden hover-glow`}
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
                  {action.icon}
                </motion.span>
                <span className="relative z-10">{action.label}</span>
              </motion.button>
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.button
        className="bg-black text-white p-4 rounded-full shadow-lg hover:bg-black/80 transition-colors"
        onClick={toggleOpen}
        variants={buttonVariants}
        animate={isOpen ? "open" : "closed"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
      </motion.button>
    </div>
  )
}
