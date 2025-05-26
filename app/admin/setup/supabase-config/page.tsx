"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Copy, ExternalLink } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function SupabaseConfigPage() {
  const [supabaseUrl, setSupabaseUrl] = useState(process.env.NEXT_PUBLIC_SUPABASE_URL || "")
  const [anonKey, setAnonKey] = useState(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")
  const [serviceKey, setServiceKey] = useState("")
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClientComponentClient()

  const testConnection = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("blog_posts").select("count", { count: "exact", head: true })

      if (error && error.code === "42P01") {
        setTestResult({
          success: false,
          message:
            "Connection successful, but database tables need to be created. Please run the database initialization.",
        })
      } else if (error) {
        setTestResult({
          success: false,
          message: `Connection failed: ${error.message}`,
        })
      } else {
        setTestResult({
          success: true,
          message: "Connection successful! Database is properly configured.",
        })
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: `Connection failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const currentDomain = typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com"

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Supabase Configuration</h1>
        <p className="text-gray-600 mt-2">Configure your Supabase project for the portfolio admin system</p>
      </div>

      {/* Current Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>Your current Supabase environment variables</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Supabase URL</Label>
            <div className="flex gap-2">
              <Input value={supabaseUrl} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(supabaseUrl)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>Anonymous Key</Label>
            <div className="flex gap-2">
              <Input value={anonKey} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(anonKey)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button onClick={testConnection} disabled={loading}>
            {loading ? "Testing..." : "Test Connection"}
          </Button>

          {testResult && (
            <Alert variant={testResult.success ? "default" : "destructive"}>
              {testResult.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <AlertDescription>{testResult.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Supabase Dashboard Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Supabase Dashboard Configuration</CardTitle>
          <CardDescription>Settings to configure in your Supabase project dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Site URL */}
          <div>
            <h3 className="font-semibold mb-2">1. Site URL Configuration</h3>
            <p className="text-sm text-gray-600 mb-2">Go to Authentication → URL Configuration → Site URL</p>
            <div className="bg-gray-50 p-3 rounded border">
              <Label className="text-xs text-gray-500">Site URL:</Label>
              <div className="flex gap-2 items-center">
                <code className="bg-white px-2 py-1 rounded border text-sm">{currentDomain}</code>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(currentDomain)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Redirect URLs */}
          <div>
            <h3 className="font-semibold mb-2">2. Redirect URLs</h3>
            <p className="text-sm text-gray-600 mb-2">Go to Authentication → URL Configuration → Redirect URLs</p>
            <div className="bg-gray-50 p-3 rounded border space-y-2">
              <div>
                <Label className="text-xs text-gray-500">Add these URLs:</Label>
                <div className="space-y-1">
                  {[`${currentDomain}/admin/reset-password`, `${currentDomain}/api/auth/callback`].map((url, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <code className="bg-white px-2 py-1 rounded border text-sm flex-1">{url}</code>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(url)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Email Template */}
          <div>
            <h3 className="font-semibold mb-2">3. Email Template Configuration</h3>
            <p className="text-sm text-gray-600 mb-2">Go to Authentication → Email Templates → Reset Password</p>
            <div className="bg-gray-50 p-3 rounded border">
              <Label className="text-xs text-gray-500 mb-2 block">Email Template Body:</Label>
              <Textarea
                readOnly
                value={`<h2>Reset Your Password</h2>
<p>Hi there,</p>
<p>You have requested to reset your password for your admin account.</p>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .SiteURL }}/admin/reset-password?access_token={{ .TokenHash }}&type=recovery">Reset Password</a></p>
<p>If you didn't request this, please ignore this email.</p>
<p>This link will expire in 24 hours.</p>`}
                className="font-mono text-xs h-32"
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() =>
                  copyToClipboard(`<h2>Reset Your Password</h2>
<p>Hi there,</p>
<p>You have requested to reset your password for your admin account.</p>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .SiteURL }}/admin/reset-password?access_token={{ .TokenHash }}&type=recovery">Reset Password</a></p>
<p>If you didn't request this, please ignore this email.</p>
<p>This link will expire in 24 hours.</p>`)
                }
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>Add these to your .env.local file and Vercel environment variables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded border">
            <Label className="text-xs text-gray-500 mb-2 block">Environment Variables:</Label>
            <pre className="text-sm">
              {`NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`}
            </pre>
            <div className="mt-4 space-y-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Supabase Dashboard
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common setup tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" asChild>
            <a href="/admin/setup/init-db">Initialize Database Tables</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/admin/setup/create-admin">Create Admin User</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/admin/test-connection">Test Database Connection</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
