import { createBrowserRouter } from 'react-router'
import AuthLayout from './layouts/AuthLayout'
import { Login } from './pages/auth/Login'
import { PrivateRoute, PublicRoute } from '@/lib/utils/routeGuards'
import MainLayout from './layouts/MainLayout'
import { Dashboard } from './pages/dashboard/Dashboard'
import { AddBlog } from './pages/dashboard/AddBlog'

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: <Login />,
          },
        ],
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <Dashboard />,
          },
          {
            path: '/add-blogs',
            element: <AddBlog />,
          },
        ],
      },
    ],
  },
])
