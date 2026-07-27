import { useAuth } from '../../contexts/AuthContext'
import { LoginPage } from './LoginPage'
import { AdminPage } from './AdminPage'

export function AdminApp() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin" aria-hidden="true">
            progress_activity
          </span>
          <p className="text-on-surface-variant mt-3">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return <AdminPage />
}
