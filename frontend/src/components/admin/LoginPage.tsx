import { useState, type FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { FormField, FormError, SubmitButton } from '../ui'
import { useToast } from '../ui/Toast'

export function LoginPage() {
  const { login, loading, error } = useAuth()
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const success = await login(email, password)
    if (success) {
      addToast('Welcome back!', 'success')
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <h1 className="font-heading text-3xl font-extrabold text-primary tracking-tighter">
              Pawsome Shelter
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">Admin Panel</p>
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-premium p-8">
          <h2 className="font-heading text-2xl text-on-surface mb-2">Sign in</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Enter your admin credentials to manage the shelter.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormField
              label="Email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pawsomeshelter.com"
              autoComplete="email"
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
            />

            {error && <FormError title="Sign in failed">{error}</FormError>}

            <SubmitButton
              loading={loading}
              loadingText="Signing in..."
              disabled={!email || !password}
              className="w-full"
              size="lg"
            >
              Sign in
            </SubmitButton>
          </form>
        </div>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          <a href="/" className="text-primary hover:underline">
            ← Back to public site
          </a>
        </p>
      </div>
    </div>
  )
}
