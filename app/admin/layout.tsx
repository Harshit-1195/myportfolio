import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, FileText, Users, Settings, Database, Cloud, Upload } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for portfolio website",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 container mx-auto">
          <Link href="/admin" className="font-bold text-xl flex items-center">
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Admin Dashboard
          </Link>
          <nav className="ml-auto flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline">Back to Site</Button>
            </Link>
          </nav>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
        <Tabs defaultValue="dashboard">
          <TabsList className="grid grid-cols-7 w-full max-w-4xl mx-auto">
            <TabsTrigger value="dashboard" asChild>
              <Link href="/admin">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </TabsTrigger>
            <TabsTrigger value="submissions" asChild>
              <Link href="/admin/submissions">
                <FileText className="h-4 w-4 mr-2" />
                Submissions
              </Link>
            </TabsTrigger>
            <TabsTrigger value="assets" asChild>
              <Link href="/admin/assets">
                <Database className="h-4 w-4 mr-2" />
                Assets
              </Link>
            </TabsTrigger>
            <TabsTrigger value="portfolio" asChild>
              <Link href="/admin/portfolio">
                <Users className="h-4 w-4 mr-2" />
                Portfolio
              </Link>
            </TabsTrigger>
            <TabsTrigger value="s3-manager" asChild>
              <Link href="/admin/s3-manager">
                <Cloud className="h-4 w-4 mr-2" />
                S3 Manager
              </Link>
            </TabsTrigger>
            <TabsTrigger value="s3-upload" asChild>
              <Link href="/admin/s3-upload">
                <Upload className="h-4 w-4 mr-2" />
                S3 Upload
              </Link>
            </TabsTrigger>
            <TabsTrigger value="settings" asChild>
              <Link href="/admin/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-4">
            {children}
          </TabsContent>
          <TabsContent value="submissions" className="space-y-4">
            {children}
          </TabsContent>
          <TabsContent value="assets" className="space-y-4">
            {children}
          </TabsContent>
          <TabsContent value="portfolio" className="space-y-4">
            {children}
          </TabsContent>
          <TabsContent value="s3-manager" className="space-y-4">
            {children}
          </TabsContent>
          <TabsContent value="s3-upload" className="space-y-4">
            {children}
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            {children}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
