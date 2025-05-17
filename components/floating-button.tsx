"use client"

import { useState } from "react"
import { Download, FileDown, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadResume = async () => {
    setIsDownloading(true)
    try {
      window.open("/api/resume", "_blank")
    } finally {
      setIsDownloading(false)
      setIsOpen(false)
    }
  }

  const handleDownloadPresentation = async () => {
    setIsDownloading(true)
    try {
      window.open("/api/presentation", "_blank")
    } finally {
      setIsDownloading(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="bg-white rounded-lg shadow-lg p-4 mb-4 w-64"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Download Options</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hover:rotate-90 transition-transform duration-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {[
                {
                  icon: <FileText className="h-4 w-4" />,
                  label: "Download Resume",
                  action: handleDownloadResume,
                },
                {
                  icon: <FileDown className="h-4 w-4" />,
                  label: "Download Portfolio PPT",
                  action: handleDownloadPresentation,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                  className="relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/5 z-0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 relative overflow-hidden group hover-glow"
                    onClick={item.action}
                    disabled={isDownloading}
                  >
                    <motion.span className="relative z-10" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                      {item.icon}
                    </motion.span>
                    <span className="relative z-10">{item.label}</span>
                    <span className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out z-0" />
                    <span className="absolute inset-0 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex items-center justify-center z-0" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
        <Button
          className="h-14 w-14 rounded-full shadow-lg bg-black text-white hover:bg-black/80"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Download className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  )
}
