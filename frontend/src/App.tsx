import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ToastProvider } from './components/ui/Toast'
import { BackToTop } from './components/ui/BackToTop'
import { AuthProvider } from './contexts/AuthContext'
import { AdminApp } from './components/admin/AdminApp'
import { DogShelter } from './pages/DogShelter'

function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false
  return window.location.pathname.startsWith('/admin')
}

function App() {
  const adminMode = isAdminRoute()

  if (adminMode) {
    return (
      <ErrorBoundary>
        <ToastProvider>
          <AuthProvider>
            <AdminApp />
            <BackToTop />
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <DogShelter />
        <BackToTop />
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
