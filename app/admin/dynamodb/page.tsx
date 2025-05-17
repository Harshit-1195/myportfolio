"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Trash, RefreshCw, Save, FileText, Briefcase, BookOpen, PenTool } from "lucide-react"

export default function DynamoDBManager() {
  const [activeTab, setActiveTab] = useState("blog-posts")
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Fetch items based on active tab
  useEffect(() => {
    fetchItems()
  }, [activeTab])

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/dynamodb/${activeTab}`)
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectItem = (item: any) => {
    setSelectedItem(item)
    setFormData(item)
    setFormErrors({})
  }

  const handleCreateNew = () => {
    setSelectedItem(null)
    setFormData({})
    setFormErrors({})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: checked }))
  }

  const handleArrayInputChange = (name: string, value: string) => {
    // Convert comma-separated string to array
    const arrayValue = value.split(",").map((item) => item.trim())
    setFormData((prev: any) => ({ ...prev, [name]: arrayValue }))
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Common validations
    if (!formData.title) errors.title = "Title is required"

    // Specific validations based on active tab
    if (activeTab === "blog-posts") {
      if (!formData.slug) errors.slug = "Slug is required"
      if (!formData.content) errors.content = "Content is required"
    } else if (activeTab === "projects") {
      if (!formData.slug) errors.slug = "Slug is required"
      if (!formData.description) errors.description = "Description is required"
    } else if (activeTab === "case-studies") {
      if (!formData.slug) errors.slug = "Slug is required"
      if (!formData.client) errors.client = "Client is required"
    } else if (activeTab === "logo-stories") {
      if (!formData.client) errors.client = "Client is required"
      if (!formData.image) errors.image = "Image is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const url = selectedItem ? `/api/dynamodb/${activeTab}/${selectedItem.id}` : `/api/dynamodb/${activeTab}`

      const method = selectedItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${selectedItem ? "update" : "create"} item`)
      }

      // Refresh the list
      fetchItems()

      // Reset form if creating new
      if (!selectedItem) {
        setFormData({})
      }
    } catch (error) {
      console.error("Error saving item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem || !confirm("Are you sure you want to delete this item?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/dynamodb/${activeTab}/${selectedItem.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete item")
      }

      // Refresh the list and reset form
      fetchItems()
      setSelectedItem(null)
      setFormData({})
    } catch (error) {
      console.error("Error deleting item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Render form fields based on active tab
  const renderFormFields = () => {
    switch (activeTab) {
      case "blog-posts":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  className={formErrors.title ? "border-red-500" : ""}
                />
                {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ""}
                  onChange={handleInputChange}
                  className={formErrors.slug ? "border-red-500" : ""}
                />
                {formErrors.slug && <p className="text-red-500 text-sm">{formErrors.slug}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt || ""}
                onChange={handleInputChange}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content || ""}
                onChange={handleInputChange}
                rows={10}
                className={formErrors.content ? "border-red-500" : ""}
              />
              {formErrors.content && <p className="text-red-500 text-sm">{formErrors.content}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  name="featured_image"
                  value={formData.featured_image || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" value={formData.author || ""} onChange={handleInputChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Programmatic">Programmatic</SelectItem>
                    <SelectItem value="Media Buying">Media Buying</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="SEO">SEO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags ? formData.tags.join(", ") : ""}
                  onChange={(e) => handleArrayInputChange("tags", e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published || false}
                onChange={handleCheckboxChange}
                className="h-4 w-4"
              />
              <Label htmlFor="is_published">Published</Label>
            </div>
          </>
        )

      case "projects":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  className={formErrors.title ? "border-red-500" : ""}
                />
                {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ""}
                  onChange={handleInputChange}
                  className={formErrors.slug ? "border-red-500" : ""}
                />
                {formErrors.slug && <p className="text-red-500 text-sm">{formErrors.slug}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                rows={2}
                className={formErrors.description ? "border-red-500" : ""}
              />
              {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content || ""}
                onChange={handleInputChange}
                rows={10}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  name="featured_image"
                  value={formData.featured_image || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies (comma separated)</Label>
                <Input
                  id="technologies"
                  name="technologies"
                  value={formData.technologies ? formData.technologies.join(", ") : ""}
                  onChange={(e) => handleArrayInputChange("technologies", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="url">Project URL</Label>
                <Input id="url" name="url" value={formData.url || ""} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  name="github_url"
                  value={formData.github_url || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured || false}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" name="order" type="number" value={formData.order || 0} onChange={handleInputChange} />
              </div>
            </div>
          </>
        )

      case "case-studies":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  className={formErrors.title ? "border-red-500" : ""}
                />
                {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ""}
                  onChange={handleInputChange}
                  className={formErrors.slug ? "border-red-500" : ""}
                />
                {formErrors.slug && <p className="text-red-500 text-sm">{formErrors.slug}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                name="client"
                value={formData.client || ""}
                onChange={handleInputChange}
                className={formErrors.client ? "border-red-500" : ""}
              />
              {formErrors.client && <p className="text-red-500 text-sm">{formErrors.client}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content || ""}
                onChange={handleInputChange}
                rows={6}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  name="featured_image"
                  value={formData.featured_image || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gallery">Gallery Images (comma separated URLs)</Label>
              <Textarea
                id="gallery"
                name="gallery"
                value={formData.gallery ? formData.gallery.join(", ") : ""}
                onChange={(e) => handleArrayInputChange("gallery", e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="challenge">Challenge</Label>
                <Textarea
                  id="challenge"
                  name="challenge"
                  value={formData.challenge || ""}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="solution">Solution</Label>
                <Textarea
                  id="solution"
                  name="solution"
                  value={formData.solution || ""}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="results">Results</Label>
                <Textarea
                  id="results"
                  name="results"
                  value={formData.results || ""}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testimonial">Testimonial</Label>
                <Textarea
                  id="testimonial"
                  name="testimonial"
                  value={formData.testimonial || ""}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="testimonial_author">Testimonial Author</Label>
                <Input
                  id="testimonial_author"
                  name="testimonial_author"
                  value={formData.testimonial_author || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured || false}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" name="order" type="number" value={formData.order || 0} onChange={handleInputChange} />
              </div>
            </div>
          </>
        )

      case "logo-stories":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  className={formErrors.title ? "border-red-500" : ""}
                />
                {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  name="client"
                  value={formData.client || ""}
                  onChange={handleInputChange}
                  className={formErrors.client ? "border-red-500" : ""}
                />
                {formErrors.client && <p className="text-red-500 text-sm">{formErrors.client}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={formData.image || ""}
                onChange={handleInputChange}
                className={formErrors.image ? "border-red-500" : ""}
              />
              {formErrors.image && <p className="text-red-500 text-sm">{formErrors.image}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="challenge">Challenge</Label>
                <Textarea
                  id="challenge"
                  name="challenge"
                  value={formData.challenge || ""}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="solution">Solution</Label>
                <Textarea
                  id="solution"
                  name="solution"
                  value={formData.solution || ""}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="result">Result</Label>
                <Textarea
                  id="result"
                  name="result"
                  value={formData.result || ""}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured || false}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" name="order" type="number" value={formData.order || 0} onChange={handleInputChange} />
              </div>
            </div>
          </>
        )

      default:
        return <p>Select a content type to manage</p>
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">DynamoDB Content Manager</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="blog-posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Blog Posts
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="case-studies" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Case Studies
          </TabsTrigger>
          <TabsTrigger value="logo-stories" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            Logo Stories
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Item List */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Items</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchItems} disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCreateNew}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  {items.length} {activeTab.replace("-", " ")} found
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item.id}>
                        <Button
                          variant={selectedItem?.id === item.id ? "default" : "ghost"}
                          className="w-full justify-start text-left"
                          onClick={() => handleSelectItem(item)}
                        >
                          {item.title || item.name || `Item ${item.id.substring(0, 8)}`}
                        </Button>
                      </li>
                    ))}
                    {items.length === 0 && <li className="text-center py-4 text-muted-foreground">No items found</li>}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Item Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedItem
                    ? `Edit ${selectedItem.title || "Item"}`
                    : `Create New ${activeTab.replace("-", " ").slice(0, -1)}`}
                </CardTitle>
                <CardDescription>
                  {selectedItem
                    ? `Editing item with ID: ${selectedItem.id}`
                    : `Fill in the details to create a new ${activeTab.replace("-", " ").slice(0, -1)}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {renderFormFields()}
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                {selectedItem && (
                  <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash className="h-4 w-4 mr-2" />}
                    Delete
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCreateNew}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {selectedItem ? "Save Changes" : "Create"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
