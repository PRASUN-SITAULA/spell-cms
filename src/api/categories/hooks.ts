import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from './categories'

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: createCategory,
  })
}

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
}

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: deleteCategory,
  })
}

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: updateCategory,
  })
}
