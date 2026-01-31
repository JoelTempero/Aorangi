import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Suspense, lazy, useEffect } from 'react'

// Layout
import MarketingLayout from './components/layout/MarketingLayout'
import PortalLayout from './components/layout/PortalLayout'
import LoadingScreen from './components/ui/LoadingScreen'

// Effects
import { ParticlesBackground } from './components/effects/ParticlesBackground'
import { ScrollProgress } from './components/effects/ScrollProgress'
import { CommandPalette } from './components/ui/CommandPalette'
import { useThemeStore } from './stores/themeStore'
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
const PortalDashboard = lazy(() => import('./pages/portal/DashboardPage'))
const PortalProjects = lazy(() => import('./pages/portal/ProjectsPage'))
const PortalProjectDetail = lazy(() => import('./pages/portal/ProjectDetailPage'))
const PortalDeliverables = lazy(() => import('./pages/portal/DeliverablesPage'))
const PortalInvoices = lazy(() => import('./pages/portal/InvoicesPage'))
const PortalSupport = lazy(() => import('./pages/portal/SupportPage'))

// Easter egg
const DroneGame = lazy(() => import('./pages/DroneGame'))

function App() {
  const location = useLocation()
  const { theme, initTheme } = useThemeStore()
  const showDroneGame = useKonamiCode()

  useEffect(() => {
    initTheme()
  }, [initTheme])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  if (showDroneGame) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <DroneGame />
      </Suspense>
    )
  }

  return (
    <>
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

            {/* Portal Routes */}
            <Route path="/portal" element={<PortalLayout />}>
              <Route index element={<PortalDashboard />} />
              <Route path="projects" element={<PortalProjects />} />
              <Route path="projects/:id" element={<PortalProjectDetail />} />
              <Route path="deliverables" element={<PortalDeliverables />} />
              <Route path="invoices" element={<PortalInvoices />} />
              <Route path="support" element={<PortalSupport />} />
            </Route>
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  )
}

export default App
