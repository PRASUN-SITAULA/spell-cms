import { z } from 'zod'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '../constants'

export const BlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(10, 'Body must be at least 10 characters'),
  authorId: z.string().min(1, 'Author is required'),
  categoryId: z.string().min(1, 'Category is required'),
  status: z.enum(['Draft', 'Published'], {
    required_error: 'Please select a status',
  }),
  tags: z.array(z.string()),
  coverImage: z
    .custom<File | null | undefined>()
    .optional()
    .refine(
      (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
      `Max file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
    )
    .refine(
      (file) =>
        !file ||
        (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
      '.jpg, .jpeg, .png, .webp files only.'
    )
    .transform((file) => file ?? null) as z.ZodType<File | null>,
})
