"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className = "" }: MarkdownProps) {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 text-gray-900">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-semibold mb-3 text-gray-900">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-semibold mb-2 text-gray-900">{children}</h3>,
          p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="mb-4 pl-6 list-disc text-gray-700">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 pl-6 list-decimal text-gray-700">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600">{children}</blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img src={src || "/placeholder.svg"} alt={alt} className="max-w-full h-auto rounded-lg my-4" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-gray-300">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">{children}</th>
          ),
          td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
