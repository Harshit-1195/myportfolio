export default function Loading() {
  return (
    <div className="container mx-auto py-28 px-4 max-w-4xl min-h-screen">
      <div className="animate-pulse">
        <div className="h-6 w-32 bg-white/10 rounded mb-6"></div>
        <div className="glass-panel p-8 rounded-lg mb-10">
          <div className="h-8 w-3/4 bg-white/10 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-white/10 rounded mb-8"></div>
          <div className="h-64 w-full bg-white/10 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-white/10 rounded"></div>
            <div className="h-4 w-full bg-white/10 rounded"></div>
            <div className="h-4 w-3/4 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
