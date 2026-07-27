import { QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ToastProvider } from './components/ui/Toast'
import { BackToTop } from './components/ui/BackToTop'
import { AuthProvider } from './contexts/AuthContext'
import { AdminApp } from './components/admin/AdminApp'
import { DogShelter } from './pages/DogShelter'
import { queryClient } from './config/queryClient'

function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false
  return window.location.pathname.startsWith('/admin')
}

function App() {
  const adminMode = isAdminRoute()

  if (adminMode) {
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AuthProvider>
              <AdminApp />
              <BackToTop />
            </AuthProvider>
          </ToastProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <DogShelter />
          <BackToTop />
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
