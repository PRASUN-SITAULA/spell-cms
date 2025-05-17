import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { AuthorSchema } from '@/lib/schema/AuthorSchema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import FormField from '@/components/form-field'
import { FileText, Images, Type, Upload, X } from 'lucide-react'
import { ACCEPTED_IMAGE_TYPES } from '@/lib/constants'
import { useCreateAuthor } from '@/api/author/hooks'
import { SubmitButton } from '@/components/submit-button'

export const AddAuthorForm = () => {
  const queryClient = useQueryClient()
  const [imageUrl, setImageUrl] = useState<string | null>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const mutation = useCreateAuthor()

  const {
    handleSubmit,
    register,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<z.infer<typeof AuthorSchema>>({
    resolver: zodResolver(AuthorSchema),
    defaultValues: {
      name: '',
      avatar: null,
      bio: '',
    },
  })

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
      setValue('avatar', null, { shouldValidate: true })
      return
    }

    const file = files[0]

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('avatar', {
        type: 'manual',
        message: 'Only image files (JPG, PNG, WEBP) are allowed.',
      })
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Clear previous error
    clearErrors('avatar')

    // Set file in form
    setValue('avatar', file, { shouldValidate: true })

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
    setValue('avatar', null, { shouldValidate: true })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async (data: z.infer<typeof AuthorSchema>) => {
    const mutationData = {
      name: data.name,
      avatar: imageUrl,
      bio: data.bio,
    }
    mutation.mutate(mutationData, {
      onSuccess: () => {
        toast.success('Author created successfully!')
        queryClient.invalidateQueries({ queryKey: ['authors'] })
      },
    })
  }

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full cursor-pointer rounded-md bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 focus:outline-none"
        >
          Add New Author
        </button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <FormField
              label="name"
              id="name"
              register={register('name')}
              error={errors.name}
              Icon={Type}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Biograpghy
            </label>
            <textarea
              id="body"
              rows={6}
              {...register('bio')}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm ${
                errors.bio ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>
          <div className="w-full">
            <div className="mb-4">
              <label
                htmlFor="avatar"
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
                  {!mutation.isPending && (
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

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none"
            >
              Cancel
            </button>
            <SubmitButton pending={mutation.isPending} pendingText="Adding...">
              Add Author
            </SubmitButton>
          </div>
        </form>
      )}
    </div>
  )
}
