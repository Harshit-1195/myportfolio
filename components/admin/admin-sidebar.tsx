"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, FolderOpen, ImageIcon, Settings, LogOut } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Blog Posts",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FolderOpen,
  },
  {
    title: "Media",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium",
              pathname === item.href || pathname?.startsWith(`${item.href}/`)
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.title}
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t">
          <Link
            href="/admin/logout"
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Link>
        </div>
      </nav>
    </div>
  )
}
