import { SupabaseConnectionTest } from "@/components/supabase-connection-test"

export default function SupabaseTestPage() {
  return (
    <div className="container mx-auto py-28 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-white">Supabase Integration Test</h1>

      <div className="space-y-8">
        <SupabaseConnectionTest />

        <div className="p-4 rounded-lg border glass-panel">
          <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
          <p className="mb-4 text-sm text-white/70">
            These are the environment variables being used for Supabase integration:
          </p>

          <div className="space-y-2">
            <div className="p-2 bg-black/30 rounded font-mono text-sm">
              NEXT_PUBLIC_SUPABASE_URL:{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nktkomwmqstnzmsegdzc.supabase.co"}
            </div>
            <div className="p-2 bg-black/30 rounded font-mono text-sm">
              NEXT_PUBLIC_SUPABASE_ANON_KEY:{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Not set (using fallback)"}
            </div>
            <div className="p-2 bg-black/30 rounded font-mono text-sm">
              SUPABASE_SERVICE_ROLE_KEY:{" "}
              {process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓ Set" : "✗ Not set (some admin functions may not work)"}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border glass-panel">
          <h2 className="text-xl font-bold mb-4">Next Steps</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Visit{" "}
              <a href="/admin/cms" className="text-blue-400 hover:underline">
                /admin/cms
              </a>{" "}
              to manage your content
            </li>
            <li>
              Visit{" "}
              <a href="/admin/cms/media" className="text-blue-400 hover:underline">
                /admin/cms/media
              </a>{" "}
              to manage your media files
            </li>
            <li>Run the database setup script to initialize your tables</li>
            <li>Start adding content to your portfolio</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
