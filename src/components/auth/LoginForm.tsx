import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SubmitButton } from '@/components/submit-button'
import { LoginSchema } from '@/lib/schema/LoginSchema'
import FormField from '@/components/form-field'
import { Lock, Mail } from 'lucide-react'
import useAuthStore from '@/stores/authStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

export const LoginForm = () => {
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = form

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      const loginResponse = await login(data.email, data.password)
      if (loginResponse) {
        toast.success('Login successful')
        navigate('/')
      } else {
        toast.error('Invalid email or password')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Something went wrong')
      }
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <FormField
          label="Email"
          id="email"
          type="email"
          Icon={Mail}
          register={register('email')}
          error={errors.email}
        />
      </div>

      <div>
        <FormField
          label="Password"
          id="password"
          type="password"
          Icon={Lock}
          register={register('password')}
          error={errors.password}
        />
      </div>
      <SubmitButton pending={isSubmitting} pendingText="Logging in...">
        Login
      </SubmitButton>
    </form>
  )
}
