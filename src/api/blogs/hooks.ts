import { useMutation, useQuery } from '@tanstack/react-query'
import { createBlog, getBlogs } from './blogs'

export const useGetBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: () => getBlogs(),
  })
}

export const useCreateBlog = () => {
  return useMutation({
    mutationFn: createBlog,
  })
}
