import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background font-body text-on-background">
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  )
}
