import Head from "next/head"

interface SEOMetaProps {
  title: string
  description: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
}

export function SEOMeta({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
}: SEOMetaProps) {
  // Default OG image if none provided
  const defaultOgImage = "/og-default.jpg"

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Head>
  )
}
