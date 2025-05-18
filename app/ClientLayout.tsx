"use client"

import type React from "react"
import { Space_Grotesk, Dancing_Script, Playfair_Display } from "next/font/google"
import "./globals.css"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense, lazy, useEffect, useState } from "react"
// Import the FloatingNavigation component
import FloatingNavigation from "@/components/floating-navigation"
// Import the ConsentBanner component
import ConsentBanner from "@/components/consent-banner"
// Import the BackToHome component
import { BackToHomeAlt } from "@/components/back-to-home-alt"

// Lazy load heavy components
const InteractiveParticles = lazy(() => import("@/components/interactive-particles"))
const InteractiveCursor = lazy(() => import("@/components/interactive-cursor"))
const FloatingActionButton = lazy(() => import("@/components/floating-action-button"))

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap", // Add display swap for better font loading
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
  display: "swap", // Add display swap for better font loading
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap", // Add display swap for better font loading
})

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isScrolling, setIsScrolling] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Mark as loaded after initial render
    setIsLoaded(true)

    let scrollTimeout: NodeJS.Timeout
    const body = document.body

    const handleScroll = () => {
      // Add class to reduce animations during scroll
      if (!isScrolling) {
        setIsScrolling(true)
        body.classList.add("is-scrolling")
      }

      // Clear previous timeout
      clearTimeout(scrollTimeout)

      // Set timeout to remove class after scrolling stops
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
        body.classList.remove("is-scrolling")
      }, 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    // Preload critical resources
    const preloadResources = () => {
      // Preload any critical images or resources here
    }

    preloadResources()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [isScrolling])

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${dancingScript.variable} ${playfairDisplay.variable} font-sans text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Only render particles after initial load */}
          {isLoaded && (
            <Suspense fallback={null}>
              <InteractiveParticles />
            </Suspense>
          )}

          {/* Add the FloatingNavigation component to the layout */}
          <FloatingNavigation />

          {/* Add the BackToHome component */}
          <BackToHomeAlt />

          <main className="relative z-10">{children}</main>
          <Footer />

          {/* Add the ConsentBanner component */}
          <ConsentBanner />

          {/* Lazy load other heavy components */}
          {isLoaded && (
            <>
              <Suspense fallback={null}>
                <InteractiveCursor />
              </Suspense>

              <Suspense fallback={null}>
                <FloatingActionButton />
              </Suspense>
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}
