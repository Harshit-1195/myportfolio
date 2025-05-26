"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Save, RefreshCw, AlertCircle, CheckCircle, Edit, EyeOff, GripVertical, Plus } from "lucide-react"

interface ContentSection {
  id: string
  section_key: string
  section_name: string
  content: any
  page: string
  section_order: number
  is_active: boolean
}

interface NavigationMenu {
  id: string
  menu_key: string
  menu_name: string
  items: any[]
  is_active: boolean
}

interface PageContent {
  id: string
  page_slug: string
  page_title: string
  content: any
  meta_title?: string
  meta_description?: string
  is_published: boolean
}

export default function ContentManagementPage() {
  const [contentSections, setContentSections] = useState<ContentSection[]>([])
  const [navigationMenus, setNavigationMenus] = useState<NavigationMenu[]>([])
  const [pageContent, setPageContent] = useState<PageContent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState("homepage")
  const [editingSection, setEditingSection] = useState<string | null>(null)

  useEffect(() => {
    loadAllContent()
  }, [])

  const loadAllContent = async () => {
    setLoading(true)
    try {
      console.log("Loading content via API...")

      // Use API routes instead of direct Supabase client
      const [sectionsResponse, menusResponse, pagesResponse] = await Promise.all([
        fetch("/api/cms/content-sections"),
        fetch("/api/cms/navigation-menus"),
        fetch("/api/cms/page-content"),
      ])

      console.log("API responses:", {
        sections: sectionsResponse.status,
        menus: menusResponse.status,
        pages: pagesResponse.status,
      })

      // Handle sections
      if (sectionsResponse.ok) {
        const sectionsData = await sectionsResponse.json()
        setContentSections(sectionsData || [])
        console.log("Loaded sections:", sectionsData?.length || 0)
      } else {
        console.error("Error loading sections:", sectionsResponse.statusText)
        setMessage({ type: "error", text: `Failed to load sections: ${sectionsResponse.statusText}` })
      }

      // Handle menus
      if (menusResponse.ok) {
        const menusData = await menusResponse.json()
        setNavigationMenus(menusData || [])
        console.log("Loaded menus:", menusData?.length || 0)
      } else {
        console.error("Error loading menus:", menusResponse.statusText)
      }

      // Handle pages
      if (pagesResponse.ok) {
        const pagesData = await pagesResponse.json()
        setPageContent(pagesData || [])
        console.log("Loaded pages:", pagesData?.length || 0)
      } else {
        console.error("Error loading pages:", pagesResponse.statusText)
      }

      // If no sections exist, show option to create default content
      if (sectionsResponse.ok) {
        const sectionsData = await sectionsResponse.json()
        if (!sectionsData || sectionsData.length === 0) {
          console.log("No sections found")
        }
      }
    } catch (error) {
      console.error("Error loading content:", error)
      setMessage({ type: "error", text: "Failed to load content. Check console for details." })
    } finally {
      setLoading(false)
    }
  }

  const createDefaultContent = async () => {
    try {
      console.log("Creating default content...")
      setSaving(true)

      const response = await fetch("/api/cms/create-default-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Default content created successfully!" })
        setTimeout(() => {
          loadAllContent()
        }, 1000)
      } else {
        const errorData = await response.json()
        setMessage({
          type: "error",
          text: `Failed to create default content: ${errorData.error || response.statusText}`,
        })
      }
    } catch (error) {
      console.error("Error creating default content:", error)
      setMessage({
        type: "error",
        text: `Failed to create default content: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setSaving(false)
    }
  }

  const saveContentSection = async (section: ContentSection) => {
    setSaving(true)
    try {
      console.log("Saving section:", section)

      const response = await fetch("/api/cms/content-sections", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(section),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Section saved successfully!" })
        setEditingSection(null)
        setTimeout(() => setMessage(null), 3000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save section")
      }
    } catch (error: any) {
      console.error("Error saving section:", error)
      setMessage({ type: "error", text: error.message || "Failed to save section" })
    } finally {
      setSaving(false)
    }
  }

  const toggleSectionActive = async (sectionId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/cms/content-sections/${sectionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: isActive }),
      })

      if (response.ok) {
        setContentSections((prev) =>
          prev.map((section) => (section.id === sectionId ? { ...section, is_active: isActive } : section)),
        )
        setMessage({ type: "success", text: `Section ${isActive ? "activated" : "deactivated"} successfully!` })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error("Failed to update section status")
      }
    } catch (error) {
      console.error("Error toggling section:", error)
      setMessage({ type: "error", text: "Failed to update section status" })
    }
  }

  const updateSectionContent = (sectionId: string, newContent: any) => {
    setContentSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, content: newContent } : section)),
    )
  }

  const renderContentEditor = (section: ContentSection) => {
    const isEditing = editingSection === section.id

    return (
      <Card key={section.id} className="bg-gray-800 border-gray-700 mb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <GripVertical className="h-4 w-4 text-gray-400" />
            <CardTitle className="text-white">{section.section_name}</CardTitle>
            <Badge variant={section.is_active ? "default" : "secondary"}>
              {section.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={section.is_active}
              onCheckedChange={(checked) => toggleSectionActive(section.id, checked)}
            />
            <Button variant="outline" size="sm" onClick={() => setEditingSection(isEditing ? null : section.id)}>
              {isEditing ? <EyeOff className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? "Close" : "Edit"}
            </Button>
          </div>
        </CardHeader>

        {isEditing && (
          <CardContent>
            <div className="space-y-4">
              {section.section_key === "hero" && (
                <HeroSectionEditor
                  content={section.content}
                  onChange={(content) => updateSectionContent(section.id, content)}
                />
              )}

              {section.section_key === "stats" && (
                <StatsSectionEditor
                  content={section.content}
                  onChange={(content) => updateSectionContent(section.id, content)}
                />
              )}

              {section.section_key === "about" && (
                <AboutSectionEditor
                  content={section.content}
                  onChange={(content) => updateSectionContent(section.id, content)}
                />
              )}

              {section.section_key === "expertise" && (
                <ExpertiseSectionEditor
                  content={section.content}
                  onChange={(content) => updateSectionContent(section.id, content)}
                />
              )}

              {section.section_key === "contact_cta" && (
                <ContactCTASectionEditor
                  content={section.content}
                  onChange={(content) => updateSectionContent(section.id, content)}
                />
              )}

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
                <Button variant="outline" onClick={() => setEditingSection(null)}>
                  Cancel
                </Button>
                <Button onClick={() => saveContentSection(section)} disabled={saving}>
                  {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-28 px-4 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-white">Loading content management...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-28 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Management</h1>
          <p className="text-gray-400 mt-1">Edit all content across your website</p>
        </div>
        <Button onClick={loadAllContent} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-md flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-900/50 border border-green-800 text-green-300"
              : "bg-red-900/50 border border-red-800 text-red-300"
          }`}
        >
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800 mb-6">
          <TabsTrigger value="homepage" className="data-[state=active]:bg-gray-700">
            Homepage ({contentSections.filter((s) => s.page === "homepage").length} sections)
          </TabsTrigger>
          <TabsTrigger value="navigation" className="data-[state=active]:bg-gray-700">
            Navigation ({navigationMenus.length} menus)
          </TabsTrigger>
          <TabsTrigger value="pages" className="data-[state=active]:bg-gray-700">
            Pages ({pageContent.length} pages)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="homepage">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Homepage Sections</h2>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-400">Click Edit to modify sections</p>
                <Button onClick={createDefaultContent} variant="outline" size="sm" disabled={saving}>
                  <Plus className="h-4 w-4 mr-2" />
                  {saving ? "Creating..." : "Add Default Content"}
                </Button>
              </div>
            </div>

            {contentSections.filter((section) => section.page === "homepage").length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <p className="text-gray-400 mb-4">No homepage sections found.</p>
                  <Button onClick={createDefaultContent} disabled={saving}>
                    <Plus className="h-4 w-4 mr-2" />
                    {saving ? "Creating Default Content..." : "Create Default Homepage Content"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {contentSections
                  .filter((section) => section.page === "homepage")
                  .sort((a, b) => a.section_order - b.section_order)
                  .map((section) => renderContentEditor(section))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="navigation">
          <NavigationEditor menus={navigationMenus} />
        </TabsContent>

        <TabsContent value="pages">
          <PageContentEditor pages={pageContent} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Individual section editors (same as before)
const HeroSectionEditor = ({ content, onChange }: { content: any; onChange: (content: any) => void }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white mb-4">Hero Section Content</h3>
    <div>
      <Label className="text-white">Title</Label>
      <Input
        value={content?.title || ""}
        onChange={(e) => onChange({ ...content, title: e.target.value })}
        className="bg-gray-700 border-gray-600 text-white mt-1"
        placeholder="Enter hero title"
      />
    </div>
    <div>
      <Label className="text-white">Subtitle</Label>
      <Input
        value={content?.subtitle || ""}
        onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
        className="bg-gray-700 border-gray-600 text-white mt-1"
        placeholder="Enter hero subtitle"
      />
    </div>
    <div>
      <Label className="text-white">Description</Label>
      <Input
        value={content?.description || ""}
        onChange={(e) => onChange({ ...content, description: e.target.value })}
        className="bg-gray-700 border-gray-600 text-white mt-1"
        placeholder="Enter hero description"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-white">CTA Button Text</Label>
        <Input
          value={content?.cta_text || ""}
          onChange={(e) => onChange({ ...content, cta_text: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white mt-1"
          placeholder="Button text"
        />
      </div>
      <div>
        <Label className="text-white">CTA Button Link</Label>
        <Input
          value={content?.cta_link || ""}
          onChange={(e) => onChange({ ...content, cta_link: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white mt-1"
          placeholder="/link-url"
        />
      </div>
    </div>
  </div>
)

const StatsSectionEditor = ({ content, onChange }: { content: any; onChange: (content: any) => void }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white mb-4">Statistics Section</h3>
    <Label className="text-white">Statistics</Label>
    {content?.stats?.map((stat: any, index: number) => (
      <div key={index} className="grid grid-cols-2 gap-4 p-4 bg-gray-700 rounded">
        <div>
          <Label className="text-white">Value</Label>
          <Input
            value={stat?.value || ""}
            onChange={(e) => {
              const newStats = [...(content?.stats || [])]
              newStats[index] = { ...stat, value: e.target.value }
              onChange({ ...content, stats: newStats })
            }}
            className="bg-gray-600 border-gray-500 text-white mt-1"
            placeholder="e.g., 600%"
          />
        </div>
        <div>
          <Label className="text-white">Label</Label>
          <Input
            value={stat?.label || ""}
            onChange={(e) => {
              const newStats = [...(content?.stats || [])]
              newStats[index] = { ...stat, label: e.target.value }
              onChange({ ...content, stats: newStats })
            }}
            className="bg-gray-600 border-gray-500 text-white mt-1"
            placeholder="e.g., Average ROI"
          />
        </div>
      </div>
    )) || <p className="text-gray-400">No statistics found</p>}
  </div>
)

const AboutSectionEditor = ({ content, onChange }: { content: any; onChange: (content: any) => void }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white mb-4">About Section Content</h3>
    <div>
      <Label className="text-white">Title</Label>
      <Input
        value={content?.title || ""}
        onChange={(e) => onChange({ ...content, title: e.target.value })}
        className="bg-gray-700 border-gray-600 text-white mt-1"
        placeholder="Section title"
      />
    </div>
    <div>
      <Label className="text-white">Content</Label>
      <Textarea
        value={content?.content || ""}
        onChange={(e) => onChange({ ...content, content: e.target.value })}
        className="bg-gray-700 border-gray-600 text-white mt-1"
        rows={6}
        placeholder="About section content..."
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-white">CTA Button Text</Label>
        <Input
          value={content?.cta_text || ""}
          onChange={(e) => onChange({ ...content, cta_text: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white mt-1"
          placeholder="Button text"
        />
      </div>
      <div>
        <Label className="text-white">CTA Button Link</Label>
        <Input
          value={content?.cta_link || ""}
          onChange={(e) => onChange({ ...content, cta_link: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white mt-1"
          placeholder="/link-url"
        />
      </div>
    </div>
  </div>
)

const ExpertiseSectionEditor = ({ content, onChange }: { content: any; onChange: (content: any) => void }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white mb-4">Expertise Section</h3>
    <div>
      <Label className="text-white">Section Title</Label>
      <Input
        value={content?.title || ""}
        onChange={(e) => onChange({ ...content, title: e.target.value })}
        className="bg-gray-700 border-gray-600 text-white mt-1"
        placeholder="Section title"
      />
    </div>
    <Label className="text-white">Expertise Items</Label>
    {content?.items?.map((item: any, index: number) => (
      <div key={index} className="p-4 bg-gray-700 rounded space-y-3">
        <div>
          <Label className="text-white">Title</Label>
          <Input
            value={item?.title || ""}
            onChange={(e) => {
              const newItems = [...(content?.items || [])]
              newItems[index] = { ...item, title: e.target.value }
              onChange({ ...content, items: newItems })
            }}
            className="bg-gray-600 border-gray-500 text-white mt-1"
            placeholder="Expertise title"
          />
        </div>
        <div>
          <Label className="text-white">Description</Label>
          <Textarea
            value={item?.description || ""}
            onChange={(e) => {
              const newItems = [...(content?.items || [])]
              newItems[index] = { ...item, description: e.target.value }
              onChange({ ...content, items: newItems })
            }}
            className="bg-gray-600 border-gray-500 text-white mt-1"
            rows={2}
            placeholder="Expertise description"
          />
        </div>
      </div>
    )) || <p className="text-gray-400">No expertise items found</p>}
  </div>
)

const ContactCTASectionEditor = ({ content, onChange }: { content: any; onChange: (content: any) => void }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white mb-4">Contact CTA Section</h3>
    <div>
      <Label className="text-white">Title</Label>
      <Input
        value={content?.title || ""}
        onChange={(e) => onChange({ ...content, title: e.target.value })}
        className="bg-gray-700 border-gray-600 text-white mt-1"
        placeholder="CTA title"
      />
    </div>
    <div>
      <Label className="text-white">Description</Label>
      <Textarea
        value={content?.description || ""}
        onChange={(e) => onChange({ ...content, description: e.target.value })}
        className="bg-gray-700 border-gray-600 text-white mt-1"
        rows={3}
        placeholder="CTA description"
      />
    </div>
    <Label className="text-white">Contact Buttons</Label>
    {content?.buttons?.map((button: any, index: number) => (
      <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-gray-700 rounded">
        <div>
          <Label className="text-white">Button Text</Label>
          <Input
            value={button?.text || ""}
            onChange={(e) => {
              const newButtons = [...(content?.buttons || [])]
              newButtons[index] = { ...button, text: e.target.value }
              onChange({ ...content, buttons: newButtons })
            }}
            className="bg-gray-600 border-gray-500 text-white mt-1"
            placeholder="Button text"
          />
        </div>
        <div>
          <Label className="text-white">Link</Label>
          <Input
            value={button?.link || ""}
            onChange={(e) => {
              const newButtons = [...(content?.buttons || [])]
              newButtons[index] = { ...button, link: e.target.value }
              onChange({ ...content, buttons: newButtons })
            }}
            className="bg-gray-600 border-gray-500 text-white mt-1"
            placeholder="Button link"
          />
        </div>
        <div>
          <Label className="text-white">Icon</Label>
          <Input
            value={button?.icon || ""}
            onChange={(e) => {
              const newButtons = [...(content?.buttons || [])]
              newButtons[index] = { ...button, icon: e.target.value }
              onChange({ ...content, buttons: newButtons })
            }}
            className="bg-gray-600 border-gray-500 text-white mt-1"
            placeholder="Icon name"
          />
        </div>
      </div>
    )) || <p className="text-gray-400">No contact buttons found</p>}
  </div>
)

const NavigationEditor = ({ menus }: { menus: NavigationMenu[] }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-white">Navigation Menus</h2>
    {menus.length === 0 ? (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="text-center py-12">
          <p className="text-gray-400">No navigation menus found.</p>
        </CardContent>
      </Card>
    ) : (
      menus.map((menu) => (
        <Card key={menu.id} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">{menu.menu_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menu.items?.map((item: any, index: number) => (
                <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-gray-700 rounded">
                  <div>
                    <Label className="text-white">Label</Label>
                    <Input value={item?.label || ""} className="bg-gray-600 border-gray-500 text-white mt-1" readOnly />
                  </div>
                  <div>
                    <Label className="text-white">Link</Label>
                    <Input value={item?.href || ""} className="bg-gray-600 border-gray-500 text-white mt-1" readOnly />
                  </div>
                  <div>
                    <Label className="text-white">Order</Label>
                    <Input
                      type="number"
                      value={item?.order || ""}
                      className="bg-gray-600 border-gray-500 text-white mt-1"
                      readOnly
                    />
                  </div>
                </div>
              )) || <p className="text-gray-400">No menu items found</p>}
            </div>
          </CardContent>
        </Card>
      ))
    )}
  </div>
)

const PageContentEditor = ({ pages }: { pages: PageContent[] }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-white">Page Content</h2>
    {pages.length === 0 ? (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="text-center py-12">
          <p className="text-gray-400">No pages found.</p>
        </CardContent>
      </Card>
    ) : (
      pages.map((page) => (
        <Card key={page.id} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">{page.page_title}</CardTitle>
            <CardDescription className="text-gray-400">/{page.page_slug}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Page Title</Label>
                <Input value={page.page_title} className="bg-gray-700 border-gray-600 text-white mt-1" readOnly />
              </div>
              <div>
                <Label className="text-white">Meta Title</Label>
                <Input value={page.meta_title || ""} className="bg-gray-700 border-gray-600 text-white mt-1" readOnly />
              </div>
              <div>
                <Label className="text-white">Meta Description</Label>
                <Textarea
                  value={page.meta_description || ""}
                  className="bg-gray-700 border-gray-600 text-white mt-1"
                  rows={3}
                  readOnly
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={page.is_published} disabled />
                <Label className="text-white">Published</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      ))
    )}
  </div>
)
