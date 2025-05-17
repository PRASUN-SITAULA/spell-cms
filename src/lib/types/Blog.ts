import type { Author } from './Author'
import type { Category } from './Category'

export type Blog = {
  id: string
  title: string
  author: Author
  body: string
  category: Category
  tags: string[]
  status: 'Draft' | 'Published'
  createdAt: string
}
