"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/router"
import Link from "next/link"

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()

      if (!data.user && !router.pathname.includes("/login")) {
        router.push("/admin/login")
        return
      }

      setUser(data.user)
      setLoading(false)
    }

    getUser()
  }, [router.pathname])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a202c",
          color: "white",
        }}
      >
        <div>Loading...</div>
      </div>
    )
  }

  // Don't show layout for login page
  if (router.pathname.includes("/login")) {
    return children
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1a202c",
        color: "white",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#2d3748",
          padding: "1rem 2rem",
          borderBottom: "1px solid #4a5568",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <Link
            href="/admin/dashboard"
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "white",
              textDecoration: "none",
            }}
          >
            Portfolio CMS
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <Link href="/admin/dashboard" style={{ color: "#a0aec0", textDecoration: "none" }}>
              Dashboard
            </Link>
            <Link href="/admin/blog" style={{ color: "#a0aec0", textDecoration: "none" }}>
              Blog
            </Link>
            <Link href="/admin/projects" style={{ color: "#a0aec0", textDecoration: "none" }}>
              Projects
            </Link>
            <Link href="/admin/media" style={{ color: "#a0aec0", textDecoration: "none" }}>
              Media
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "0.875rem", color: "#a0aec0" }}>{user?.email}</span>
              <button
                onClick={handleSignOut}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#e53e3e",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}
