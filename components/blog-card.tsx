"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface BlogCardProps {
  post: {
    id: string
    title: string
    excerpt: string
    image: string
    date: string
    author: string
    category: string
    readTime: string
  }
  index: number
  showCategory?: boolean
  showExcerpt?: boolean
  showAuthor?: boolean
}

export default function BlogCard({
  post,
  index,
  showCategory = true,
  showExcerpt = false,
  showAuthor = true,
}: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link href={`/blog/${post.id}`} className="glass-panel rounded-lg overflow-hidden hover-glow block h-full">
        <div className="relative h-40 w-full">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          {showCategory && post.category && (
            <div className="absolute top-2 right-2 glass-panel text-white text-xs px-2 py-1 rounded">
              {post.category}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center text-xs text-white/70 mb-2">
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <span>{post.readTime}</span>
            {showAuthor && (
              <>
                <span className="mx-2">•</span>
                <span>{post.author}</span>
              </>
            )}
          </div>
          <h3 className="text-lg font-bold mb-2 text-white line-clamp-2">{post.title}</h3>
          {showExcerpt && <p className="text-white/70 text-sm mb-3 line-clamp-2">{post.excerpt}</p>}
          <div className="text-white font-medium flex items-center gap-1 hover:text-white/80 text-sm mt-auto">
            Read Article <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
