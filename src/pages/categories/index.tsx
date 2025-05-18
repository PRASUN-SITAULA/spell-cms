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
import { Edit, Trash2, Save, X, Type } from 'lucide-react'
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
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-purple-700">Categories</h2>

        <div className="mb-8">
          <AddCategoryForm />
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            Category List
          </h3>

          {isLoading ? (
            <ul className="divide-y divide-gray-200">
              {[...Array(3)].map((_, i) => (
                <li
                  key={i}
                  className="mb-3 flex animate-pulse items-center justify-between rounded-lg bg-gray-50 px-4 py-4"
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
            <ul className="space-y-4">
              {categories.map((category: Category) => (
                <li
                  key={category.id}
                  className="flex items-start justify-between rounded-lg bg-gray-50 px-4 py-4 shadow-sm transition hover:shadow-md"
                >
                  {editingCategory && editingCategory.id === category.id ? (
                    <form
                      onSubmit={handleSubmit(handleSaveEdit)}
                      className="flex w-full flex-col gap-3"
                    >
                      <FormField
                        label="Title"
                        id="title"
                        register={register('title')}
                        error={errors.title}
                        Icon={Type}
                      />
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 rounded bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700"
                        >
                          <Save size={16} />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          type="button"
                          className="inline-flex items-center gap-1 rounded bg-gray-300 px-3 py-1 text-sm hover:bg-gray-400"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <span className="text-lg text-gray-800">
                        {category.title}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="inline-flex cursor-pointer items-center justify-center rounded-full p-1 text-purple-600 hover:bg-purple-100"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="inline-flex cursor-pointer items-center justify-center rounded-full p-1 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-5 w-5" />
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
