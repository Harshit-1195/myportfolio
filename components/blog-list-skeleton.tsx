export default function BlogListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-10 w-32 bg-gray-700/30 rounded animate-pulse"></div>
        <div className="h-10 w-24 bg-gray-700/30 rounded animate-pulse"></div>
      </div>

      <div className="h-12 w-full bg-gray-700/30 rounded animate-pulse"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="glass-panel rounded-lg overflow-hidden">
            <div className="h-48 w-full bg-gray-700/30 animate-pulse"></div>
            <div className="p-6 space-y-4">
              <div className="h-4 w-32 bg-gray-700/30 rounded animate-pulse"></div>
              <div className="h-6 w-full bg-gray-700/30 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-700/30 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-700/30 rounded animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-700/30 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <div className="h-10 w-64 bg-gray-700/30 rounded animate-pulse"></div>
      </div>
    </div>
  )
}
