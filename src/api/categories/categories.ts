import { apiClient } from '../client'

export const getCategories = async () => {
  try {
    const response = await apiClient.get('/categories')
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch categories')
  }
}

export const createCategory = async (data: { title: string }) => {
  try {
    const response = await apiClient.post('/categories', {
      title: data.title,
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create category')
  }
}

export const deleteCategory = async (id: string) => {
  try {
    const response = await apiClient.delete(`/categories/${id}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to delete category')
  }
}

export const updateCategory = async (data: { id: string; title: string }) => {
  try {
    const response = await apiClient.put(`/categories/${data.id}`, {
      title: data.title,
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to update category')
  }
}
