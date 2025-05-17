import { apiClient } from '../client'

export const getBlogs = async () => {
  try {
    const response = await apiClient.get('/posts')
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch blogs')
  }
}

export const createBlog = async (data: {
  title: string
  body: string
  category: string
  tags: string[]
  author: string[]
}) => {
  try {
    const response = await apiClient.post('/posts', data)
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create blog')
  }
}
