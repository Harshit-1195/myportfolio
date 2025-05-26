"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        // If not on the login page, redirect to login
        if (pathname !== "/admin/login") {
          router.push("/admin/login")
        }
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(true)
        // If on the login page, redirect to admin dashboard
        if (pathname === "/admin/login") {
          router.push("/admin")
        }
      }

      setIsLoading(false)
    }

    checkAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setIsAuthenticated(true)
        if (pathname === "/admin/login") {
          router.push("/admin")
        }
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false)
        router.push("/admin/login")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [pathname, router, supabase])

  // If loading, show loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  // If not authenticated and not on login page, don't render children
  if (!isAuthenticated && pathname !== "/admin/login") {
    return null
  }

  // Admin navigation
  const AdminNav = () => {
    if (pathname === "/admin/login") return null

    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-white font-bold text-xl">
                Admin Dashboard
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/admin/blog" className="text-gray-300 hover:text-white">
                Blog
              </Link>
              <Link href="/admin/projects" className="text-gray-300 hover:text-white">
                Projects
              </Link>
              <Link href="/admin/case-studies" className="text-gray-300 hover:text-white">
                Case Studies
              </Link>
              <Link href="/admin/content" className="text-gray-300 hover:text-white">
                Content
              </Link>
              <Link href="/admin/media" className="text-gray-300 hover:text-white">
                Media
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push("/admin/login")
                }}
                className="text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminNav />
      <div className={pathname === "/admin/login" ? "" : "pt-16"}>{children}</div>
    </div>
  )
}
