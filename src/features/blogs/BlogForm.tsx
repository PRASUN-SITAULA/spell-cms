import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Type, User, FileText, X, Images, Upload } from 'lucide-react'
import FormField from '@/components/form-field'
import { BlogSchema } from '@/lib/schema/BlogSchema'
import { ACCEPTED_IMAGE_TYPES } from '@/lib/constants'
import { SubmitButton } from '@/components/submit-button'
// import { useCreateBlog } from '@/api/blogs/hooks'
// import toast from 'react-hot-toast'

// Mock data for dropdown options
const AUTHORS = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Alex Johnson' },
]

const CATEGORIES = [
  { id: 'tech', name: 'Technology' },
  { id: 'health', name: 'Health & Wellness' },
  { id: 'travel', name: 'Travel' },
  { id: 'food', name: 'Food & Cooking' },
]

export default function AddBlogPostForm() {
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
      title: '',
      body: '',
      authorId: '',
      category: '',
      tags: [],
      coverImage: null,
    },
  })
  // const mutation = useCreateBlog()

  // Watch values for preview
  const watchedFields = watch()

  // Add a new tag
  const addTag = () => {
    if (tagInput.trim() !== '') {
      const currentTags = watch('tags') || []
      if (!currentTags.includes(tagInput.trim())) {
        setValue('tags', [...currentTags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  // Remove a tag
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

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('coverImage', {
        type: 'manual',
        message: 'Only image files (JPG, PNG, WEBP) are allowed.',
      })
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Clear previous error
    clearErrors('coverImage')

    // Set file in form
    setValue('coverImage', file, { shouldValidate: true })

    // Generate preview
    const previewUrl = URL.createObjectURL(file)
    setImageUrl(previewUrl)

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    // reset the image url
    setImageUrl(null)
    setValue('coverImage', null, { shouldValidate: true })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Handle form submission
  const onSubmit = (data: z.infer<typeof BlogSchema>) => {
    // mutation.mutate(data, {
    //   onSuccess: () => {
    //     toast.success('Blog post created successfully!')
    //   },
    // })
    console.log(data)
  }
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-6 shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            label="Title"
            id="title"
            register={register('title')}
            error={errors.title}
            Icon={Type}
          />
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Body (Markdown or WYSIWYG)
            </label>
            <textarea
              id="body"
              rows={6}
              {...register('body')}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm ${
                errors.body ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.body && (
              <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="authorId"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Author
            </label>
            <select
              id="authorId"
              {...register('authorId')}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm ${
                errors.authorId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Author</option>
              {AUTHORS.map((author) => (
                <option key={author.id} value={author.id}>
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
              htmlFor="category"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Category
            </label>
            <select
              id="category"
              {...register('category')}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="tags"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Tags
            </label>

            <div className="mt-1 flex overflow-hidden border-0">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="items-center rounded-md border-1 border-gray-300 bg-gray-50 px-3 text-gray-500 transition-colors hover:cursor-pointer hover:bg-gray-100 focus:inline-flex focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>

            {watchedFields?.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {watchedFields?.tags.map((tag) => (
                  <span
                    key={tag}
                    className="group inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 transition-colors group-hover:bg-blue-200 group-hover:text-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="w-full">
            <div className="mb-4">
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
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                  {!isSubmitting && (
                    <button
                      type="button"
                      className="bg-opacity-60 hover:bg-opacity-80 absolute top-2 right-2 rounded-full bg-black p-1 text-white transition-all"
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
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 transition-all hover:border-blue-500 hover:bg-blue-50"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-3 rounded-full bg-indigo-100 p-3">
                      <Upload className="h-6 w-6 text-indigo-600" />
                    </div>
                    <p className="mb-1 text-sm font-medium text-gray-700">
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
            </div>
          </div>
          <SubmitButton pending={isSubmitting} pendingText="Creating">
            Create Blog Post
          </SubmitButton>
        </form>
      </div>
    </div>
  )
}
