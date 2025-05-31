"use client"

import type React from "react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Admin navigation
  const AdminNav = () => {
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
            </nav>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminNav />
      <div className="pt-16">{children}</div>
    </div>
  )
}
