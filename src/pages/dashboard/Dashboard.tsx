import { ErrorFallback } from '@/components/error-fallback'
import BlogCard from '@/features/blogs/BlogCard'
import { Plus } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'

export const Dashboard = () => {
  return (
    <div className="flex flex-col items-end justify-center space-x-6">
      <button className="cursor-pointer rounded-lg bg-purple-600 px-4 py-1 font-bold text-white hover:bg-purple-500">
        <span className="flex flex-row items-center justify-center">
          <Plus className="h-4 w-4" /> Create Blog
        </span>
      </button>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <BlogCard />
      </ErrorBoundary>
    </div>
  )
}
