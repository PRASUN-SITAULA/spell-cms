import AddBlogPostForm from '@/features/blogs/BlogForm'

export const AddBlog = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Create New Blog Post
        </h1>
        <p className="mt-2 text-gray-600">
          Fill in the details below to create a new blog post
        </p>
      </div>
      <div className="rounded-xl bg-white p-8 pl-0 shadow-lg">
        <AddBlogPostForm />
      </div>
    </div>
  )
}
