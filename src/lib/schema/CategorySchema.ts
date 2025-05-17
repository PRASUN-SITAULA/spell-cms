import { z } from 'zod'

export const CategorySchema = z.object({
  title: z.string().min(1, 'Category title is required'),
})
