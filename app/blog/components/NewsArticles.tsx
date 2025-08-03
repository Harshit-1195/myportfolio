"use client";

import { useEffect, useState } from "react";
import { Blog } from "@/lib/types/common";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import AnimatedHeading from "@/components/animated-heading";

export default function NewsSection() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        const sorted = Array.isArray(data)
          ? [...data].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
          : [];
        setPosts(sorted.slice(0, 3));
      })
      .catch((err) => console.error("Error fetching articles", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !posts.length) return null;

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-12">
          <AnimatedHeading
            text="Latest Articles"
            className="text-3xl md:text-4xl font-light text-gradient"
          />
          <Link href="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white/70 hover:text-white flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              className="glass-panel rounded-lg overflow-hidden hover-lift"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={post.heroImage || "/placeholder.svg"}
                  alt="Article Image"
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-white mb-2">{post.title}</h3>
                <p className="text-white/70 mb-4">{post.metaDescription}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(post.category?.split(",") || []).map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full glass-panel text-white/80"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="text-white/70 hover:text-white flex items-center gap-1 transition-colors text-sm"
                  >
                    Read More <ArrowRight className="h-3 w-3" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
