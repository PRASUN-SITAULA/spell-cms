import { apiClient } from '../client'

export const getAuthors = async () => {
  try {
    const response = await apiClient.get('/authors')
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('An error occurred while fetching authors:')
  }
}

export const createAuthor = async (data: {
  name: string
  avatar: string | null | undefined
  bio: string
}) => {
  try {
    const response = await apiClient.post('/authors', {
      name: data.name,
      avatar: data.avatar,
      bio: data.bio,
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create an author')
  }
}

export const updateAuthor = async (data: {
  id: string
  name: string
  avatar: string | null | undefined
  bio: string
}) => {
  try {
    const response = await apiClient.patch(`/authors/${data.id}`, {
      name: data.name,
      avatar: data.avatar,
      bio: data.bio,
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to update an author')
  }
}

export const deleteAuthor = async (id: string) => {
  try {
    const response = await apiClient.delete(`/authors/${id}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to delete an author')
  }
}
