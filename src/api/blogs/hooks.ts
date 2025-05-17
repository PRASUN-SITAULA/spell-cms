import { useMutation, useQuery } from '@tanstack/react-query'
import {
  changeBlogStatus,
  createBlog,
  deleteBlog,
  getBlogs,
  updateBlog,
} from './blogs'

export const useGetBlogs = ({
  searchTerm,
  searchTag,
  selectedStatus,
  selectedCategory,
}: {
  searchTerm: string
  searchTag: string
  selectedStatus: string
  selectedCategory: string
}) => {
  return useQuery({
    queryKey: [
      'blogs',
      { searchTerm, searchTag, selectedStatus, selectedCategory },
    ],
    queryFn: () =>
      getBlogs({
        searchTerm,
        tag: searchTag,
        status: selectedStatus,
        categoryId: selectedCategory,
      }),
  })
}

export const useCreateBlog = () => {
  return useMutation({
    mutationFn: createBlog,
  })
}

export const useChangeBlogStatus = () => {
  return useMutation({
    mutationFn: changeBlogStatus,
  })
}

export const useDeleteBlog = () => {
  return useMutation({
    mutationFn: deleteBlog,
  })
}

export const useUpdateBlog = () => {
  return useMutation({
    mutationFn: updateBlog,
  })
}
