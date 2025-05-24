"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import Link from "next/link"

// Component to show latest blog posts on homepage
export function LatestBlogPosts({ limit = 3 }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, featured_image, published_at, author")
          .eq("published", true)
          .order("published_at", { ascending: false })
          .limit(limit)

        if (error) throw error
        setPosts(data || [])
      } catch (error) {
        console.error("Error fetching latest posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestPosts()
  }, [limit])

  if (loading) {
    return <div>Loading latest posts...</div>
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <section style={{ padding: "4rem 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center", marginBottom: "3rem" }}>
          Latest Blog Posts
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {posts.map((post) => (
            <article
              key={post.id}
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
            >
              {post.featured_image && (
                <img
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              )}

              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                  <Link href={`/blog/${post.slug}`} style={{ color: "#1a202c", textDecoration: "none" }}>
                    {post.title}
                  </Link>
                </h3>

                {post.excerpt && (
                  <p style={{ color: "#4a5568", marginBottom: "1rem", lineHeight: "1.6" }}>
                    {post.excerpt.substring(0, 120)}...
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.875rem",
                    color: "#666",
                  }}
                >
                  <span>{post.author}</span>
                  <time>{new Date(post.published_at).toLocaleDateString()}</time>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link
            href="/blog"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#4299e1",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  )
}

// Component to show featured projects
export function FeaturedProjects({ limit = 6 }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("published", true)
          .order("order_index", { ascending: true })
          .limit(limit)

        if (error) throw error
        setProjects(data || [])
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [limit])

  if (loading) {
    return <div>Loading projects...</div>
  }

  if (projects.length === 0) {
    return null
  }

  return (
    <section style={{ padding: "4rem 2rem", backgroundColor: "#f7fafc" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center", marginBottom: "3rem" }}>
          Featured Projects
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "2rem",
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              {project.featured_image && (
                <img
                  src={project.featured_image || "/placeholder.svg"}
                  alt={project.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              )}

              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{project.title}</h3>

                {project.description && (
                  <p style={{ color: "#4a5568", marginBottom: "1rem", lineHeight: "1.6" }}>{project.description}</p>
                )}

                {project.technologies && project.technologies.length > 0 && (
                  <div style={{ marginBottom: "1rem" }}>
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "#e2e8f0",
                          color: "#4a5568",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          marginRight: "0.5rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", gap: "1rem" }}>
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#4299e1",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                      }}
                    >
                      View Project →
                    </a>
                  )}

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#4a5568",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                      }}
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
