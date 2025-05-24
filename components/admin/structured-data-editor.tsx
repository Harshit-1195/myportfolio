"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface StructuredDataEditorProps {
  initialData?: Record<string, any>
  onSave: (data: Record<string, any>) => void
  contentType: "article" | "project" | "person" | "organization" | "service" | "faq"
}

export function StructuredDataEditor({ initialData, onSave, contentType }: StructuredDataEditorProps) {
  const [jsonData, setJsonData] = useState<string>(
    initialData ? JSON.stringify(initialData, null, 2) : getDefaultStructuredData(contentType),
  )
  const [error, setError] = useState<string | null>(null)

  function getDefaultStructuredData(type: string): string {
    switch (type) {
      case "article":
        return JSON.stringify(
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Article Title",
            description: "Article description",
            author: {
              "@type": "Person",
              name: "Author Name",
            },
            image: ["https://example.com/image.jpg"],
            datePublished: new Date().toISOString(),
            publisher: {
              "@type": "Organization",
              name: "Publisher Name",
              logo: {
                "@type": "ImageObject",
                url: "https://example.com/logo.png",
              },
            },
          },
          null,
          2,
        )
      case "project":
        return JSON.stringify(
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: "Project Name",
            description: "Project description",
            image: ["https://example.com/image.jpg"],
            dateCreated: new Date().toISOString(),
            creator: {
              "@type": "Person",
              name: "Creator Name",
            },
          },
          null,
          2,
        )
      // Add other content types as needed
      default:
        return "{}"
    }
  }

  const handleSave = () => {
    try {
      const parsedData = JSON.parse(jsonData)
      setError(null)
      onSave(parsedData)
    } catch (err) {
      setError("Invalid JSON format")
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor">JSON-LD Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <Textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            className="font-mono h-80"
            placeholder="Enter JSON-LD structured data"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <Button onClick={handleSave} className="mt-4">
            Save Structured Data
          </Button>
        </TabsContent>
        <TabsContent value="preview">
          <div className="bg-gray-800 p-4 rounded-md overflow-auto h-80">
            <pre className="text-white text-sm">{jsonData}</pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
