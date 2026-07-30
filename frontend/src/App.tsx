import { QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ToastProvider } from './components/ui/Toast'
import { BackToTop } from './components/ui/BackToTop'
import { AuthProvider } from './contexts/AuthContext'
import { AdminApp } from './components/admin/AdminApp'
import { DogShelter } from './pages/DogShelter'
import { DonationSuccess } from './pages/DonationSuccess'
import { DonationCancel } from './pages/DonationCancel'
import { queryClient } from './config/queryClient'

function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false
  return window.location.pathname.startsWith('/admin')
}

function isDonationSuccessRoute(): boolean {
  if (typeof window === 'undefined') return false
  return window.location.pathname === '/donation/success'
}

function isDonationCancelRoute(): boolean {
  if (typeof window === 'undefined') return false
  return window.location.pathname === '/donation/cancel'
}

function App() {
  if (isAdminRoute()) {
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

  if (isDonationSuccessRoute()) {
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <DonationSuccess />
          </ToastProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    )
  }

  if (isDonationCancelRoute()) {
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <DonationCancel />
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
