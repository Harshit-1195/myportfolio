import { notFound } from "next/navigation";
import { Blog } from "@/lib/types/common";
import { headers as getHeaders } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Share2, ArrowLeft } from "lucide-react";
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper";
import PageParticles from "@/components/page-particles";

export const revalidate = 3600; // Revalidate every hour (ISR)

async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const headers = await getHeaders();
  const host = headers.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    const res = await fetch(
      `${baseUrl}/api/news?project=Dubai%20Metro%20Rails&type=Article`,
      { next: { revalidate: 3600 } }
    );
    const blogs: Blog[] = await res.json();
    const match = blogs.find((b) => b.slug === slug);
    return match || null;
  } catch (err) {
    console.error("❌ Failed to fetch blog:", err);
    return null;
  }
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogBySlug(params.slug);

  if (!post) return notFound();

  const publishedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <PageParticles />
      <div className="container mx-auto py-28 px-4 max-w-4xl min-h-screen">
        <ScrollRevealWrapper>
          <Link
            href="/blog"
            className="text-white hover:text-white/80 flex items-center gap-2 mb-6"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          <article className="glass-panel p-8 rounded-lg mb-10 hover-glow">
            <div className="mb-6">
              {post.category && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white">
                    {post.category}
                  </span>
                </div>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {post.title}
              </h1>

              <div className="flex items-center text-sm text-white/70 mb-6">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{publishedDate}</span>
                <span className="mx-2">•</span>
                <User className="h-4 w-4 mr-1" />
                <span>{post.by}</span>
              </div>
            </div>

            {post.heroImage && (
              <div className="relative h-[300px] md:h-[400px] w-full mb-8 rounded-lg overflow-hidden">
                <Image
                  src={post.heroImage}
                  alt={post.title || "Blog post"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div
              className="prose prose-invert max-w-none text-white"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="text-white font-medium">{post.by}</span>
                </div>
                <button className="flex items-center gap-2 text-white/80 hover:text-white">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </article>
        </ScrollRevealWrapper>
      </div>
    </>
  );
}
