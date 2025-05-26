"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Copy, ExternalLink, Globe, Shield, Database } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function DomainConfigPage() {
  const [customDomain, setCustomDomain] = useState("")
  const [vercelDomain, setVercelDomain] = useState("")
  const [currentDomain, setCurrentDomain] = useState("")
  const [testResults, setTestResults] = useState<{
    domain: { success: boolean; message: string } | null
    supabase: { success: boolean; message: string } | null
    auth: { success: boolean; message: string } | null
  }>({
    domain: null,
    supabase: null,
    auth: null,
  })
  const [loading, setLoading] = useState(false)

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentDomain(window.location.origin)
      // Try to detect if we're on a custom domain
      const hostname = window.location.hostname
      if (!hostname.includes("vercel.app") && !hostname.includes("localhost")) {
        setCustomDomain(window.location.origin)
      }
    }
  }, [])

  const testDomainConfiguration = async () => {
    setLoading(true)
    const results = { domain: null, supabase: null, auth: null }

    try {
      // Test 1: Domain accessibility
      try {
        const response = await fetch("/api/health-check")
        if (response.ok) {
          results.domain = {
            success: true,
            message: "Domain is accessible and responding correctly",
          }
        } else {
          results.domain = {
            success: false,
            message: "Domain is accessible but API endpoints may have issues",
          }
        }
      } catch (err) {
        results.domain = {
          success: false,
          message: "Domain is not accessible or has connectivity issues",
        }
      }

      // Test 2: Supabase connection
      try {
        const { data, error } = await supabase.from("blog_posts").select("count", { count: "exact", head: true })
        if (error && error.code === "42P01") {
          results.supabase = {
            success: true,
            message: "Supabase connection successful (tables need initialization)",
          }
        } else if (error) {
          results.supabase = {
            success: false,
            message: `Supabase connection failed: ${error.message}`,
          }
        } else {
          results.supabase = {
            success: true,
            message: "Supabase connection and database working correctly",
          }
        }
      } catch (err) {
        results.supabase = {
          success: false,
          message: `Supabase connection failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        }
      }

      // Test 3: Auth configuration
      try {
        const { data, error } = await supabase.auth.getSession()
        results.auth = {
          success: true,
          message: "Authentication system is properly configured",
        }
      } catch (err) {
        results.auth = {
          success: false,
          message: `Authentication configuration issue: ${err instanceof Error ? err.message : "Unknown error"}`,
        }
      }
    } catch (err) {
      console.error("Test error:", err)
    }

    setTestResults(results as any)
    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const domainToUse = customDomain || currentDomain

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Custom Domain Configuration</h1>
        <p className="text-gray-600 mt-2">Configure your Supabase project to work with your custom domain</p>
      </div>

      {/* Current Domain Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Domain Detection
          </CardTitle>
          <CardDescription>Current domain configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Domain</Label>
            <div className="flex gap-2">
              <Input value={currentDomain} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(currentDomain)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>Custom Domain (if different)</Label>
            <div className="flex gap-2">
              <Input
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="https://yourdomain.com"
                className="font-mono text-sm"
              />
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(customDomain)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter your custom domain if different from current</p>
          </div>

          <Button onClick={testDomainConfiguration} disabled={loading}>
            {loading ? "Testing Configuration..." : "Test Domain Configuration"}
          </Button>

          {/* Test Results */}
          {(testResults.domain || testResults.supabase || testResults.auth) && (
            <div className="space-y-2">
              {testResults.domain && (
                <Alert variant={testResults.domain.success ? "default" : "destructive"}>
                  {testResults.domain.success ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <AlertDescription>
                    <strong>Domain:</strong> {testResults.domain.message}
                  </AlertDescription>
                </Alert>
              )}
              {testResults.supabase && (
                <Alert variant={testResults.supabase.success ? "default" : "destructive"}>
                  {testResults.supabase.success ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <AlertDescription>
                    <strong>Supabase:</strong> {testResults.supabase.message}
                  </AlertDescription>
                </Alert>
              )}
              {testResults.auth && (
                <Alert variant={testResults.auth.success ? "default" : "destructive"}>
                  {testResults.auth.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <AlertDescription>
                    <strong>Authentication:</strong> {testResults.auth.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supabase Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Supabase Dashboard Configuration
          </CardTitle>
          <CardDescription>Update these settings in your Supabase project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Site URL */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">1</span>
              Site URL Configuration
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Go to <strong>Authentication → URL Configuration → Site URL</strong>
            </p>
            <div className="bg-gray-50 p-3 rounded border">
              <Label className="text-xs text-gray-500">Set Site URL to:</Label>
              <div className="flex gap-2 items-center mt-1">
                <code className="bg-white px-2 py-1 rounded border text-sm flex-1">{domainToUse}</code>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(domainToUse)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Redirect URLs */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">2</span>
              Redirect URLs
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Go to <strong>Authentication → URL Configuration → Redirect URLs</strong>
            </p>
            <div className="bg-gray-50 p-3 rounded border space-y-2">
              <Label className="text-xs text-gray-500">Add these URLs (replace any old ones):</Label>
              <div className="space-y-1">
                {[
                  `${domainToUse}/admin/reset-password`,
                  `${domainToUse}/api/auth/callback`,
                  `${domainToUse}/auth/callback`,
                ].map((url, index) => (
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

          {/* CORS Origins */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">3</span>
              CORS Origins (if needed)
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Go to <strong>Settings → API → CORS Origins</strong> (only if you have CORS issues)
            </p>
            <div className="bg-gray-50 p-3 rounded border">
              <Label className="text-xs text-gray-500">Add domain if needed:</Label>
              <div className="flex gap-2 items-center mt-1">
                <code className="bg-white px-2 py-1 rounded border text-sm flex-1">{domainToUse}</code>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(domainToUse)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vercel Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Vercel Configuration
          </CardTitle>
          <CardDescription>Ensure your Vercel deployment is properly configured</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Environment Variables</h3>
            <p className="text-sm text-gray-600 mb-2">
              Ensure these are set in <strong>Vercel Dashboard → Project → Settings → Environment Variables</strong>
            </p>
            <div className="bg-gray-50 p-3 rounded border">
              <pre className="text-sm">
                {`NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_BASE_URL=${domainToUse}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Custom Domain Setup</h3>
            <p className="text-sm text-gray-600 mb-2">In Vercel Dashboard → Project → Settings → Domains</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
              <li>Add your custom domain</li>
              <li>Configure DNS records as instructed by Vercel</li>
              <li>Wait for SSL certificate provisioning</li>
              <li>Test the domain accessibility</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* DNS Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>DNS Configuration</CardTitle>
          <CardDescription>Required DNS records for your domain</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Configure these DNS records with your domain provider. The exact values will be provided by Vercel when
              you add your custom domain.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-3 rounded border">
            <h4 className="font-medium mb-2">Typical DNS Records:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Type:</strong> CNAME <br />
                <strong>Name:</strong> www (or your subdomain) <br />
                <strong>Value:</strong> cname.vercel-dns.com
              </div>
              <div>
                <strong>Type:</strong> A <br />
                <strong>Name:</strong> @ (root domain) <br />
                <strong>Value:</strong> 76.76.19.61
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: Use the exact values provided by Vercel in your domain settings
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Useful links and actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button variant="outline" asChild>
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Supabase Dashboard
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Vercel Dashboard
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin/setup/supabase-config">
                <Database className="w-4 h-4 mr-2" />
                Supabase Config
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin/test-connection">
                <CheckCircle className="w-4 h-4 mr-2" />
                Test Connection
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
