"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import {
  FileText,
  Briefcase,
  LayoutGrid,
  ImageIcon,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Blog", href: "/admin/blog", icon: <FileText className="w-5 h-5" /> },
    { label: "Projects", href: "/admin/projects", icon: <Briefcase className="w-5 h-5" /> },
    { label: "Case Studies", href: "/admin/case-studies", icon: <LayoutGrid className="w-5 h-5" /> },
    { label: "Media", href: "/admin/media", icon: <ImageIcon className="w-5 h-5" /> },
    { label: "Messages", href: "/admin/messages", icon: <Mail className="w-5 h-5" /> },
    { label: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900 border-b border-gray-700 z-40 h-16">
        <div className="container mx-auto px-4 flex justify-between items-center h-full max-w-7xl">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="text-xl font-bold text-white">
              Portfolio CMS
            </Link>

            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`${
                      pathname === item.href ? "bg-gray-800 text-white" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" target="_blank">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Home className="w-4 h-4 mr-2" />
                View Site
              </Button>
            </Link>

            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>

            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-300"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 md:hidden">
          <div className="fixed right-0 top-0 bottom-0 w-64 bg-gray-900 border-l border-gray-700 p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <Button variant="ghost" size="icon" className="text-gray-300" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                    pathname === item.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-gray-700">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  View Site
                </Link>

                <button
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
