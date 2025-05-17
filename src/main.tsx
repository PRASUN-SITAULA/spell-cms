import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactQueryProvider } from './providers/ReactQueryProvider.tsx'
import { RouterProvider } from 'react-router/dom'
import { router } from './routes.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <RouterProvider router={router} />
    </ReactQueryProvider>
  </StrictMode>
)
