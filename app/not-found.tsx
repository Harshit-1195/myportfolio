import { BackToHomeAlt } from "@/components/back-to-home-alt"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold mb-6">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-8">Sorry, the page you are looking for doesn't exist or has been moved.</p>
        <BackToHomeAlt />
      </div>
    </div>
  )
}
