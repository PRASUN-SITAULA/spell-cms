import { apiClient } from '../client'

interface GetBlogsParams {
  searchTerm?: string
  tag?: string
  status?: string
  categoryId?: string
}

export const getBlogs = async ({
  searchTerm,
  tag,
  status,
  categoryId,
}: GetBlogsParams = {}) => {
  try {
    let url = '/posts?_expand=author&_expand=category'
    if (searchTerm) url += `&title_like=${encodeURIComponent(searchTerm)}`
    if (tag) url += `&tags_like=${encodeURIComponent(tag)}`
    if (status) url += `&status=${status}`
    if (categoryId) url += `&categoryId=${categoryId}`

    const response = await apiClient.get(url)
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch blogs')
  }
}

export const createBlog = async (data: {
  title: string
  authorId: string
  categoryId: string
  tags: string[]
  body: string
  status: 'Draft' | 'Published'
  coverImageUrl?: string | null
  createdAt: Date
}) => {
  try {
    const response = await apiClient.post('/posts', data)
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create blog')
  }
}

export const changeBlogStatus = async (data: {
  id: string
  status: string
}) => {
  try {
    const response = await apiClient.patch(`/posts/${data.id}`, {
      status: data.status,
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create blog')
  }
}

export const deleteBlog = async (id: string) => {
  try {
    const response = await apiClient.delete(`/posts/${id}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to delete blog')
  }
}

export const updateBlog = async (data: {
  id: string
  title: string
  authorId: string
  categoryId: string
  tags: string[]
  body: string
  status: 'Draft' | 'Published'
  coverImageUrl?: string | null
}) => {
  try {
    const response = await apiClient.patch(`/posts/${data.id}`, data)
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to update blog')
  }
}
