"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Briefcase,
  ArrowUpDown,
  MoveUp,
  MoveDown,
} from "lucide-react"

interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  featured_image: string | null
  is_featured: boolean
  order_index: number
  created_at: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Project>("order_index")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchProjects()
  }, [sortField, sortDirection])

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" })

      if (error) {
        throw error
      }

      setProjects(data || [])
    } catch (error: any) {
      console.error("Error fetching projects:", error)
      setError(error.message || "Failed to fetch projects")
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: keyof Project) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    setError(null)

    try {
      const { error } = await supabase.from("projects").delete().eq("id", deleteId)

      if (error) {
        throw error
      }

      setProjects(projects.filter((project) => project.id !== deleteId))
      setDeleteId(null)
    } catch (error: any) {
      console.error("Error deleting project:", error)
      setError(error.message || "Failed to delete project")
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleFeaturedStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("projects").update({ is_featured: !currentStatus }).eq("id", id)

      if (error) {
        throw error
      }

      // Update the local state
      setProjects(
        projects.map((project) => (project.id === id ? { ...project, is_featured: !currentStatus } : project)),
      )
    } catch (error: any) {
      console.error("Error updating featured status:", error)
      setError(error.message || "Failed to update featured status")
    }
  }

  const moveProjectOrder = async (id: string, direction: "up" | "down") => {
    const currentIndex = projects.findIndex((project) => project.id === id)
    if (currentIndex === -1) return

    // Can't move up if already at the top
    if (direction === "up" && currentIndex === 0) return

    // Can't move down if already at the bottom
    if (direction === "down" && currentIndex === projects.length - 1) return

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    const currentProject = projects[currentIndex]
    const targetProject = projects[targetIndex]

    // Swap order_index values
    try {
      const swapPromises = [
        supabase.from("projects").update({ order_index: targetProject.order_index }).eq("id", currentProject.id),
        supabase.from("projects").update({ order_index: currentProject.order_index }).eq("id", targetProject.id),
      ]

      const results = await Promise.all(swapPromises)
      const errors = results.filter((result) => result.error)

      if (errors.length > 0) {
        throw errors[0].error
      }

      // Update local state by swapping the items
      const updatedProjects = [...projects]
      updatedProjects[currentIndex] = { ...targetProject, order_index: currentProject.order_index }
      updatedProjects[targetIndex] = { ...currentProject, order_index: targetProject.order_index }

      setProjects(updatedProjects)
    } catch (error: any) {
      console.error("Error updating project order:", error)
      setError(error.message || "Failed to update project order")
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="container mx-auto py-28 px-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">Manage your portfolio projects</p>
        </div>

        <Link href="/admin/projects/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-md text-red-300">{error}</div>}

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            All Projects
          </h2>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-gray-500 mb-3" />
            <h3 className="text-xl font-medium text-white mb-1">No projects found</h3>
            <p className="text-gray-400">
              {searchQuery ? "Try a different search term" : "Create your first project to get started"}
            </p>
            {!searchQuery && (
              <Link href="/admin/projects/new">
                <Button className="mt-4">Create Project</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800">
                  <TableHead className="text-gray-400 cursor-pointer" onClick={() => handleSort("order_index")}>
                    <div className="flex items-center gap-1">
                      Order
                      {sortField === "order_index" && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-400 cursor-pointer" onClick={() => handleSort("title")}>
                    <div className="flex items-center gap-1">
                      Title
                      {sortField === "title" && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-400">Preview</TableHead>
                  <TableHead className="text-gray-400 cursor-pointer" onClick={() => handleSort("is_featured")}>
                    <div className="flex items-center gap-1">
                      Featured
                      {sortField === "is_featured" && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-400 cursor-pointer" onClick={() => handleSort("created_at")}>
                    <div className="flex items-center gap-1">
                      Created
                      {sortField === "created_at" && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="border-gray-700 hover:bg-gray-750">
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-1">
                        <span className="font-mono bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                          {project.order_index}
                        </span>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => moveProjectOrder(project.id, "up")}
                            disabled={projects.indexOf(project) === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => moveProjectOrder(project.id, "down")}
                            disabled={projects.indexOf(project) === projects.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      <div className="flex flex-col">
                        <span>{project.title}</span>
                        <span className="text-xs text-gray-400">/projects/{project.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {project.featured_image ? (
                        <div className="relative h-12 w-20 rounded overflow-hidden">
                          <img
                            src={project.featured_image || "/placeholder.svg"}
                            alt={project.title}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = "/abstract-geometric-shapes.png"
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No image</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          project.is_featured ? "bg-purple-900/30 text-purple-400" : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {project.is_featured ? "Featured" : "Regular"}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">{new Date(project.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFeaturedStatus(project.id, project.is_featured)}
                          title={project.is_featured ? "Unfeature" : "Feature"}
                        >
                          {project.is_featured ? (
                            <EyeOff className="h-4 w-4 text-purple-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>

                        <Link href={`/projects/${project.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4 text-gray-400" />
                          </Button>
                        </Link>

                        <Link href={`/admin/projects/edit/${project.id}`}>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Edit className="h-4 w-4 text-blue-400" />
                          </Button>
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Delete" onClick={() => setDeleteId(project.id)}>
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-800 border-gray-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                This will permanently delete the project "{project.title}". This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={handleDelete}
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                  </>
                                ) : (
                                  "Delete"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>
    </div>
  )
}
