"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Share2, ArrowRight } from "lucide-react"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"
import PageParticles from "@/components/page-particles"

export default function BlogPost() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const post = {
    title: "The Future of Programmatic Advertising in 2024",
    excerpt: "Explore the latest trends and technologies shaping programmatic advertising in 2024.",
    content: `
      <h2>Introduction</h2>
      <p>Programmatic advertising has evolved significantly over the past decade, transforming from a niche technology to the dominant method of digital ad buying. As we move through 2024, several key trends and technologies are reshaping the programmatic landscape, offering new opportunities and challenges for advertisers and publishers alike.</p>
      
      <h2>AI and Machine Learning Advancements</h2>
      <p>Artificial intelligence and machine learning continue to revolutionize programmatic advertising. In 2024, we're seeing more sophisticated algorithms that can predict user behavior with unprecedented accuracy. These AI systems can now analyze thousands of data points in milliseconds to determine the optimal bid for each impression, taking into account factors like user intent, historical performance, and contextual relevance.</p>
      <p>Moreover, AI is enabling more effective creative optimization, automatically adjusting ad elements like headlines, images, and calls-to-action based on performance data. This dynamic creative optimization (DCO) is becoming increasingly sophisticated, allowing for truly personalized advertising experiences at scale.</p>
      
      <h2>Cookieless Targeting Solutions</h2>
      <p>With third-party cookies being phased out, the industry has been developing alternative targeting solutions. In 2024, we're seeing the widespread adoption of contextual targeting 2.0, which uses AI to understand page content and user intent rather than relying on user tracking. First-party data strategies have also matured, with brands building robust data collection systems and leveraging customer data platforms (CDPs) to activate this information programmatically.</p>
      <p>Universal IDs and cohort-based targeting approaches like Google's Topics API are gaining traction as privacy-compliant alternatives to traditional cookie-based targeting. These solutions aim to balance personalization with privacy, allowing advertisers to reach relevant audiences without compromising user data.</p>
      
      <h2>Connected TV and Digital Out-of-Home Growth</h2>
      <p>Programmatic is expanding beyond traditional display and video advertising. Connected TV (CTV) has seen explosive growth, with more inventory becoming available programmatically. The ability to target specific households and measure results is making CTV an increasingly attractive channel for advertisers looking to combine the impact of television with the precision of digital.</p>
      <p>Similarly, digital out-of-home (DOOH) advertising is being integrated into programmatic buying platforms, allowing advertisers to purchase billboard and signage inventory through the same systems they use for online campaigns. This omnichannel approach is creating new opportunities for cross-channel storytelling and attribution.</p>
      
      <h2>Supply Path Optimization and Transparency</h2>
      <p>Supply path optimization (SPO) has evolved from a buzzword to a critical component of programmatic strategy. Advertisers are demanding greater transparency into the supply chain, including fees, data usage, and inventory quality. In response, DSPs and agencies are developing more sophisticated tools to identify the most efficient paths to inventory, reducing costs and improving performance.</p>
      <p>Blockchain technology is also being applied to programmatic advertising, creating immutable records of transactions and helping to combat fraud. These transparency initiatives are crucial for building trust in the programmatic ecosystem and ensuring that advertisers' budgets are being spent effectively.</p>
      
      <h2>Retail Media Networks</h2>
      <p>One of the most significant developments in programmatic advertising is the rise of retail media networks. Major retailers like Amazon, Walmart, and Target have built sophisticated advertising platforms that leverage their first-party customer data. These platforms allow brands to reach consumers at the point of purchase, creating powerful opportunities for targeted advertising.</p>
      <p>In 2024, we're seeing these retail media networks expand their offerings to include off-site advertising, allowing brands to reach consumers across the web using the retailer's data. This convergence of e-commerce and advertising is creating new opportunities for brands to connect with consumers throughout the purchase journey.</p>
      
      <h2>Conclusion</h2>
      <p>The programmatic advertising landscape continues to evolve rapidly, driven by technological innovation, privacy regulations, and changing consumer behavior. As we move through 2024, advertisers who stay ahead of these trends and adapt their strategies accordingly will be well-positioned to succeed in this dynamic environment.</p>
      <p>The future of programmatic advertising is not just about automation and efficiency—it's about creating more relevant, engaging, and effective advertising experiences for consumers while respecting their privacy and preferences. By embracing these emerging technologies and approaches, advertisers can unlock the full potential of programmatic advertising in 2024 and beyond.</p>
    `,
    published_at: "April 2, 2024",
    author: "Harshit Dabhi",
    category: "Programmatic",
    tags: ["Programmatic", "Advertising", "AI", "Technology", "Digital Marketing"],
    featured_image: "/digital-advertising-technology.png",
  }

  // Related posts
  const relatedPosts = [
    {
      id: "maximizing-roi-omnichannel-media-buying",
      title: "Maximizing ROI with Omnichannel Media Buying",
      featured_image: "/omnichannel-marketing.png",
    },
    {
      id: "data-driven-decision-making-digital-marketing",
      title: "Data-Driven Decision Making in Digital Marketing",
      featured_image: "/data-analytics-dashboard.png",
    },
    {
      id: "ai-digital-marketing",
      title: "The AI Revolution in Digital Marketing",
      featured_image: "/ai-digital-marketing.png",
    },
  ]

  return (
    <>
      <PageParticles />
      <div className="container mx-auto py-28 px-4 max-w-4xl min-h-screen">
        <ScrollRevealWrapper>
          <Link href="/blog" className="text-white hover:text-white/80 flex items-center gap-2 mb-6">
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          <article className="glass-panel p-8 rounded-lg mb-10 hover-glow">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.category && (
                  <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white">{post.category}</span>
                )}
                {post.tags &&
                  post.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs bg-white/5 text-white/80">
                      {tag}
                    </span>
                  ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>

              <div className="flex items-center text-sm text-white/70 mb-6">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{post.published_at}</span>
                {post.author && (
                  <>
                    <span className="mx-2">•</span>
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </>
                )}
              </div>
            </div>

            {post.featured_image && (
              <div className="relative h-[300px] md:h-[400px] w-full mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="text-white font-medium">{post.author}</span>
                </div>
                <button className="flex items-center gap-2 text-white/80 hover:text-white">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </article>

          {relatedPosts.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost, index) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.id}`}
                    className="glass-panel rounded-lg overflow-hidden hover-glow block"
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={relatedPost.featured_image || "/placeholder.svg?height=160&width=320&query=blog"}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2 text-white line-clamp-2">{relatedPost.title}</h3>
                      <div className="text-white font-medium flex items-center gap-1 hover:text-white/80 text-sm">
                        Read Article <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </ScrollRevealWrapper>
      </div>
    </>
  )
}
