"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/file-upload"
import { Search, Globe, ImageIcon, RefreshCw } from "lucide-react"

interface SEOFieldsProps {
  title: string
  description: string
  canonicalUrl: string
  ogImage: string | null
  contentTitle: string // The main content title to use as a base
  contentExcerpt: string // The main content excerpt to use as a base
  slug: string // The content slug
  baseUrl: string // The base URL for the content type (e.g., "/blog/")
  onUpdate: (fields: {
    seoTitle: string
    seoDescription: string
    canonicalUrl: string
    ogImage: string | null
  }) => void
}

export function SEOFields({
  title,
  description,
  canonicalUrl,
  ogImage,
  contentTitle,
  contentExcerpt,
  slug,
  baseUrl,
  onUpdate,
}: SEOFieldsProps) {
  const [seoTitle, setSeoTitle] = useState(title || "")
  const [seoDescription, setSeoDescription] = useState(description || "")
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState(canonicalUrl || "")
  const [seoOgImage, setSeoOgImage] = useState(ogImage || "")

  // Generate SEO title based on content title
  const generateSeoTitle = () => {
    if (!contentTitle) return
    // Typically SEO titles should be 50-60 characters
    let generatedTitle = contentTitle
    if (generatedTitle.length > 60) {
      generatedTitle = generatedTitle.substring(0, 57) + "..."
    }
    setSeoTitle(generatedTitle)
    handleUpdate({ seoTitle: generatedTitle })
  }

  // Generate SEO description based on content excerpt
  const generateSeoDescription = () => {
    if (!contentExcerpt) return
    // Meta descriptions should be 150-160 characters
    let generatedDescription = contentExcerpt
    if (generatedDescription.length > 160) {
      generatedDescription = generatedDescription.substring(0, 157) + "..."
    }
    setSeoDescription(generatedDescription)
    handleUpdate({ seoDescription: generatedDescription })
  }

  // Generate canonical URL based on slug
  const generateCanonicalUrl = () => {
    if (!slug) return
    const url = `${window.location.origin}${baseUrl}${slug}`
    setSeoCanonicalUrl(url)
    handleUpdate({ canonicalUrl: url })
  }

  // Handle image upload completion
  const handleImageUpload = (result: { url: string }) => {
    setSeoOgImage(result.url)
    handleUpdate({ ogImage: result.url })
  }

  // Update parent component with changes
  const handleUpdate = (
    fields: Partial<{
      seoTitle: string
      seoDescription: string
      canonicalUrl: string
      ogImage: string | null
    }>,
  ) => {
    onUpdate({
      seoTitle: fields.seoTitle !== undefined ? fields.seoTitle : seoTitle,
      seoDescription: fields.seoDescription !== undefined ? fields.seoDescription : seoDescription,
      canonicalUrl: fields.canonicalUrl !== undefined ? fields.canonicalUrl : seoCanonicalUrl,
      ogImage: fields.ogImage !== undefined ? fields.ogImage : seoOgImage,
    })
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Search className="h-5 w-5 mr-2" />
          SEO Settings
        </CardTitle>
        <CardDescription className="text-gray-400">
          Optimize your content for search engines and social sharing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="seoTitle" className="text-gray-200">
              SEO Title
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateSeoTitle}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Generate from title
            </Button>
          </div>
          <Input
            id="seoTitle"
            value={seoTitle}
            onChange={(e) => {
              setSeoTitle(e.target.value)
              handleUpdate({ seoTitle: e.target.value })
            }}
            placeholder="SEO optimized title (50-60 characters)"
            className="bg-gray-700 border-gray-600 text-white"
            maxLength={100}
          />
          <div className="flex justify-end">
            <span className={`text-xs ${seoTitle.length > 60 ? "text-red-400" : "text-gray-400"}`}>
              {seoTitle.length}/100 (50-60 recommended)
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="seoDescription" className="text-gray-200">
              Meta Description
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateSeoDescription}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Generate from excerpt
            </Button>
          </div>
          <Textarea
            id="seoDescription"
            value={seoDescription}
            onChange={(e) => {
              setSeoDescription(e.target.value)
              handleUpdate({ seoDescription: e.target.value })
            }}
            placeholder="SEO optimized description (150-160 characters)"
            className="bg-gray-700 border-gray-600 text-white"
            maxLength={160}
            rows={3}
          />
          <div className="flex justify-end">
            <span className={`text-xs ${seoDescription.length > 160 ? "text-red-400" : "text-gray-400"}`}>
              {seoDescription.length}/160
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="canonicalUrl" className="text-gray-200 flex items-center">
              <Globe className="h-4 w-4 mr-1" />
              Canonical URL
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateCanonicalUrl}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Generate URL
            </Button>
          </div>
          <Input
            id="canonicalUrl"
            value={seoCanonicalUrl}
            onChange={(e) => {
              setSeoCanonicalUrl(e.target.value)
              handleUpdate({ canonicalUrl: e.target.value })
            }}
            placeholder="https://yourdomain.com/content-path"
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-200 flex items-center">
            <ImageIcon className="h-4 w-4 mr-1" />
            Social Sharing Image (OG Image)
          </Label>

          {seoOgImage ? (
            <div className="space-y-2">
              <img
                src={seoOgImage || "/placeholder.svg"}
                alt="OG Preview"
                className="w-full h-32 object-cover rounded-md"
              />
              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => {
                    setSeoOgImage("")
                    handleUpdate({ ogImage: null })
                  }}
                >
                  Remove
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300"
                  onClick={() => window.open(seoOgImage, "_blank")}
                >
                  View
                </Button>
              </div>
            </div>
          ) : (
            <FileUpload bucket="assets" folder="og-images" accept="image/*" onUploadComplete={handleImageUpload} />
          )}
          <p className="text-xs text-gray-400">Recommended size: 1200×630 pixels</p>
        </div>

        <div className="bg-gray-900 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Search Preview</h4>
          <div className="space-y-1">
            <div className="text-blue-400 text-base font-medium line-clamp-1">
              {seoTitle || "Your SEO Title Will Appear Here"}
            </div>
            <div className="text-green-500 text-xs line-clamp-1">
              {seoCanonicalUrl || "https://yourdomain.com/your-page"}
            </div>
            <div className="text-gray-400 text-sm line-clamp-2">
              {seoDescription ||
                "Your meta description will appear here. Make it compelling to increase click-through rates."}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
