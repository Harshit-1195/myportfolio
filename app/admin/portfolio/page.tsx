"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Save, Plus } from "lucide-react"
import { motion } from "framer-motion"

interface PortfolioImage {
  id: number
  image: string
  caption: string
  description?: string
  category?: string
}

export default function AdminPortfolioPage() {
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([
    { id: 1, image: "/portfolio-image-1.png", caption: "Digital Marketing Campaign", category: "Marketing" },
    { id: 2, image: "/social-media-strategy.png", caption: "Social Media Strategy", category: "Social Media" },
    { id: 3, image: "/programmatic-advertising.png", caption: "Programmatic Advertising", category: "Advertising" },
    { id: 4, image: "/brand-identity-design.png", caption: "Brand Identity Design", category: "Branding" },
  ])
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Function to handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true)
      const file = e.target.files[0]

      // In a real implementation, you would upload the file to your server/S3 here
      // For now, we'll just create a local URL
      setTimeout(() => {
        const newImage = {
          id: Date.now(),
          image: URL.createObjectURL(file),
          caption: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for caption
          category: "Uncategorized",
          description: "",
        }
        setPortfolioImages([...portfolioImages, newImage])
        setSelectedImage(newImage)
        setIsUploading(false)
      }, 1000) // Simulate upload delay
    }
  }

  // Function to update image details
  const updateImageDetails = (field: string, value: string) => {
    if (!selectedImage) return

    const updatedImage = { ...selectedImage, [field]: value }
    setSelectedImage(updatedImage)

    // Update the image in the main array
    const updatedImages = portfolioImages.map((img) => (img.id === selectedImage.id ? updatedImage : img))
    setPortfolioImages(updatedImages)
  }

  // Function to delete an image
  const deleteImage = (id: number) => {
    const updatedImages = portfolioImages.filter((img) => img.id !== id)
    setPortfolioImages(updatedImages)

    if (selectedImage && selectedImage.id === id) {
      setSelectedImage(updatedImages.length > 0 ? updatedImages[0] : null)
    }
  }

  // Select the first image by default
  useEffect(() => {
    if (portfolioImages.length > 0 && !selectedImage) {
      setSelectedImage(portfolioImages[0])
    }
  }, [portfolioImages, selectedImage])

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Portfolio Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar - Image list */}
        <div className="glass-panel rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Portfolio Images</h2>
            <div className="relative">
              <input
                type="file"
                id="portfolio-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white/20 hover:bg-white/10 flex items-center gap-2"
                disabled={isUploading}
              >
                <Plus className="h-4 w-4" />
                <span>Add New</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {portfolioImages.map((image) => (
              <div
                key={image.id}
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                  selectedImage?.id === image.id ? "bg-white/20" : "hover:bg-white/10"
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative w-16 h-16 rounded overflow-hidden mr-3 flex-shrink-0">
                  <Image src={image.image || "/placeholder.svg"} alt={image.caption} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{image.caption}</p>
                  <p className="text-white/60 text-sm">{image.category}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-white hover:bg-red-500/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteImage(image.id)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {isUploading && (
              <div className="flex items-center p-2 rounded-md bg-white/10">
                <div className="w-16 h-16 rounded overflow-hidden mr-3 flex-shrink-0 bg-white/20 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-white/60 animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Uploading...</p>
                  <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Image details */}
        <div className="lg:col-span-2">
          {selectedImage ? (
            <Card className="glass-panel border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Edit Portfolio Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={selectedImage.image || "/placeholder.svg"}
                      alt={selectedImage.caption}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label htmlFor="caption" className="text-sm font-medium text-white mb-1 block">
                        Caption
                      </label>
                      <Input
                        id="caption"
                        value={selectedImage.caption}
                        onChange={(e) => updateImageDetails("caption", e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="text-sm font-medium text-white mb-1 block">
                        Category
                      </label>
                      <Input
                        id="category"
                        value={selectedImage.category || ""}
                        onChange={(e) => updateImageDetails("category", e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="text-sm font-medium text-white mb-1 block">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        value={selectedImage.description || ""}
                        onChange={(e) => updateImageDetails("description", e.target.value)}
                        className="bg-white/10 border-white/20 text-white min-h-[100px]"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="glass-panel rounded-lg p-8 flex flex-col items-center justify-center h-full">
              <Upload className="h-12 w-12 text-white/40 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No Image Selected</h3>
              <p className="text-white/60 text-center mb-6">
                Select an image from the list or upload a new one to edit its details.
              </p>
              <div className="relative">
                <input
                  type="file"
                  id="portfolio-upload-empty"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <Button
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10 flex items-center gap-2"
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload New Image</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
