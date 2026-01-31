import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '../../services/auth.service'
import { Button, Input, Card } from '../../components/ui'
import { Tent, Eye, EyeOff, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const setupSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

type SetupForm = z.infer<typeof setupSchema>

export function SetupPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SetupForm>({
    resolver: zodResolver(setupSchema)
  })

  const onSubmit = async (data: SetupForm) => {
    setLoading(true)
    try {
      await authService.bootstrapAdmin(data.email, data.password, data.displayName)
      toast.success('Admin account created! Redirecting...')
      setTimeout(() => navigate('/'), 1500)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create admin account'
      if (message.includes('email-already-in-use')) {
        toast.error('This email is already registered. Please sign in.')
      } else {
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-surface-950 dark:to-surface-900">
      <Card className="w-full max-w-md p-8" variant="elevated">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
            <Tent className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">Welcome to EC Media</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 text-center">
            Set up your admin account to get started
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <Shield className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            This will create the first admin account for your team.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Your Name"
            placeholder="John Smith"
            error={errors.displayName?.message}
            {...register('displayName')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              error={errors.password?.message}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-surface-400 hover:text-surface-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" className="w-full" loading={loading}>
            Create Admin Account
          </Button>
        </form>
      </Card>
    </div>
  )
}
