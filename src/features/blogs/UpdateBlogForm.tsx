import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Type,
  User,
  FileText,
  X,
  Images,
  Upload,
  Tag,
  Briefcase,
  FileCheck,
} from 'lucide-react'
import FormField from '@/components/form-field'
import { BlogSchema } from '@/lib/schema/BlogSchema'
import { ACCEPTED_IMAGE_TYPES } from '@/lib/constants'
import { SubmitButton } from '@/components/submit-button'
import { useGetAuthors } from '@/api/author/hooks'
import type { Author } from '@/lib/types/Author'
import { useGetCategories } from '@/api/categories/hooks'
import type { Category } from '@/lib/types/Category'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdateBlog } from '@/api/blogs/hooks'
import { useNavigate } from 'react-router'
import type { Blog } from '@/lib/types/Blog'
import MDEditor from '@uiw/react-md-editor'

export default function UpdateBlogPostForm({
  blog,
  handleCancelEdit,
}: {
  blog: Blog
  handleCancelEdit: () => void
}) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useUpdateBlog()

  const { data: authorsData, isLoading: authorsLoading } = useGetAuthors()
  const authors = useMemo(() => {
    return authorsData || []
  }, [authorsData])

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategories()
  const categories = useMemo(() => {
    return categoriesData || []
  }, [categoriesData])

  const [tagInput, setTagInput] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof BlogSchema>>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      title: blog.title,
      body: blog.body,
      authorId: String(blog.author.id),
      categoryId: String(blog.category.id),
      status: blog.status,
      tags: blog.tags,
      coverImage: null,
    },
  })

  // Watch values for preview
  const watchedFields = watch()

  const addTag = () => {
    if (tagInput.trim() !== '') {
      const currentTags = watch('tags') || []
      if (!currentTags.includes(tagInput.trim())) {
        setValue('tags', [...currentTags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = watch('tags') || []
    setValue(
      'tags',
      currentTags.filter((tag) => tag !== tagToRemove)
    )
  }

  // Clean up image URL when unmounting
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (!files || files.length === 0) {
      setValue('coverImage', null, { shouldValidate: true })
      return
    }
    const file = files[0]

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('coverImage', {
        type: 'manual',
        message: 'Only image files (JPG, PNG, WEBP) are allowed.',
      })
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    clearErrors('coverImage')
    setValue('coverImage', file, { shouldValidate: true })

    const previewUrl = URL.createObjectURL(file)
    setImageUrl(previewUrl)
  }

  const removeImage = () => {
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl)
    }
    setImageUrl(null)
    setValue('coverImage', null, { shouldValidate: true })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Handle form submission
  const onSubmit = (data: z.infer<typeof BlogSchema>) => {
    const mutationData = {
      id: blog.id,
      title: data.title,
      authorId: data.authorId,
      body: data.body,
      categoryId: data.categoryId,
      tags: data.tags,
      status: data.status,
      coverImageUrl: imageUrl,
    }

    mutation.mutate(mutationData, {
      onSuccess: () => {
        toast.success('Blog post created successfully!')
        queryClient.invalidateQueries({ queryKey: ['blogs'] })
        navigate('/')
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <FormField
            label="Blog Title"
            id="title"
            register={register('title')}
            error={errors.title}
            Icon={Type}
          />
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="h-5 w-5 text-gray-500" aria-hidden="true" />
              Content
            </label>
            <MDEditor
              value={watchedFields.body || ''}
              onChange={(value) =>
                setValue('body', value || '', { shouldValidate: true })
              }
              height={400}
              preview="edit"
              style={{ backgroundColor: 'white', color: 'black' }}
              className={`mt-1 w-full rounded-lg border shadow-sm ${
                errors.body ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.body && (
              <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="authorId"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <User className="h-5 w-5 text-gray-500" aria-hidden="true" />
                Author
              </label>
              <select
                id="authorId"
                {...register('authorId')}
                value={watchedFields.authorId || ''}
                className={`mt-1 block w-full rounded-lg border px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none ${
                  errors.authorId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={authorsLoading}
              >
                <option value="">Select Author</option>
                {authors.map((author: Author) => (
                  <option key={author.id} value={String(author.id)}>
                    {author.name}
                  </option>
                ))}
              </select>
              {errors.authorId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.authorId.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="categoryId"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Briefcase
                  className="h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
                Category
              </label>
              <select
                id="categoryId"
                {...register('categoryId')}
                value={watchedFields.categoryId || ''}
                className={`mt-1 block w-full rounded-lg border px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={categoriesLoading}
              >
                <option value="">Select Category</option>
                {categories.map((category: Category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.title}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Media and tags */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="coverImage"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <Images className="h-5 w-5 text-gray-500" aria-hidden="true" />
              Cover Image
            </label>

            {imageUrl ? (
              <div className="group relative overflow-hidden rounded-lg shadow-md">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="aspect-video w-full object-cover transition-transform hover:scale-105"
                  loading="lazy"
                />
                {!isSubmitting && (
                  <button
                    type="button"
                    className="bg-opacity-60 hover:bg-opacity-80 absolute top-2 right-2 rounded-full bg-black p-2 text-white transition-all"
                    onClick={(e) => {
                      e.preventDefault()
                      removeImage()
                    }}
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 transition-all hover:border-indigo-500 hover:bg-indigo-50"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-3 rounded-full bg-indigo-100 p-3">
                    <Upload className="h-6 w-6 text-indigo-600" />
                  </div>
                  <p className="mb-1 text-sm font-semibold text-gray-700">
                    Click or drag file to upload
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports JPG, PNG, WEBP (Max 1MB)
                  </p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="sr-only"
                />
              </label>
            )}
            {errors.coverImage && (
              <p className="mt-2 text-sm text-red-600">
                {errors.coverImage.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="tags"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <Tag className="h-5 w-5 text-gray-500" aria-hidden="true" />
              Tags
            </label>

            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="block w-full rounded-l-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                placeholder="Add a tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-r-lg bg-indigo-50 px-4 text-indigo-600 transition-colors hover:bg-indigo-100 focus:bg-indigo-100 focus:outline-none"
              >
                Add
              </button>
            </div>

            {watchedFields?.tags && watchedFields?.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {watchedFields.tags.map((tag) => (
                  <span
                    key={tag}
                    className="group inline-flex items-center rounded-md bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-indigo-400 transition-colors hover:bg-indigo-200 hover:text-indigo-600 focus:outline-none"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No tags added yet</p>
            )}
          </div>
          <div>
            <label
              htmlFor="status"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <FileCheck className="h-5 w-5 text-gray-500" aria-hidden="true" />
              Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-end border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={handleCancelEdit}
          className="mr-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <SubmitButton pending={mutation.isPending} pendingText="Updating...">
          Update Blog Post
        </SubmitButton>
      </div>
    </form>
  )
}
