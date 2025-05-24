type JsonLdProps = {
  data: Record<string, any>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  )
}

// Article structured data
export function ArticleJsonLd({
  title,
  description,
  authorName,
  publishedTime,
  modifiedTime,
  images = [],
  url,
  publisherName = "Your Name",
  publisherLogo = "/logo.png",
  isAccessibleForFree = true,
}: {
  title: string
  description: string
  authorName: string
  publishedTime: string
  modifiedTime?: string
  images?: string[]
  url: string
  publisherName?: string
  publisherLogo?: string
  isAccessibleForFree?: boolean
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    author: {
      "@type": "Person",
      name: authorName,
    },
    image: images,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    isAccessibleForFree,
  }

  return <JsonLd data={data} />
}

// Project structured data
export function ProjectJsonLd({
  name,
  description,
  images = [],
  url,
  dateCreated,
  creator,
  keywords = [],
}: {
  name: string
  description: string
  images?: string[]
  url: string
  dateCreated: string
  creator: string
  keywords?: string[]
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    image: images,
    url,
    dateCreated,
    creator: {
      "@type": "Person",
      name: creator,
    },
    keywords: keywords.join(", "),
  }

  return <JsonLd data={data} />
}

// Person structured data (for about page)
export function PersonJsonLd({
  name,
  description,
  image,
  jobTitle,
  url,
  sameAs = [],
}: {
  name: string
  description: string
  image: string
  jobTitle: string
  url: string
  sameAs?: string[]
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description,
    image,
    jobTitle,
    url,
    sameAs,
  }

  return <JsonLd data={data} />
}

// FAQ structured data
export function FaqJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[]
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  }

  return <JsonLd data={data} />
}

// BreadcrumbList structured data
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; item: string }[]
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }

  return <JsonLd data={data} />
}

// Service structured data
export function ServiceJsonLd({
  name,
  description,
  provider,
  serviceType,
  url,
}: {
  name: string
  description: string
  provider: string
  serviceType: string
  url: string
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
    },
    serviceType,
    url,
  }

  return <JsonLd data={data} />
}

// Organization structured data
export function OrganizationJsonLd({
  name,
  url,
  logo,
  description,
  sameAs = [],
}: {
  name: string
  url: string
  logo: string
  description: string
  sameAs?: string[]
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    sameAs,
  }

  return <JsonLd data={data} />
}
