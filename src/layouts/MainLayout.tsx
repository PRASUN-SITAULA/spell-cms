import { Toaster } from 'react-hot-toast'
import React from 'react'
import { Outlet } from 'react-router'
import { Navbar } from '@/components/navbar'

const MainLayout: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

export default MainLayout
