import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AddCategoryForm } from '@/features/categories/AddCategoryForm'

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
}))

const mockMutate = jest.fn()
jest.mock('@/api/categories/hooks', () => ({
  useCreateCategory: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}))

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('AddCategoryForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockMutate.mockImplementation(({ onSuccess }) => {
      onSuccess()
    })
  })

  it('renders the form and submits with valid data', async () => {
    render(<AddCategoryForm />, { wrapper })

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Category' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add Category' }))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Category created successfully!'
      )
    })

    expect(mockMutate).toHaveBeenCalledWith(
      { title: 'Test Category' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    )
  })

  it('shows validation error when submitting empty form', async () => {
    render(<AddCategoryForm />, { wrapper })

    fireEvent.click(screen.getByRole('button', { name: 'Add Category' }))

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    })
    expect(mockMutate).not.toHaveBeenCalled()
  })
})
