"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Info } from "lucide-react"

export default function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasConsented, setHasConsented] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consentStatus = localStorage.getItem("analyticsConsent")

    if (consentStatus === null) {
      // Only show banner if user hasn't made a choice yet
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500)

      return () => clearTimeout(timer)
    } else {
      setHasConsented(consentStatus === "true")
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("analyticsConsent", "true")
    setHasConsented(true)
    setIsVisible(false)
    // Here you would initialize your analytics
  }

  const handleDecline = () => {
    localStorage.setItem("analyticsConsent", "false")
    setHasConsented(false)
    setIsVisible(false)
    // Here you would ensure analytics are disabled
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 left-6 right-6 md:right-auto md:left-6 md:max-w-xs z-50"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="glass-panel p-4 rounded-lg shadow-lg relative overflow-hidden hover-glow-pink border border-white/20">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-3 right-3 text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start mb-2">
              <Info className="h-5 w-5 text-white mr-2 mt-0.5" />
              <div>
                <h3 className="text-white font-medium mb-1">Analytics Consent</h3>
                <p className="text-white/70 text-xs mb-1.5">
                  We'd like to collect anonymous usage data to improve your experience.
                </p>
                <p className="text-white/70 text-xs italic">
                  "We don't need your data to track you... but it would be nice to know if anyone's actually using this
                  site."
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="text-white hover:text-white border-white/20 text-xs py-1 h-8"
              >
                No thanks
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="bg-white text-black hover:bg-white/90 text-xs py-1 h-8"
              >
                Allow analytics
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
