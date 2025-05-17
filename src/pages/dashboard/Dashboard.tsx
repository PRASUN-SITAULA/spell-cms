import { ErrorFallback } from '@/components/error-fallback'
import BlogCard from '@/features/blogs/BlogCard'
import { Plus } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'
import { Link } from 'react-router'

export const Dashboard = () => {
  return (
    <div className="container mx-auto px-2 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">My Blog Dashboard</h1>
        <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2 font-medium text-white shadow-md transition-all hover:bg-purple-700 hover:shadow-lg">
          <Link to="add-blogs" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Blog</span>
          </Link>
        </button>
      </div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <BlogCard />
      </ErrorBoundary>
    </div>
  )
}
