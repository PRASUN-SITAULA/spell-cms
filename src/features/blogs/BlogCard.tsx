import {
  Calendar,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Tag,
  User,
  Folder,
} from 'lucide-react'
import { useGetBlogs } from '@/api/blogs/hooks'
import { SkeletonLoader } from '@/components/skeleton-loader'
import type { Blog } from '@/lib/types/Blog'
import { useMemo } from 'react'

export default function BlogCard() {
  const { data, isLoading } = useGetBlogs()

  const blogs: Blog[] = useMemo(() => {
    return data || []
  }, [data])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Blog Posts</h1>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.length === 0 && <p>No Blogs Found</p>}
          {blogs.map((blog: Blog) => (
            <div
              key={blog.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(blog?.createdAt).toDateString()}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    blog?.status === 'Published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {blog?.status}
                </span>
              </div>
              <div className="p-4">
                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  {blog?.title}
                </h2>
                <div className="mb-2 flex items-center">
                  <User className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{blog?.author}</span>
                </div>
                <div className="mb-3 flex items-center">
                  <Folder className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {blog?.category}
                  </span>
                </div>
                <div className="mb-4 flex flex-wrap items-center">
                  <Tag className="mr-2 h-4 w-4 text-gray-500" />
                  <div className="flex flex-wrap">
                    {blog.tags &&
                      blog?.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="mr-1 mb-1 rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
                <div className="flex space-x-2">
                  <button
                    className="rounded p-1 transition-colors duration-200 hover:bg-gray-200"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    className="rounded p-1 transition-colors duration-200 hover:bg-red-100"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
                <button
                  className="rounded p-1 transition-colors duration-200 hover:bg-gray-200"
                  title={blog?.status === 'Published' ? 'Unpublish' : 'Publish'}
                >
                  {blog?.status === 'Published' ? (
                    <EyeOff className="h-5 w-5 text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-green-600" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
