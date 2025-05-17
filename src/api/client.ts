import useAuthStore from '@/stores/authStore'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// axois interceptor for request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token || useAuthStore.getState()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// axios interceptor for response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      throw new Error('Network Error. Please try again later')
    } else {
      // Handle unauthorized errors
      if (error.response?.status === 401) {
        const authStore = useAuthStore.getState()
        authStore.logout() // Assuming you have a logout method
        // You could also implement refresh token logic here
      }

      // Handle server errors
      if (error.response?.status && error.response.status >= 500) {
        console.error('Server error:', error.response.data)
        throw new Error('An unexpected server error occurred')
      }

      // Handle network errors
      if (!error.response) {
        console.error('Network error:', error.message)
        throw new Error(
          'A network error occurred. Please check your connection'
        )
      }

      // Handle validation errors
      if (error.response.status === 422) {
        console.error('Validation error:', error.response.data)
        throw new Error('Invalid data provided')
      }

      // Handle forbidden errors
      if (error.response.status === 403) {
        console.error('Forbidden:', error.response.data)
        throw new Error('You do not have permission to perform this action')
      }

      return Promise.reject(error)
    }
  }
)
