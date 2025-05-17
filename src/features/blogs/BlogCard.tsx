import {
  Calendar,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Tag,
  User,
  Folder,
  Inbox,
} from 'lucide-react'
import {
  useChangeBlogStatus,
  useDeleteBlog,
  useGetBlogs,
} from '@/api/blogs/hooks'
import { SkeletonLoader } from '@/components/skeleton-loader'
import type { Blog } from '@/lib/types/Blog'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useGetCategories } from '@/api/categories/hooks'
import type { Category } from '@/lib/types/Category'
import { useQueryClient } from '@tanstack/react-query'
import UpdateBlogPostForm from './UpdateBlogForm'

export default function BlogCard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTag, setSearchTag] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)

  const queryClient = useQueryClient()

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategories()
  const categories = useMemo(() => {
    return categoriesData || []
  }, [categoriesData])

  const { data, isLoading } = useGetBlogs({
    searchTerm,
    searchTag,
    selectedStatus,
    selectedCategory,
  })

  const blogs: Blog[] = useMemo(() => {
    return data || []
  }, [data])

  const mutation = useChangeBlogStatus()

  const handleStatusChange = (blog: Blog) => () => {
    toast.promise(
      mutation.mutateAsync({
        id: blog.id,
        status: blog.status === 'Published' ? 'Draft' : 'Published',
      }),
      {
        loading: 'Changing Blog Status...',
        success: 'Blog Status Changed Successfully!',
        error: 'Failed to change blog status',
      }
    )
  }

  const deleteMutation = useDeleteBlog()

  const handleDelete = async (id: string) => {
    toast.promise(
      deleteMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['blogs'] })
        },
      }),
      {
        loading: 'Deleting blog post...',
        success: 'Blog Post deleted successfully',
        error: 'Failed to delete blog post',
      }
    )
  }

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
  }
  const handleCancelEdit = () => {
    setEditingBlog(null)
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Blog Posts</h1>
      {editingBlog ? (
        <UpdateBlogPostForm
          blog={editingBlog}
          handleCancelEdit={handleCancelEdit}
        />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <input
              type="text"
              placeholder="Search by title..."
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by tags..."
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
            />
            <select
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
            <select
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={categoriesLoading}
            >
              <option value="">Select Category</option>
              {categories.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <>
              <div>
                {blogs.length === 0 && (
                  <div className="mx-auto flex flex-col items-center justify-center px-4 py-12 text-center">
                    <div className="mb-4 rounded-full bg-gray-100 p-4">
                      <Inbox size={48} className="text-gray-500" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      No Blogs Found
                    </h3>
                    <p className="mb-6 max-w-md text-gray-500">
                      There are currently no blog posts available.
                    </p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog: Blog) => (
                  <div
                    key={blog.id}
                    className="overflow-hidden rounded-lg border border-gray-200 shadow-md transition-shadow duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 p-4">
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
                        <span className="text-sm text-gray-700">
                          {blog?.author?.name}
                        </span>
                      </div>
                      <div className="mb-3 flex items-center">
                        <Folder className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {blog?.category?.title}
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
                          onClick={() => handleEdit(blog)}
                        >
                          <Edit className="h-5 w-5 text-purple-600" />
                        </button>
                        <button
                          className="cursor-pointer rounded p-1 transition-colors duration-200 hover:bg-red-100"
                          title="Delete"
                          onClick={() => handleDelete(blog.id)}
                        >
                          <Trash2 className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                      <button
                        className="cursor-pointer rounded p-1 transition-colors duration-200 hover:bg-gray-200"
                        title={
                          blog?.status === 'Published' ? 'Unpublish' : 'Publish'
                        }
                        onClick={handleStatusChange(blog)}
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
            </>
          )}
        </>
      )}
    </div>
  )
}
