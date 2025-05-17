import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, BarChart, MessageSquare } from "lucide-react"
import { getFormSubmissionStats } from "@/lib/actions"

export default async function AdminPage() {
  // Get form submission stats
  const stats = await getFormSubmissionStats()

  return (
    <div className="container mx-auto py-28 px-4 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass-panel p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-1 text-white">Total Submissions</h3>
          <p className="text-3xl font-bold text-white">{stats.totalCount}</p>
          <p className="text-sm text-white/50 mt-1">All time</p>
        </div>

        <div className="glass-panel p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-1 text-white">Recent Submissions</h3>
          <p className="text-3xl font-bold text-white">{stats.lastWeekCount}</p>
          <p className="text-sm text-white/50 mt-1">Last 7 days</p>
        </div>

        <div className="glass-panel p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-1 text-white">Active Assets</h3>
          <p className="text-3xl font-bold text-white">-</p>
          <p className="text-sm text-white/50 mt-1">Available for download</p>
        </div>

        <div className="glass-panel p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-1 text-white">Total Downloads</h3>
          <p className="text-3xl font-bold text-white">-</p>
          <p className="text-sm text-white/50 mt-1">All time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link href="/admin/assets">
          <div className="glass-panel p-8 rounded-lg text-center hover:scale-105 transition-transform duration-300">
            <FileText className="h-12 w-12 mx-auto mb-4 text-white" />
            <h2 className="text-xl font-semibold mb-2 text-white">Manage Assets</h2>
            <p className="text-white/70">Upload and manage resume files and other assets</p>
          </div>
        </Link>

        <Link href="/admin/submissions">
          <div className="glass-panel p-8 rounded-lg text-center hover:scale-105 transition-transform duration-300">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-white" />
            <h2 className="text-xl font-semibold mb-2 text-white">Form Submissions</h2>
            <p className="text-white/70">View and export contact form submissions</p>
          </div>
        </Link>

        <div className="glass-panel p-8 rounded-lg text-center opacity-50 cursor-not-allowed">
          <BarChart className="h-12 w-12 mx-auto mb-4 text-white" />
          <h2 className="text-xl font-semibold mb-2 text-white">Analytics</h2>
          <p className="text-white/70">View download statistics and analytics</p>
        </div>
      </div>

      {stats.topReferrers.length > 0 && (
        <div className="glass-panel p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-white">Top Referrers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topReferrers.map((referrer, index) => (
              <div key={index} className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-medium text-white">{referrer.domain}</h3>
                <p className="text-white/70">{referrer.count} submissions</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-panel p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">Quick Start Guide</h2>
        <ol className="list-decimal list-inside space-y-2 text-white/70">
          <li>
            Go to <strong>Manage Assets</strong> to upload your resume PDF and portfolio presentation
          </li>
          <li>
            Make sure to set the correct <strong>name</strong> for your files:
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>
                <code>resume</code> - for your resume PDF
              </li>
              <li>
                <code>presentation</code> - for your portfolio presentation
              </li>
            </ul>
          </li>
          <li>
            Set the <strong>Active</strong> toggle to make the file available for download
          </li>
          <li>You can upload multiple versions and only the active ones will be available</li>
          <li>
            Check <strong>Form Submissions</strong> to view and export contact form submissions
          </li>
        </ol>
      </div>

      <div className="flex justify-end">
        <Link href="/">
          <Button variant="outline" className="glass-panel text-white border-white/20 hover:bg-white/10">
            Back to Website
          </Button>
        </Link>
      </div>
    </div>
  )
}
