"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight, Search, Filter, X, ChevronDown } from "lucide-react"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"
import { motion } from "framer-motion"
import PageParticles from "@/components/page-particles"
import Pagination from "@/components/pagination"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export default function BlogPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get URL parameters
  const currentPage = Number(searchParams.get("page") || "1")
  const searchQuery = searchParams.get("search") || ""
  const selectedCategory = searchParams.get("category") || "All"
  const dateFilter = searchParams.get("date") || "All Time"

  // State for search input (controlled component)
  const [searchInput, setSearchInput] = useState(searchQuery)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Update search input when URL parameter changes
  useEffect(() => {
    setSearchInput(searchQuery)
  }, [searchQuery])

  const postsPerPage = 6

  // Updated blog posts with the new content
  const blogPosts = [
    {
      id: "1",
      slug: "streamline-your-ppc-with-meta-google-automation", // Added slug field
      title: "Streamline Your PPC with Meta & Google Automation",
      excerpt:
        "Managing large pay-per-click (PPC) campaigns across platforms like Google Ads and Meta can be complex and time-consuming. Automating repetitive tasks through scripts and functions is key to simplifying optimization and boosting performance.",
      image: "/digital-advertising-technology.png",
      date: "Jan 18, 2024",
      author: "Harshit Dabhi",
      category: "PPC",
      readTime: "1 min read",
    },
    {
      id: "2",
      slug: "ai-revolution-disrupting-digital-ecosystem", // Added slug field
      title: "The AI Revolution: How Emerging Tools are Disrupting the Digital Ecosystem",
      excerpt:
        "Artificial intelligence (AI) is rapidly transforming the digital ecosystem and changing the way businesses operate. From improving customer experiences to increasing operational efficiency, AI is disrupting every industry and creating new opportunities for growth.",
      image: "/ai-digital-marketing.png",
      date: "Feb 24, 2023",
      author: "Harshit Dabhi",
      category: "AI",
      readTime: "3 min read",
    },
    {
      id: "3",
      slug: "the-rise-of-chatgpt-from-ai-model-to-overnight-sensation",
      title: "The Rise of ChatGPT: From AI Model to Overnight Sensation",
      excerpt:
        "ChatGPT, an artificial intelligence language model developed by OpenAI, has recently taken the internet by storm. From social media to news outlets, people can't stop talking about this impressive AI technology.",
      image: "/data-analytics-dashboard.png",
      date: "Feb 24, 2023",
      author: "Harshit Dabhi",
      category: "AI",
      readTime: "2 min read",
    },
    {
      id: "4",
      slug: "the-future-of-marketing-is-in-the-metaverse",
      title: "The Future of Marketing is in the Metaverse: How Brands Can Engage in Virtual Reality",
      excerpt:
        "The metaverse is a virtual world where users can interact with each other and with virtual objects and experiences. Marketing in the metaverse can take many forms, depending on the specific platform and the goals of the marketing campaign.",
      image: "/digital-billboard-city.png",
      date: "Feb 24, 2023",
      author: "Harshit Dabhi",
      category: "Metaverse",
      readTime: "2 min read",
    },
    {
      id: "5",
      slug: "is-your-brand-ready-for-the-next-era-of-the-web-web3",
      title: "Is Your Brand Ready for the Next Era of the Web? WEB3.0",
      excerpt:
        "The evolution of the internet has been fascinating. From its early days of web 1.0, where it was simply a broadcast of information, to web 2.0 where we saw the rise of social media and two-way communication, we've come a long way.",
      image: "/audience-segmentation-marketing.png",
      date: "Feb 24, 2023",
      author: "Harshit Dabhi",
      category: "Web3",
      readTime: "1 min read",
    },
    {
      id: "6",
      slug: "where-user-experience-meets-customer-experience",
      title: "Where User Experience Meets Customer Experience: The Perfect Blend for Business Success",
      excerpt:
        "The realm of User Experience (UX) is just one aspect of the broader concept of Customer Experience (CX). UX refers to the experience a customer has with digital products and services, which can be measured by metrics such as bounce rate.",
      image: "/digital-privacy-cookies.png",
      date: "Feb 24, 2023",
      author: "Harshit Dabhi",
      category: "UX/CX",
      readTime: "1 min read",
    },
    {
      id: "7",
      slug: "the-advertising-bible-6-timeless-tips-from-david-ogilvy",
      title: "The Advertising Bible: 6 Timeless Tips from David Ogilvy, the King of Copywriting",
      excerpt:
        "David Ogilvy is a legendary figure in the advertising world, and his 1982 manifesto 'How to create advertising that sells' is still relevant today. Here are six of his top tips that you can use to create effective advertising.",
      image: "/ai-digital-marketing.png",
      date: "Feb 24, 2023",
      author: "Harshit Dabhi",
      category: "Advertising",
      readTime: "1 min read",
    },
    {
      id: "8",
      slug: "unlocking-the-secrets-of-successful-entrepreneurs",
      title: "Unlocking the Secrets of Successful Entrepreneurs: Lessons From the Best in Business",
      excerpt:
        "Marketing has been a vital tool for businesses to create brand awareness, drive sales, and achieve growth. Here are eight timeless marketing lessons from some of the most iconic brands in history.",
      image: "/data-attribution-models.png",
      date: "Feb 24, 2023",
      author: "Harshit Dabhi",
      category: "Entrepreneurship",
      readTime: "2 min read",
    },
    {
      id: "9",
      slug: "apples-winning-strategy-the-rise-of-ar",
      title: "Apple's Winning Strategy: The Rise of AR and the Power of Ecosystem Expansion",
      excerpt:
        "Apple's market capitalization has grown from $1 trillion to $3 trillion since August 2018. Despite delivering remarkable results, Tim Cook's product strategy often remains misunderstood.",
      image: "/social-media-advertising.png",
      date: "Feb 24, 2023",
      author: "Harshit Dabhi",
      category: "Strategy",
      readTime: "2 min read",
    },
    {
      id: "10",
      slug: "unlocking-the-secrets-5-keys-to-creating-a-cult-like-brand",
      title: "Unlocking the Secrets: 5 Keys to Creating a Cult-Like Brand",
      excerpt:
        "Nike, Tesla, Apple, and Harley Davidson all share a unique trait - they have a cult-like following. These brands have left their competitors behind and have created an enviable fan base.",
      image: "/privacy-marketing.png",
      date: "Feb 24, 2023",
      author: "Harshit Dabhi",
      category: "Branding",
      readTime: "2 min read",
    },
    {
      id: "11",
      slug: "boost-your-roi-with-these-7-easy-site-optimization-hacks",
      title: "Boost Your ROI with These 7 Easy Site Optimization Hacks",
      excerpt:
        "Small changes to your website can have a significant impact on your return on investment (ROI). Eye-tracking studies show how users scan web pages, and optimizing for this can increase conversion rates.",
      image: "/landing-page-optimization.png",
      date: "Feb 20, 2023",
      author: "Harshit Dabhi",
      category: "Optimization",
      readTime: "2 min read",
    },
    {
      id: "12",
      slug: "7-game-changing-tips-to-master-business-writing",
      title: "7 Game-Changing Tips to Master Business Writing and Sell Anything to Anyone",
      excerpt:
        "Business writing is an essential aspect of any successful company. With copywriting, you can sell water to a fish. Here are seven tips to help you win at business writing.",
      image: "/email-marketing-future.png",
      date: "Feb 20, 2023",
      author: "Harshit Dabhi",
      category: "Copywriting",
      readTime: "1 min read",
    },
    {
      id: "13",
      slug: "10-tips-to-transform-your-landing-page-from-bland-to-grand",
      title: "10 Tips to Transform Your Landing Page From Bland to Grand",
      excerpt:
        "Your landing page is like the bouncer at a crowded club - it can either let people in and get the party started or turn them away, killing the vibe before it even begins.",
      image: "/landing-page-optimization.png",
      date: "Feb 20, 2023",
      author: "Harshit Dabhi",
      category: "Landing Pages",
      readTime: "2 min read",
    },
    {
      id: "14",
      slug: "free-the-four-letter-word-that-makes-us-lose-our-minds",
      title: "Free: The Four-Letter Word That Makes Us Lose Our Minds (and Wallets)",
      excerpt:
        "Picture this: you're strolling through the supermarket, and the sweet smell of freshly baked cookies hits your nostrils. Your inner cookie monster is unleashed, and you head straight for the cookie stand.",
      image: "/data-personalization.png",
      date: "Feb 20, 2023",
      author: "Harshit Dabhi",
      category: "Psychology",
      readTime: "2 min read",
    },
    {
      id: "15",
      slug: "unlocking-growth-6-key-user-behaviors-you-need-to-know",
      title: "Unlocking Growth: 6 Key User Behaviors You Need to Know",
      excerpt:
        "In the competitive world of business, driving growth requires more than just a great product or service. It takes a deep understanding of user behavior and the ability to leverage it effectively.",
      image: "/b2b-marketing-trends.png",
      date: "Feb 20, 2023",
      author: "Harshit Dabhi",
      category: "Growth",
      readTime: "1 min read",
    },
    {
      id: "16",
      slug: "apples-visual-cheat-code-the-power-of-compelling-copy",
      title: "Apple's Visual Cheat Code: The Power of Compelling Copy and Complementing Imagery",
      excerpt:
        "The power of compelling copy and complementary visuals cannot be overstated when it comes to helping consumers understand and visualize your product. And nobody does this better than Apple.",
      image: "/abstract-fruit-design.png",
      date: "Feb 20, 2023",
      author: "Harshit Dabhi",
      category: "Design",
      readTime: "1 min read",
    },
    {
      id: "17",
      slug: "balancing-innovation-and-privacy-navigating-the-tension",
      title: "Balancing Innovation and Privacy: Navigating the Tension in the Digital Economy",
      excerpt:
        "Innovation and digital privacy are two concepts that are becoming increasingly intertwined in our modern digital age. As companies rely more and more on the collection and analysis of large amounts of data.",
      image: "/digital-privacy-innovation.png",
      date: "Feb 20, 2023",
      author: "Harshit Dabhi",
      category: "Privacy",
      readTime: "1 min read",
    },
    {
      id: "18",
      slug: "media-consumption-habits-consumer-behavior-insights",
      title: "Media Consumption Habits & Consumer Behavior: Insights into the Impact of Covid-19",
      excerpt:
        "The global coronavirus pandemic has undoubtedly created a challenging business climate, forcing companies to face new and unprecedented obstacles.",
      image: "/covid-consumer-behavior.png",
      date: "Feb 20, 2023",
      author: "Harshit Dabhi",
      category: "Consumer Behavior",
      readTime: "1 min read",
    },
    {
      id: "19",
      slug: "unleashing-the-power-of-big-data-the-future-trends",
      title: "Unleashing the Power of Big Data: The Future Trends in Digital Communication",
      excerpt:
        "The digital communication landscape is rapidly evolving and with the rise of big data, the potential for understanding and better targeting key audiences is enormous.",
      image: "/big-data-digital-communication.png",
      date: "Feb 20, 2023",
      author: "Harshit Dabhi",
      category: "Big Data",
      readTime: "1 min read",
    },
    {
      id: "20",
      slug: "unlocking-digital-marketing-success-why-your-organizations-maturity",
      title: "Unlocking Digital Marketing Success: Why Your Organization's Maturity Level Matters",
      excerpt:
        "According to research, digital marketing maturity levels differ significantly among marketing organizations, and so do the results they achieve.",
      image: "/digital-marketing-maturity.png",
      date: "Feb 20, 2023",
      author: "Harshit Dabhi",
      category: "Digital Marketing",
      readTime: "1 min read",
    },
  ]

  const categories = [
    "All",
    "PPC",
    "AI",
    "Metaverse",
    "Web3",
    "UX/CX",
    "Advertising",
    "Entrepreneurship",
    "Strategy",
    "Branding",
    "Optimization",
    "Copywriting",
    "Landing Pages",
    "Psychology",
    "Growth",
    "Design",
    "Privacy",
    "Consumer Behavior",
    "Big Data",
    "Digital Marketing",
  ]

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
  const filterPosts = () => {
    return blogPosts.filter((post) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory

      // Date filter (simplified for demo - in real app, use actual date comparison)
      let matchesDate = true
      const postDate = new Date(post.date)
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

      return matchesSearch && matchesCategory && matchesDate
    })
  }

  const filteredPosts = filterPosts()

  // Calculate pagination
  const totalPosts = filteredPosts.length
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "All" || dateFilter !== "All Time"

  return (
    <>
      <PageParticles />
      <div className="container mx-auto py-28 px-4 max-w-6xl bg-black min-h-screen blog-page">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Blog</h1>

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

        <ScrollRevealWrapper>
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

          <div className="glass-panel p-8 rounded-lg mb-10 hover-glow">
            <p className="text-white/90 mb-6">
              Insights, strategies, and industry trends in digital marketing, technology, and business growth.
            </p>

            <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    category === selectedCategory
                      ? "glass-panel text-white hover-glow"
                      : "glass-panel text-white/90 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
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
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  <div className="absolute top-4 right-4 glass-panel text-white text-xs px-2 py-1 rounded">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-white/90 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-white">{post.title}</h2>
                  <p className="text-white/90 mb-4 line-clamp-3">{post.excerpt}</p>

                  <Link
                    href={`/blog/${post.slug || post.id}`} // Use slug if available, fallback to id
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
        </ScrollRevealWrapper>
      </div>
    </>
  )
}
