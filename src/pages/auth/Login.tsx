import { LoginForm } from '@/components/auth/LoginForm'
import { LockOpen } from 'lucide-react'

export const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="animate-fade-in w-full max-w-md rounded-2xl border border-gray-200 bg-white p-10 shadow-2xl shadow-purple-400">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-purple-200 text-lg font-bold text-white">
            <LockOpen className="text-black" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500">
            Please sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
