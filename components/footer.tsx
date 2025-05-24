"use client"

import { Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="font-serif mb-4">
              <h1 className="text-xl font-bold tracking-tight">H11D</h1>
              <h2 className="text-xl font-bold tracking-tight -mt-2">HARSHIT</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4 max-w-xs">
              Performance & Programmatic Manager with expertise in digital marketing, media buying, and campaign
              optimization. Specializing in global programmatic campaigns and data-driven strategies.
            </p>
            <div className="flex space-x-4">
              {[
                { href: "https://www.linkedin.com/in/harshitdabhi/", icon: <Linkedin size={20} />, label: "LinkedIn" },
                { href: "mailto:dabhiharshit11@gmail.com", icon: <Mail size={20} />, label: "Email" },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  className="text-gray-400 hover:text-white transition-colors relative z-10 block p-1"
                  rel="noreferrer"
                >
                  {link.icon}
                  <span className="sr-only">{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/resume", label: "Resume" },
                { href: "/work", label: "My Work" },
                { href: "/blog", label: "Blog" },
                { href: "/podcast", label: "Podcast" },
                { href: "/contact", label: "Contact" },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors relative z-10"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400">
              <p>Dubai, UAE</p>
              <p>dabhiharshit11@gmail.com</p>
              <p>+971 556453208</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex justify-between items-center">
          <div>
            <Link href="/admin/login" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Admin Login
            </Link>
          </div>
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Harshit Dabhi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
