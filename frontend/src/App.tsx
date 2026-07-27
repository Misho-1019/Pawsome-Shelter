import { DogShelter } from './pages/DogShelter'
import { ToastProvider } from './components/ui/Toast'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { BackToTop } from './components/ui/BackToTop'

function App() {
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
