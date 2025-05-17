import {
  useDeleteAuthor,
  useGetAuthors,
  useUpdateAuthor,
} from '@/api/author/hooks'
import { ErrorFallback } from '@/components/error-fallback'
import { AddAuthorForm } from '@/features/author/AddAuthorForm'
import type { Author } from '@/lib/types/Author'
import { useQueryClient } from '@tanstack/react-query'
import { Edit, Images, Trash2, Upload, X } from 'lucide-react'
import { useMemo, useRef, useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import toast from 'react-hot-toast'
import { ACCEPTED_IMAGE_TYPES } from '@/lib/constants'

export const AuthorPage = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useGetAuthors()
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateMutation = useUpdateAuthor()

  const authors = useMemo(() => {
    return data || []
  }, [data])

  const deleteMutation = useDeleteAuthor()

  // Clean up image URL when unmounting or changing edited author
  useEffect(() => {
    return () => {
      if (editImageUrl && !editImageUrl.startsWith('http')) {
        URL.revokeObjectURL(editImageUrl)
      }
    }
  }, [editImageUrl])

  const handleDelete = async (id: string) => {
    toast.promise(
      deleteMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['authors'] })
        },
      }),
      {
        loading: 'Deleting author...',
        success: 'Author deleted successfully',
        error: 'Failed to delete author',
      }
    )
  }

  const handleEdit = (author: Author) => {
    setEditingAuthor(author)
    setEditName(author.name)
    setEditBio(author.bio || '')
    setEditImageUrl(author.avatar || null)

    // Reset file input if it exists
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCancelEdit = () => {
    // Clean up any object URL if it exists
    if (editImageUrl && !editImageUrl.startsWith('http')) {
      URL.revokeObjectURL(editImageUrl)
    }

    setEditingAuthor(null)
    setEditName('')
    setEditBio('')
    setEditImageUrl(null)
  }

  const handleSaveEdit = async () => {
    if (!editingAuthor) return

    toast.promise(
      updateMutation.mutateAsync(
        {
          id: editingAuthor.id,
          name: editName,
          bio: editBio,
          avatar: editImageUrl,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authors'] })

            // Clean up any object URL if it exists
            if (editImageUrl && !editImageUrl.startsWith('http')) {
              URL.revokeObjectURL(editImageUrl)
            }

            setEditingAuthor(null)
            setEditName('')
            setEditBio('')
            setEditImageUrl(null)
          },
        }
      ),
      {
        loading: 'Updating author...',
        success: 'Author updated successfully',
        error: 'Failed to update author',
      }
    )
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (!files || files.length === 0) {
      setEditImageUrl(null)
      return
    }

    const file = files[0]

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Only image files (JPG, PNG, WEBP) are allowed.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Clean up previous URL if it exists
    if (editImageUrl && !editImageUrl.startsWith('http')) {
      URL.revokeObjectURL(editImageUrl)
    }

    // Generate preview
    const previewUrl = URL.createObjectURL(file)
    setEditImageUrl(previewUrl)

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = () => {
    // Clean up URL if it's a blob URL
    if (editImageUrl && !editImageUrl.startsWith('http')) {
      URL.revokeObjectURL(editImageUrl)
    }

    setEditImageUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Authors</h2>
        <AddAuthorForm />
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-medium text-gray-700">
            Author List
          </h3>
          {isLoading ? (
            <ul className="divide-y divide-gray-200">
              {[...Array(3)].map((_, i) => (
                <li key={i} className="flex animate-pulse items-center py-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 w-32 rounded bg-gray-200"></div>
                    <div className="mt-2 h-3 w-full rounded bg-gray-200"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-4 w-10 rounded bg-gray-200"></div>
                    <div className="h-4 w-12 rounded bg-gray-200"></div>
                  </div>
                </li>
              ))}
            </ul>
          ) : authors.length === 0 ? (
            <p className="text-gray-500 italic">No authors added yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {authors.map((author: Author) => (
                <li key={author.id} className="py-4">
                  {editingAuthor && editingAuthor.id === author.id ? (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <label className="w-20 font-medium text-gray-700">
                          Name:
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
                          <Images
                            className="h-5 w-5 text-gray-500"
                            aria-hidden="true"
                          />
                          Avatar Image
                        </label>

                        {editImageUrl ? (
                          <div className="group relative mb-4 overflow-hidden rounded-lg shadow-md">
                            <img
                              src={editImageUrl}
                              alt="Avatar Preview"
                              className="h-48 w-full object-cover"
                              loading="lazy"
                            />
                            <button
                              type="button"
                              className="bg-opacity-60 hover:bg-opacity-80 absolute top-2 right-2 rounded-full bg-black p-1 text-white transition-all"
                              onClick={removeImage}
                              aria-label="Remove image"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="edit-image-upload"
                            className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 transition-all hover:border-blue-500 hover:bg-blue-50"
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
                              id="edit-image-upload"
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleImageChange}
                              ref={fileInputRef}
                              className="sr-only"
                            />
                          </label>
                        )}
                      </div>
                      <div className="flex">
                        <label className="w-20 font-medium text-gray-700">
                          Bio:
                        </label>
                        <textarea
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          rows={3}
                          className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          onClick={handleSaveEdit}
                          className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="rounded bg-gray-300 px-4 py-2 text-sm hover:bg-gray-400"
                          disabled={updateMutation.isPending}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                        {author.avatar ? (
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                            {author.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-gray-900">
                          {author.name}
                        </h4>
                        {author.bio && (
                          <p className="mt-1 text-sm text-gray-500">
                            {author.bio}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(author)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-5 w-5 text-purple-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(author.id)}
                          className="cursor-pointer"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
