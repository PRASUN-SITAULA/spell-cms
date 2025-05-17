import { useMutation, useQuery } from '@tanstack/react-query'
import { createAuthor, deleteAuthor, getAuthors, updateAuthor } from './authors'

export const useGetAuthors = () => {
  return useQuery({
    queryKey: ['authors'],
    queryFn: getAuthors,
  })
}

export const useCreateAuthor = () => {
  return useMutation({
    mutationFn: createAuthor,
  })
}

export const useUpdateAuthor = () => {
  return useMutation({
    mutationFn: updateAuthor,
  })
}

export const useDeleteAuthor = () => {
  return useMutation({
    mutationFn: deleteAuthor,
  })
}
