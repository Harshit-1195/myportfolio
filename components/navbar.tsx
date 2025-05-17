"use client"

import { useState, useEffect } from "react"
import { Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import AnimatedLogo from "@/components/animated-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeLink, setActiveLink] = useState("/")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    // Set active link based on current path
    setActiveLink(window.location.pathname)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <AnimatedLogo />
          <div className="ml-3 hidden sm:block">
            <p
              className={cn(
                "text-xs text-muted-foreground transition-all duration-500 transform",
                isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              )}
            >
              Digital Marketing
            </p>
            <p
              className={cn(
                "text-xs text-muted-foreground transition-all duration-500 delay-100 transform",
                isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
              )}
            >
              Web Developer, Content Creator
            </p>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: "/", label: "Home" },
            { href: "/resume", label: "Resume" },
            { href: "/work", label: "My Work" },
            { href: "/blog", label: "Blog" },
            { href: "/podcast", label: "Podcast" },
            { href: "/contact", label: "Contact" },
            { href: "/certifications", label: "Certifications" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-all duration-300 relative overflow-hidden hover-glow-blue",
                activeLink === link.href ? "text-black" : "text-muted-foreground hover:text-black",
              )}
            >
              <motion.div
                className="absolute inset-0 bg-white/5 z-0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">{link.label}</span>
              <span
                className={cn(
                  "absolute -bottom-1 left-0 w-full h-0.5 bg-black transform transition-transform duration-300 origin-left",
                  activeLink === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                )}
              />
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {isSearchOpen ? (
            <div className="relative animate-fade-in">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] pl-9 rounded-full bg-background"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="transition-transform duration-300 hover:rotate-12"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden transition-transform duration-300 hover:rotate-12">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-8 mt-2">
                <AnimatedLogo />
                <ThemeToggle />
              </div>

              <nav className="flex flex-col gap-6">
                {[
                  { href: "/", label: "Home" },
                  { href: "/resume", label: "Resume" },
                  { href: "/work", label: "My Work" },
                  { href: "/blog", label: "Blog" },
                  { href: "/podcast", label: "Podcast" },
                  { href: "/contact", label: "Contact" },
                  { href: "/certifications", label: "Certifications" },
                ].map((link, index) => (
                  <motion.div
                    key={link.href}
                    className="overflow-hidden relative"
                    whileHover={{
                      scale: 1.05,
                      x: 5,
                      transition: { type: "spring", stiffness: 400, damping: 10 },
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/5 z-0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <a
                      href={link.href}
                      className={cn(
                        "text-lg font-medium transition-all duration-300 transform relative z-10",
                        activeLink === link.href
                          ? "text-black translate-x-2"
                          : "text-muted-foreground hover:text-black hover:translate-x-2",
                      )}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      {link.label}
                    </a>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto mb-8">
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search..." className="w-full pl-9 rounded-full bg-background" />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
