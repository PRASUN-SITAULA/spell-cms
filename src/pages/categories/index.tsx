import {
  useDeleteCategory,
  useGetCategories,
  useUpdateCategory,
} from '@/api/categories/hooks'
import { ErrorFallback } from '@/components/error-fallback'
import FormField from '@/components/form-field'
import { AddCategoryForm } from '@/features/categories/AddCategoryForm'
import { CategorySchema } from '@/lib/schema/CategorySchema'
import type { Category } from '@/lib/types/Category'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Edit, Trash2, Type } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import type { z } from 'zod'

export const CategoryPage = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useGetCategories()
  const [editingCategory, setEditingCategory] = useState<Category | null>()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
  })

  const categories = useMemo(() => {
    return data || []
  }, [data])

  const mutation = useDeleteCategory()

  const handleDelete = async (id: string) => {
    toast.promise(
      mutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['categories'] })
        },
      }),
      {
        loading: 'Deleting category...',
        success: 'Category deleted successfully',
        error: 'Failed to delete category',
      }
    )
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    reset({ title: category.title })
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
  }

  const updateMutation = useUpdateCategory()

  const handleSaveEdit = async (data: z.infer<typeof CategorySchema>) => {
    if (!editingCategory) return

    toast.promise(
      updateMutation.mutateAsync(
        { id: editingCategory.id, title: data.title },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            setEditingCategory(null)
          },
        }
      ),
      {
        loading: 'Updating category...',
        success: 'Category updated successfully',
        error: 'Failed to update category',
      }
    )
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Categories</h2>
        <AddCategoryForm />
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-medium text-gray-700">
            Category List
          </h3>
          {isLoading ? (
            <ul className="divide-y divide-gray-200">
              {[...Array(3)].map((_, i) => (
                <li
                  key={i}
                  className="flex animate-pulse items-center justify-between py-3"
                >
                  <div className="h-4 w-32 rounded bg-gray-200"></div>
                  <div className="flex gap-2">
                    <div className="h-4 w-10 rounded bg-gray-200"></div>
                    <div className="h-4 w-12 rounded bg-gray-200"></div>
                  </div>
                </li>
              ))}
            </ul>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 italic">No categories added yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {categories.map((category: Category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between py-3"
                >
                  {editingCategory && editingCategory.id === category.id ? (
                    <form
                      onSubmit={handleSubmit(handleSaveEdit)}
                      className="flex w-full items-center"
                    >
                      <div className="flex w-full items-end space-x-2">
                        <div className="flex w-full flex-col gap-2">
                          <FormField
                            label="Title"
                            id="title"
                            register={register('title')}
                            error={errors.title}
                            Icon={Type}
                          />
                          <div className="flex space-x-2">
                            <button className="rounded bg-purple-600 px-2 py-1 text-sm text-white hover:bg-blue-600">
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="rounded bg-gray-300 px-2 py-1 text-sm hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <>
                      <span className="text-gray-800">{category.title}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-5 w-5 text-purple-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="cursor-pointer"
                        >
                          <Trash2 className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    </>
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
