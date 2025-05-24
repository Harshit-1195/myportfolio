import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Tag, Award, CheckCircle } from "lucide-react"
import { ScrollRevealWrapper } from "@/components/scroll-reveal-wrapper"
import PageParticles from "@/components/page-particles"
import { BackToHomeAlt } from "@/components/back-to-home-alt"
import { ProjectJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"

async function getCaseStudy(slug: string) {
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase.from("case_studies").select("*").eq("slug", slug).single()

  if (!data) {
    notFound()
  }

  return data
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const caseStudy = await getCaseStudy(params.slug)

  // Use SEO fields if available, otherwise fall back to regular content
  const seoTitle = caseStudy.seo_title || caseStudy.title
  const seoDescription = caseStudy.seo_description || caseStudy.challenge.substring(0, 160)
  const canonicalUrl = caseStudy.canonical_url || `${process.env.NEXT_PUBLIC_BASE_URL}/case-study/${caseStudy.slug}`
  const ogImage = caseStudy.og_image || caseStudy.image

  // Format date for structured data
  const projectDate = caseStudy.date ? new Date(caseStudy.date).toISOString() : new Date().toISOString()

  return (
    <>
      <ProjectJsonLd
        name={seoTitle}
        description={seoDescription}
        images={caseStudy.image ? [caseStudy.image] : []}
        url={canonicalUrl}
        dateCreated={projectDate}
        creator={caseStudy.client || "Your Name"}
        keywords={caseStudy.tags || []}
      />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${process.env.NEXT_PUBLIC_BASE_URL}/` },
          { name: "Case Studies", item: `${process.env.NEXT_PUBLIC_BASE_URL}/case-study` },
          { name: caseStudy.title, item: canonicalUrl },
        ]}
      />

      <PageParticles />
      <div className="container mx-auto py-28 px-4">
        {/* Back button */}
        <BackToHomeAlt />

        {/* Hero section */}
        <ScrollRevealWrapper>
          <div className="glass-panel rounded-lg overflow-hidden mb-12">
            <div className="relative h-[400px] w-full">
              <Image src={caseStudy.image || "/placeholder.svg"} alt={caseStudy.title} fill className="object-cover" />
            </div>
            <div className="p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{caseStudy.title}</h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-white/70">
                  <User className="h-4 w-4" />
                  <span>Client: {caseStudy.client}</span>
                </div>
                {caseStudy.date && (
                  <div className="flex items-center gap-2 text-white/70">
                    <Calendar className="h-4 w-4" />
                    <span>{caseStudy.date}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-white/70">
                  <Tag className="h-4 w-4" />
                  <span>{caseStudy.category}</span>
                </div>
              </div>

              {caseStudy.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {caseStudy.tags.map((tag: string, index: number) => (
                    <span key={index} className="text-xs px-2 py-1 rounded-full glass-panel text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollRevealWrapper>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - 2/3 width */}
          <div className="lg:col-span-2">
            {/* Challenge section */}
            <ScrollRevealWrapper>
              <div className="glass-panel rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-white">The Challenge</h2>
                <p className="text-white/70">{caseStudy.challenge}</p>
              </div>
            </ScrollRevealWrapper>

            {/* Approach section */}
            {caseStudy.approach && (
              <ScrollRevealWrapper>
                <div className="glass-panel rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">Our Approach</h2>
                  <ul className="space-y-2">
                    {caseStudy.approach.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-white/70">
                        <CheckCircle className="h-5 w-5 text-white/50 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollRevealWrapper>
            )}

            {/* Solution section */}
            <ScrollRevealWrapper>
              <div className="glass-panel rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-white">The Solution</h2>
                <p className="text-white/70">{caseStudy.solution}</p>
              </div>
            </ScrollRevealWrapper>

            {/* Implementation section */}
            {caseStudy.implementation && (
              <ScrollRevealWrapper>
                <div className="glass-panel rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">Implementation Process</h2>
                  <div className="space-y-6">
                    {caseStudy.implementation.map((phase: any, index: number) => (
                      <div key={index}>
                        <h3 className="text-xl font-semibold mb-3 text-white">{phase.phase}</h3>
                        <ul className="space-y-2">
                          {phase.tasks.map((task: string, taskIndex: number) => (
                            <li key={taskIndex} className="flex items-start gap-2 text-white/70">
                              <CheckCircle className="h-5 w-5 text-white/50 flex-shrink-0 mt-0.5" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollRevealWrapper>
            )}
          </div>

          {/* Right column - 1/3 width */}
          <div>
            {/* Results section */}
            <ScrollRevealWrapper>
              <div className="glass-panel rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-white">Results</h2>
                <ul className="space-y-3">
                  {caseStudy.results.map((result: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                      <span className="text-white/70">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollRevealWrapper>

            {/* Technologies section */}
            {caseStudy.technologies && (
              <ScrollRevealWrapper>
                <div className="glass-panel rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">Technologies Used</h2>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.technologies.map((tech: string, index: number) => (
                      <span key={index} className="text-sm px-3 py-1 rounded-full glass-panel text-white/80">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollRevealWrapper>
            )}

            {/* Features section */}
            {caseStudy.features && (
              <ScrollRevealWrapper>
                <div className="glass-panel rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">Key Features</h2>
                  <ul className="space-y-2">
                    {caseStudy.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-white/70">
                        <CheckCircle className="h-5 w-5 text-white/50 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollRevealWrapper>
            )}

            {/* Testimonial section */}
            {caseStudy.testimonial && (
              <ScrollRevealWrapper>
                <div className="glass-panel rounded-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">Client Testimonial</h2>
                  <blockquote className="border-l-2 border-white/20 pl-4 italic text-white/70">
                    "{caseStudy.testimonial.quote}"
                  </blockquote>
                  <p className="text-right text-white/50 mt-4">— {caseStudy.testimonial.author}</p>
                </div>
              </ScrollRevealWrapper>
            )}
          </div>
        </div>

        {/* CTA section */}
        <ScrollRevealWrapper>
          <div className="glass-panel rounded-lg p-8 text-center mt-12">
            <h2 className="text-2xl font-bold mb-4 text-white">Ready to Start Your Project?</h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Let's discuss how we can help you achieve similar results for your business.
            </p>
            <Link href="/contact">
              <button className="px-6 py-3 rounded-lg glass-panel text-white hover-glow border-white/20 hover:bg-white/10">
                Get in Touch
              </button>
            </Link>
          </div>
        </ScrollRevealWrapper>
      </div>
    </>
  )
}
