"use client"

// Remove the contentlayer import
// import { useMDXComponent } from "next-contentlayer/hooks"

interface MDXContentProps {
  code: string
}

export function MDXContent({ code }: MDXContentProps) {
  // Simple implementation that doesn't rely on contentlayer
  return <div dangerouslySetInnerHTML={{ __html: code }} />
}
