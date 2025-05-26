"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

interface EnvCheck {
  name: string
  value: string | undefined
  required: boolean
  description: string
}

export default function EnvironmentCheckPage() {
  const [envVars, setEnvVars] = useState<EnvCheck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkEnvironmentVariables()
  }, [])

  const checkEnvironmentVariables = () => {
    setLoading(true)

    const checks: EnvCheck[] = [
      {
        name: "NEXT_PUBLIC_SUPABASE_URL",
        value: process.env.NEXT_PUBLIC_SUPABASE_URL,
        required: true,
        description: "Your Supabase project URL",
      },
      {
        name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        required: true,
        description: "Supabase anonymous/public key",
      },
      {
        name: "SUPABASE_SERVICE_ROLE_KEY",
        value: process.env.SUPABASE_SERVICE_ROLE_KEY,
        required: true,
        description: "Supabase service role key (server-side only)",
      },
      {
        name: "NEXT_PUBLIC_BASE_URL",
        value: process.env.NEXT_PUBLIC_BASE_URL,
        required: false,
        description: "Your application's base URL",
      },
      {
        name: "AWS_ACCESS_KEY_ID",
        value: process.env.AWS_ACCESS_KEY_ID,
        required: false,
        description: "AWS access key for S3 storage",
      },
      {
        name: "AWS_SECRET_ACCESS_KEY",
        value: process.env.AWS_SECRET_ACCESS_KEY,
        required: false,
        description: "AWS secret key for S3 storage",
      },
      {
        name: "NEXT_PUBLIC_AWS_S3_BUCKET_NAME",
        value: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
        required: false,
        description: "S3 bucket name for file storage",
      },
    ]

    setEnvVars(checks)
    setLoading(false)
  }

  const requiredMissing = envVars.filter((env) => env.required && !env.value).length
  const optionalMissing = envVars.filter((env) => !env.required && !env.value).length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Environment Variables Check</h1>
        <p className="text-gray-600 mt-2">Verify that all required environment variables are properly configured</p>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Environment Status
            <Button variant="outline" size="sm" onClick={checkEnvironmentVariables} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>Overview of your environment configuration</CardDescription>
        </CardHeader>
        <CardContent>
          {requiredMissing === 0 ? (
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>All required environment variables are configured!</AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                {requiredMissing} required environment variable{requiredMissing > 1 ? "s are" : " is"} missing
              </AlertDescription>
            </Alert>
          )}

          {optionalMissing > 0 && (
            <Alert className="mt-2">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                {optionalMissing} optional environment variable{optionalMissing > 1 ? "s are" : " is"} not configured
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Environment Variables List */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>Status of all environment variables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {envVars.map((env) => (
              <div key={env.name} className="flex items-start justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{env.name}</code>
                    {env.required && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Required</span>
                    )}
                    {!env.required && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Optional</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{env.description}</p>
                  {env.value && (
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      {env.name.includes("KEY") || env.name.includes("SECRET")
                        ? `${env.value.substring(0, 8)}...`
                        : env.value}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  {env.value ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className={`w-5 h-5 ${env.required ? "text-red-500" : "text-yellow-500"}`} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Instructions</CardTitle>
          <CardDescription>How to set up missing environment variables</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Local Development (.env.local)</h3>
            <div className="bg-gray-50 p-3 rounded border">
              <pre className="text-sm">
                {`# Add these to your .env.local file
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_BASE_URL=${typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com"}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Vercel Production</h3>
            <p className="text-sm text-gray-600 mb-2">
              Add these in Vercel Dashboard → Project → Settings → Environment Variables
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-600">
              <li>Set environment to "Production", "Preview", and "Development"</li>
              <li>Copy the exact values from your Supabase dashboard</li>
              <li>Redeploy your application after adding variables</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
