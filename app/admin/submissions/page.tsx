"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Download, Search } from "lucide-react"
import Link from "next/link"

interface FormSubmission {
  id: string
  first_name: string
  last_name: string
  email: string
  subject: string
  message: string
  user_agent: string | null
  referrer: string | null
  created_at: string
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch submissions on component mount
  useEffect(() => {
    fetchSubmissions()
  }, [])

  // Filter submissions when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSubmissions(submissions)
      return
    }

    const lowerCaseSearch = searchTerm.toLowerCase()
    const filtered = submissions.filter(
      (submission) =>
        submission.first_name.toLowerCase().includes(lowerCaseSearch) ||
        submission.last_name.toLowerCase().includes(lowerCaseSearch) ||
        submission.email.toLowerCase().includes(lowerCaseSearch) ||
        (submission.subject && submission.subject.toLowerCase().includes(lowerCaseSearch)) ||
        submission.message.toLowerCase().includes(lowerCaseSearch),
    )

    setFilteredSubmissions(filtered)
  }, [searchTerm, submissions])

  // Function to fetch submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/submissions")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch submissions")
      }

      setSubmissions(data.submissions)
      setFilteredSubmissions(data.submissions)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error fetching submissions:", err)
    } finally {
      setLoading(false)
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // Function to export submissions as CSV
  const exportCSV = () => {
    // Create CSV content
    const headers = ["First Name", "Last Name", "Email", "Subject", "Message", "Date"]
    const csvContent = [
      headers.join(","),
      ...filteredSubmissions.map((submission) => {
        return [
          `"${submission.first_name.replace(/"/g, '""')}"`,
          `"${submission.last_name.replace(/"/g, '""')}"`,
          `"${submission.email.replace(/"/g, '""')}"`,
          `"${submission.subject?.replace(/"/g, '""') || ""}"`,
          `"${submission.message.replace(/"/g, '""')}"`,
          `"${formatDate(submission.created_at)}"`,
        ].join(",")
      }),
    ].join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `form-submissions-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto py-28 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="icon" className="glass-panel text-white border-white/20 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Form Submissions</h1>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search submissions..."
              className="pl-9 glass-panel text-white border-white/20 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            className="gap-2 glass-panel text-white border-white/20 hover:bg-white/10"
            onClick={exportCSV}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-md mb-6">{error}</div>}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white/70">Loading submissions...</p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-lg">
          <h2 className="mt-4 text-xl font-semibold text-white">No submissions found</h2>
          {searchTerm ? (
            <p className="mt-2 text-white/70">Try adjusting your search terms.</p>
          ) : (
            <p className="mt-2 text-white/70">You haven't received any form submissions yet.</p>
          )}
        </div>
      ) : (
        <div className="glass-panel rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">
                    {submission.first_name} {submission.last_name}
                  </TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.subject || "—"}</TableCell>
                  <TableCell className="max-w-xs truncate">{submission.message}</TableCell>
                  <TableCell>{formatDate(submission.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
