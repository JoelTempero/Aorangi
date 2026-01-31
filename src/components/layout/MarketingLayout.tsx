import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export default function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
