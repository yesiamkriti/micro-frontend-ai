import { useForm } from 'react-hook-form'
import { useState } from 'react'
import axios from '../../utils/api'

type FormData = {
  fullName: string
  email: string
  password: string
  avatarUrl?: string
}

export default function AdvancedRegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()
  const [success, setSuccess] = useState('')
  const [serverError, setServerError] = useState('')

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('/auth/register', data)
      setSuccess('Registration successful! You can now log in.')
      setServerError('')
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Registration failed.')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md mt-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Create Your Account
      </h2>

      {success && <p className="mb-4 text-green-600">{success}</p>}
      {serverError && <p className="mb-4 text-red-500">{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            {...register('fullName', { required: 'Full name is required' })}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/, message: 'Invalid email format' },
            })}
            type="email"
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'At least 6 characters' },
            })}
            type="password"
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">
            Avatar URL (optional)
          </label>
          <input
            {...register('avatarUrl')}
            type="url"
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}
