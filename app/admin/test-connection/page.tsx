import SupabaseStatus from "@/components/supabase-status"

export default function TestConnectionPage() {
  return (
    <div className="container mx-auto py-28 px-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Test Supabase Connection</h1>
      <SupabaseStatus />
    </div>
  )
}
