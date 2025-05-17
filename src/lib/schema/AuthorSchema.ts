import { z } from 'zod'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '../constants'

export const AuthorSchema = z.object({
  name: z.string().min(1, 'Author Name is Required.'),
  bio: z.string(),
  avatar: z
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
