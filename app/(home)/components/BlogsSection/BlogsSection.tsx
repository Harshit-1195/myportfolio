"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
// import { MemoizedAnimatedHeading } from "@/components/animated-heading";
// import { MemoizedSectionTransition } from "@/components/section-transition";

const posts = [
  {
    title: "The Future of Programmatic Advertising in 2024",
    excerpt: "Explore the latest trends and technologies shaping programmatic advertising in 2024.",
    date: "April 2, 2024",
    category: "Programmatic",
    slug: "future-programmatic-advertising-2024",
  },
  {
    title: "Maximizing ROI with Omnichannel Media Buying",
    excerpt: "Learn how to create cohesive campaigns across multiple channels to maximize your marketing ROI.",
    date: "March 15, 2024",
    category: "Media Buying",
    slug: "maximizing-roi-omnichannel-media-buying",
  },
  {
    title: "Data-Driven Decision Making in Digital Marketing",
    excerpt: "Discover how to leverage analytics tools to make informed marketing decisions that drive results.",
    date: "February 28, 2024",
    category: "Analytics",
    slug: "data-driven-decision-making-digital-marketing",
  },
];

export function BlogsSection() {
  return (
    <MemoizedSectionTransition className="py-20 px-4 md:px-10">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-12">
          <MemoizedAnimatedHeading
            text="Latest Insights"
            className="text-3xl md:text-4xl font-light text-gradient"
          />
          <Link href="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white/70 hover:text-white flex items-center gap-1 transition-colors"
            >
              View All Posts <ChevronRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              className="glass-panel rounded-lg overflow-hidden hover-lift"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs px-2 py-1 rounded-full glass-panel text-white/80">
                    {post.category}
                  </span>
                  <span className="text-white/50 text-xs">{post.date}</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">{post.title}</h3>
                <p className="text-white/70 mb-4">{post.excerpt}</p>
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
    </MemoizedSectionTransition>
  );
}
