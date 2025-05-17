import { useCreateCategory } from '@/api/categories/hooks'
import FormField from '@/components/form-field'
import { SubmitButton } from '@/components/submit-button'
import { CategorySchema } from '@/lib/schema/CategorySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Type } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

export const AddCategoryForm = () => {
  const queryClient = useQueryClient()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      title: '',
    },
  })

  const mutation = useCreateCategory()

  const onSubmit = (data: z.infer<typeof CategorySchema>) => {
    console.log('Form submitted with data:', data)
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success('Category created successfully!')
        queryClient.invalidateQueries({ queryKey: ['categories'] })
      },
    })
  }
  return (
    <div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <FormField
              label="Title"
              id="title"
              register={register('title')}
              error={errors.title}
              Icon={Type}
            />
          </div>
          <div className="flex items-center justify-end">
            <SubmitButton pending={mutation.isPending} pendingText="Adding ...">
              Add Category
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}
