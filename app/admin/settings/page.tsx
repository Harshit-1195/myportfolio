"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  Globe,
  Mail,
  Database,
  Shield,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Upload,
  Download,
} from "lucide-react"

interface SiteSettings {
  site_name: string
  site_description: string
  site_url: string
  contact_email: string
  social_links: {
    linkedin?: string
    github?: string
    twitter?: string
    instagram?: string
  }
  seo_settings: {
    default_meta_title: string
    default_meta_description: string
    google_analytics_id?: string
    google_search_console?: string
  }
  email_settings: {
    smtp_enabled: boolean
    from_email: string
    from_name: string
  }
  content_settings: {
    posts_per_page: number
    enable_comments: boolean
    auto_publish: boolean
  }
  security_settings: {
    enable_2fa: boolean
    session_timeout: number
    max_login_attempts: number
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: "Harshit Dabhi Portfolio",
    site_description: "Digital Marketing Expert & Web Developer",
    site_url: "https://harshitdabhi.com",
    contact_email: "contact@harshitdabhi.com",
    social_links: {
      linkedin: "https://linkedin.com/in/harshitdabhi",
      github: "https://github.com/harshitdabhi",
    },
    seo_settings: {
      default_meta_title: "Harshit Dabhi - Digital Marketing Expert",
      default_meta_description:
        "Experienced digital marketing professional specializing in programmatic advertising, data analytics, and web development.",
    },
    email_settings: {
      smtp_enabled: false,
      from_email: "noreply@harshitdabhi.com",
      from_name: "Harshit Dabhi",
    },
    content_settings: {
      posts_per_page: 10,
      enable_comments: false,
      auto_publish: false,
    },
    security_settings: {
      enable_2fa: false,
      session_timeout: 24,
      max_login_attempts: 5,
    },
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState("general")

  const supabase = createClientComponentClient()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("site_settings").select("*").single()

      if (data) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase.from("site_settings").upsert({
        id: 1,
        settings: settings,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setMessage({ type: "success", text: "Settings saved successfully!" })
    } catch (error: any) {
      console.error("Error saving settings:", error)
      setMessage({ type: "error", text: error.message || "Failed to save settings" })
    } finally {
      setSaving(false)
    }
  }

  const updateSettings = (section: keyof SiteSettings, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "site-settings.json"
    link.click()
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string)
        setSettings(importedSettings)
        setMessage({ type: "success", text: "Settings imported successfully!" })
      } catch (error) {
        setMessage({ type: "error", text: "Invalid settings file" })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="container mx-auto py-28 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Configure your site settings and preferences</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <label className="cursor-pointer">
            <Button variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </span>
            </Button>
            <input type="file" accept=".json" onChange={importSettings} className="hidden" />
          </label>

          <Button onClick={saveSettings} disabled={saving}>
            {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>
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
          <TabsTrigger value="general" className="data-[state=active]:bg-gray-700">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-gray-700">
            <Settings className="h-4 w-4 mr-2" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-gray-700">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-gray-700">
            <Database className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-gray-700">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Site Information</CardTitle>
              <CardDescription className="text-gray-400">Basic information about your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name" className="text-white">
                    Site Name
                  </Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => setSettings((prev) => ({ ...prev, site_name: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site_url" className="text-white">
                    Site URL
                  </Label>
                  <Input
                    id="site_url"
                    value={settings.site_url}
                    onChange={(e) => setSettings((prev) => ({ ...prev, site_url: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description" className="text-white">
                  Site Description
                </Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => setSettings((prev) => ({ ...prev, site_description: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email" className="text-white">
                  Contact Email
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings((prev) => ({ ...prev, contact_email: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Social Links</CardTitle>
              <CardDescription className="text-gray-400">Your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-white">
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    value={settings.social_links.linkedin || ""}
                    onChange={(e) => updateSettings("social_links", "linkedin", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github" className="text-white">
                    GitHub
                  </Label>
                  <Input
                    id="github"
                    value={settings.social_links.github || ""}
                    onChange={(e) => updateSettings("social_links", "github", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-white">
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    value={settings.social_links.twitter || ""}
                    onChange={(e) => updateSettings("social_links", "twitter", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-white">
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={settings.social_links.instagram || ""}
                    onChange={(e) => updateSettings("social_links", "instagram", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">SEO Settings</CardTitle>
              <CardDescription className="text-gray-400">Search engine optimization configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default_meta_title" className="text-white">
                  Default Meta Title
                </Label>
                <Input
                  id="default_meta_title"
                  value={settings.seo_settings.default_meta_title}
                  onChange={(e) => updateSettings("seo_settings", "default_meta_title", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default_meta_description" className="text-white">
                  Default Meta Description
                </Label>
                <Textarea
                  id="default_meta_description"
                  value={settings.seo_settings.default_meta_description}
                  onChange={(e) => updateSettings("seo_settings", "default_meta_description", e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="google_analytics_id" className="text-white">
                    Google Analytics ID
                  </Label>
                  <Input
                    id="google_analytics_id"
                    value={settings.seo_settings.google_analytics_id || ""}
                    onChange={(e) => updateSettings("seo_settings", "google_analytics_id", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="GA-XXXXXXXXX-X"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google_search_console" className="text-white">
                    Search Console Verification
                  </Label>
                  <Input
                    id="google_search_console"
                    value={settings.seo_settings.google_search_console || ""}
                    onChange={(e) => updateSettings("seo_settings", "google_search_console", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Verification code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Email Configuration</CardTitle>
              <CardDescription className="text-gray-400">Email sending and notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smtp_enabled" className="text-white">
                    Enable SMTP
                  </Label>
                  <p className="text-sm text-gray-400">Use custom SMTP server for sending emails</p>
                </div>
                <Switch
                  id="smtp_enabled"
                  checked={settings.email_settings.smtp_enabled}
                  onCheckedChange={(checked) => updateSettings("email_settings", "smtp_enabled", checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from_email" className="text-white">
                    From Email
                  </Label>
                  <Input
                    id="from_email"
                    type="email"
                    value={settings.email_settings.from_email}
                    onChange={(e) => updateSettings("email_settings", "from_email", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from_name" className="text-white">
                    From Name
                  </Label>
                  <Input
                    id="from_name"
                    value={settings.email_settings.from_name}
                    onChange={(e) => updateSettings("email_settings", "from_name", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Content Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure how content is displayed and managed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="posts_per_page" className="text-white">
                  Posts Per Page
                </Label>
                <Input
                  id="posts_per_page"
                  type="number"
                  min="1"
                  max="50"
                  value={settings.content_settings.posts_per_page}
                  onChange={(e) =>
                    updateSettings("content_settings", "posts_per_page", Number.parseInt(e.target.value))
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable_comments" className="text-white">
                    Enable Comments
                  </Label>
                  <p className="text-sm text-gray-400">Allow comments on blog posts</p>
                </div>
                <Switch
                  id="enable_comments"
                  checked={settings.content_settings.enable_comments}
                  onCheckedChange={(checked) => updateSettings("content_settings", "enable_comments", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto_publish" className="text-white">
                    Auto Publish
                  </Label>
                  <p className="text-sm text-gray-400">Automatically publish new content</p>
                </div>
                <Switch
                  id="auto_publish"
                  checked={settings.content_settings.auto_publish}
                  onCheckedChange={(checked) => updateSettings("content_settings", "auto_publish", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
              <CardDescription className="text-gray-400">Configure security and authentication options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable_2fa" className="text-white">
                    Two-Factor Authentication
                  </Label>
                  <p className="text-sm text-gray-400">Require 2FA for admin access</p>
                </div>
                <Switch
                  id="enable_2fa"
                  checked={settings.security_settings.enable_2fa}
                  onCheckedChange={(checked) => updateSettings("security_settings", "enable_2fa", checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session_timeout" className="text-white">
                    Session Timeout (hours)
                  </Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    min="1"
                    max="168"
                    value={settings.security_settings.session_timeout}
                    onChange={(e) =>
                      updateSettings("security_settings", "session_timeout", Number.parseInt(e.target.value))
                    }
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_login_attempts" className="text-white">
                    Max Login Attempts
                  </Label>
                  <Input
                    id="max_login_attempts"
                    type="number"
                    min="3"
                    max="10"
                    value={settings.security_settings.max_login_attempts}
                    onChange={(e) =>
                      updateSettings("security_settings", "max_login_attempts", Number.parseInt(e.target.value))
                    }
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
