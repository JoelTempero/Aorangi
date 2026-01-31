import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { User, Shield, Building2, ArrowRight } from 'lucide-react'
import { usePortalStore, type UserRole } from '@/stores/portalStore'
import { PageTransition } from '@/components/effects/PageTransition'
import { Button } from '@/components/ui/Button'
import { images } from '@/data/images'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = usePortalStore()

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate('/portal/dashboard')
    return null
  }

  const handleLogin = (role: UserRole) => {
    login(role)
    navigate('/portal/dashboard')
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Client Portal Login | Aorangi Aerials</title>
      </Helmet>

      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <img
              src={images.logo}
              alt="Aorangi Aerials"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="heading-display text-2xl text-white">Client Portal</h1>
            <p className="text-white/60 mt-2">Sign in to access your projects</p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-card border border-dark-border rounded-2xl p-6"
          >
            {/* Demo Mode Banner */}
            <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-accent-blue font-medium text-sm">Demo Mode</p>
                  <p className="text-white/60 text-xs mt-1">
                    Select a demo account to explore the portal. In production, you would enter your email and password.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-white/80 text-sm font-medium mb-4">Choose a demo account:</p>

              {/* Demo Client Account */}
              <button
                onClick={() => handleLogin('client')}
                className="w-full bg-dark-lighter border border-dark-border rounded-xl p-4 hover:border-accent-blue/50 hover:bg-dark-lighter/80 transition-all group text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-accent-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium">Demo Client</h3>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-accent-blue group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-white/60 text-sm mt-1">Sarah Mitchell</p>
                    <p className="text-white/40 text-xs mt-0.5">Canterbury Construction Ltd</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-dark-card rounded text-xs text-white/60">View projects</span>
                      <span className="px-2 py-0.5 bg-dark-card rounded text-xs text-white/60">Approve deliverables</span>
                      <span className="px-2 py-0.5 bg-dark-card rounded text-xs text-white/60">Pay invoices</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Demo Admin Account */}
              <button
                onClick={() => handleLogin('admin')}
                className="w-full bg-dark-lighter border border-dark-border rounded-xl p-4 hover:border-accent-purple/50 hover:bg-dark-lighter/80 transition-all group text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-accent-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium">Demo Admin</h3>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-accent-purple group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-white/60 text-sm mt-1">James Wilson</p>
                    <p className="text-white/40 text-xs mt-0.5">Aorangi Aerials Staff</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 bg-dark-card rounded text-xs text-white/60">All clients</span>
                      <span className="px-2 py-0.5 bg-dark-card rounded text-xs text-white/60">Manage projects</span>
                      <span className="px-2 py-0.5 bg-dark-card rounded text-xs text-white/60">Create invoices</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-dark-card px-3 text-white/40">or</span>
              </div>
            </div>

            {/* Regular Login Form (disabled in demo) */}
            <div className="space-y-4 opacity-50 pointer-events-none">
              <div>
                <label className="block text-white/60 text-sm mb-2">Email</label>
                <input
                  type="email"
                  placeholder="you@company.co.nz"
                  className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white placeholder-white/40"
                  disabled
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white placeholder-white/40"
                  disabled
                />
              </div>
              <Button className="w-full" disabled>
                Sign In
              </Button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-white/40 text-xs mt-6"
          >
            Need access? Contact us at hello@aorangiaerials.nz
          </motion.p>
        </div>
      </div>
    </PageTransition>
  )
}
