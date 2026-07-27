import { DogShelter } from './pages/DogShelter'
import { ToastProvider } from './components/ui/Toast'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <DogShelter />
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
