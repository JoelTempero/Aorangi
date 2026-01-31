import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Suspense, lazy, useEffect, useState } from 'react'

// Layout
import MarketingLayout from './components/layout/MarketingLayout'
import PortalLayout from './components/layout/PortalLayout'
import LoadingScreen from './components/ui/LoadingScreen'
import { LoadingScreen as InitialLoadingScreen } from './components/effects/LoadingScreen'

// Effects
import { ParticlesBackground } from './components/effects/ParticlesBackground'
import { ScrollProgress } from './components/effects/ScrollProgress'
import { CommandPalette } from './components/ui/CommandPalette'
import { useThemeStore } from './stores/themeStore'
import { usePortalStore } from './stores/portalStore'
import { useKonamiCode } from './hooks/useKonamiCode'

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/marketing/HomePage'))
const ServicesPage = lazy(() => import('./pages/marketing/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/marketing/ServiceDetailPage'))
const IndustriesPage = lazy(() => import('./pages/marketing/IndustriesPage'))
const AboutPage = lazy(() => import('./pages/marketing/AboutPage'))
const ContactPage = lazy(() => import('./pages/marketing/ContactPage'))
const PortfolioPage = lazy(() => import('./pages/marketing/PortfolioPage'))
const QuotePage = lazy(() => import('./pages/marketing/QuotePage'))

// Portal pages
const PortalLogin = lazy(() => import('./pages/portal/LoginPage'))
const PortalDashboard = lazy(() => import('./pages/portal/DashboardPage'))
const PortalProjects = lazy(() => import('./pages/portal/ProjectsPage'))
const PortalProjectDetail = lazy(() => import('./pages/portal/ProjectDetailPage'))
const PortalDeliverables = lazy(() => import('./pages/portal/DeliverablesPage'))
const PortalInvoices = lazy(() => import('./pages/portal/InvoicesPage'))
const PortalSupport = lazy(() => import('./pages/portal/SupportPage'))

// Easter egg
const DroneGame = lazy(() => import('./pages/DroneGame'))

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = usePortalStore()

  if (!isAuthenticated) {
    return <Navigate to="/portal" replace />
  }

  return <>{children}</>
}

function App() {
  const location = useLocation()
  const { theme, initTheme } = useThemeStore()
  const { isAuthenticated } = usePortalStore()
  const showDroneGame = useKonamiCode()
  const isPortalRoute = location.pathname.startsWith('/portal')
  const [isInitialLoad, setIsInitialLoad] = useState(() => {
    // Only show loading screen on first visit (not on navigation)
    const hasVisited = sessionStorage.getItem('aorangi-visited')
    return !hasVisited
  })

  useEffect(() => {
    initTheme()
  }, [initTheme])

  // Only apply theme to portal pages
  useEffect(() => {
    if (isPortalRoute && isAuthenticated) {
      document.documentElement.setAttribute('data-theme', theme)
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [theme, isPortalRoute, isAuthenticated])

  const handleLoadingComplete = () => {
    sessionStorage.setItem('aorangi-visited', 'true')
    setIsInitialLoad(false)
  }

  if (showDroneGame) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <DroneGame />
      </Suspense>
    )
  }

  return (
    <>
      {/* Initial loading screen - shows on first visit */}
      {isInitialLoad && (
        <InitialLoadingScreen
          minimumDuration={2200}
          onComplete={handleLoadingComplete}
        />
      )}

      <ScrollProgress />
      <ParticlesBackground />
      <CommandPalette />

      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingScreen />}>
          <Routes location={location} key={location.pathname}>
            {/* Marketing Routes */}
            <Route element={<MarketingLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/industries" element={<IndustriesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/quote" element={<QuotePage />} />
            </Route>

            {/* Portal Login (public) */}
            <Route path="/portal" element={<PortalLogin />} />

            {/* Protected Portal Routes */}
            <Route
              path="/portal/dashboard"
              element={
                <ProtectedRoute>
                  <PortalLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PortalDashboard />} />
            </Route>
            <Route
              element={
                <ProtectedRoute>
                  <PortalLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/portal/projects" element={<PortalProjects />} />
              <Route path="/portal/projects/:id" element={<PortalProjectDetail />} />
              <Route path="/portal/deliverables" element={<PortalDeliverables />} />
              <Route path="/portal/invoices" element={<PortalInvoices />} />
              <Route path="/portal/support" element={<PortalSupport />} />
            </Route>
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  )
}

export default App
