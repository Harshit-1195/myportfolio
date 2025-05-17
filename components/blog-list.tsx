"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight, Search, Filter, X, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import Pagination from "@/components/pagination"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  author: string
  category: string
  tags: string[]
  published_at: string
  is_published: boolean
  views: number
  created_at: string
  updated_at: string
}

interface BlogListProps {
  initialPosts: BlogPost[]
  currentPage: number
  searchQuery: string
  selectedCategory: string
  dateFilter: string
}

export default function BlogList({
  initialPosts,
  currentPage,
  searchQuery,
  selectedCategory,
  dateFilter,
}: BlogListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(searchQuery)
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts)
  const postsPerPage = 6

  // Update search input when URL parameter changes
  useEffect(() => {
    setSearchInput(searchQuery)
  }, [searchQuery])

  // Extract unique categories from posts
  const categories = ["All", ...Array.from(new Set(initialPosts.map((post) => post.category).filter(Boolean)))]

  const dateFilters = ["All Time", "Last 7 Days", "Last 30 Days", "Last 3 Months", "Last 6 Months", "Last Year"]

  // Helper function to create query string
  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams.toString())

      // Update or remove parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newParams.delete(key)
        } else {
          newParams.set(key, value)
        }
      })

      // Reset to page 1 when filters change
      if (Object.keys(params).some((key) => key !== "page")) {
        newParams.set("page", "1")
      }

      return newParams.toString()
    },
    [searchParams],
  )

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/blog?${createQueryString({ search: searchInput })}`)
  }

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    router.push(`/blog?${createQueryString({ category: category === "All" ? "" : category })}`)
  }

  // Handle date filter selection
  const handleDateFilterChange = (filter: string) => {
    router.push(`/blog?${createQueryString({ date: filter === "All Time" ? "" : filter })}`)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchInput("")
    router.push("/blog")
  }

  // Filter posts based on search, category, and date
  useEffect(() => {
    const filtered = initialPosts.filter((post) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))

      // Category filter
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory

      // Date filter
      let matchesDate = true
      if (post.published_at) {
        const postDate = new Date(post.published_at)
        const now = new Date()

        if (dateFilter === "Last 7 Days") {
          const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7))
          matchesDate = postDate >= sevenDaysAgo
        } else if (dateFilter === "Last 30 Days") {
          const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
          matchesDate = postDate >= thirtyDaysAgo
        } else if (dateFilter === "Last 3 Months") {
          const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3))
          matchesDate = postDate >= threeMonthsAgo
        } else if (dateFilter === "Last 6 Months") {
          const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6))
          matchesDate = postDate >= sixMonthsAgo
        } else if (dateFilter === "Last Year") {
          const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1))
          matchesDate = postDate >= oneYearAgo
        }
      }

      return matchesSearch && matchesCategory && matchesDate
    })

    setFilteredPosts(filtered)
  }, [initialPosts, searchQuery, selectedCategory, dateFilter])

  // Calculate pagination
  const totalPosts = filteredPosts.length
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "All" || dateFilter !== "All Time"

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="glass-panel px-4 py-2 rounded-md text-white flex items-center gap-2 hover-glow"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${isFiltersOpen ? "rotate-180" : ""}`} />
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="glass-panel px-4 py-2 rounded-md text-white flex items-center gap-2 hover-glow"
              aria-label="Clear all filters"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div
        className={`glass-panel p-6 rounded-lg mb-8 transition-all duration-300 ${isFiltersOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden p-0 mb-0"}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div className="col-span-1 md:col-span-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-black/30 border border-white/20 rounded-md py-2 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Search articles"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 glass-panel px-3 py-1 rounded-md text-sm text-white"
              >
                Search
              </button>
            </form>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-white mb-2 text-sm">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-white mb-2 text-sm">Filter by Date</label>
            <select
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {dateFilters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filters Display */}
          <div className="col-span-1 md:col-span-3">
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-white/70 text-sm">Active filters:</span>
                {searchQuery && (
                  <span className="glass-panel text-xs px-2 py-1 rounded-full text-white flex items-center gap-1">
                    Search: {searchQuery}
                    <button
                      onClick={() => router.push(`/blog?${createQueryString({ search: "" })}`)}
                      aria-label="Remove search filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== "All" && (
                  <span className="glass-panel text-xs px-2 py-1 rounded-full text-white flex items-center gap-1">
                    Category: {selectedCategory}
                    <button onClick={() => handleCategoryChange("All")} aria-label="Remove category filter">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {dateFilter !== "All Time" && (
                  <span className="glass-panel text-xs px-2 py-1 rounded-full text-white flex items-center gap-1">
                    Date: {dateFilter}
                    <button onClick={() => handleDateFilterChange("All Time")} aria-label="Remove date filter">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6 text-white/70">
        {totalPosts === 0 ? (
          <p>No posts found. Try adjusting your filters.</p>
        ) : (
          <p>
            Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, totalPosts)} of {totalPosts} posts
          </p>
        )}
      </div>

      {/* Blog posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {currentPosts.map((post, index) => (
          <motion.div
            key={post.id}
            className="glass-panel rounded-lg overflow-hidden hover-glow relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative h-48 w-full">
              <Image
                src={post.featured_image || "/placeholder.svg?height=200&width=400&query=blog"}
                alt={post.title}
                fill
                className="object-cover"
              />
              {post.category && (
                <div className="absolute top-4 right-4 glass-panel text-white text-xs px-2 py-1 rounded">
                  {post.category}
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center text-sm text-white/90 mb-3">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                {post.author && (
                  <>
                    <span className="mx-2">•</span>
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </>
                )}
              </div>
              <h2 className="text-xl font-bold mb-3 text-white">{post.title}</h2>
              <p className="text-white/90 mb-4 line-clamp-3">{post.excerpt}</p>

              <Link
                href={`/blog/${post.slug}`}
                className="text-white font-medium flex items-center gap-1 hover:text-white/80"
              >
                Read Full Article <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show pagination only if there are posts */}
      {totalPosts > 0 && (
        <Pagination
          totalItems={totalPosts}
          itemsPerPage={postsPerPage}
          currentPage={currentPage}
          className="mt-8 mb-12"
        />
      )}
    </>
  )
}
