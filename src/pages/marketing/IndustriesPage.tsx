import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  Wheat,
  TreePine,
  Trees,
  Flag,
  Shield,
  Zap,
  Building,
  Home,
  ArrowRight,
} from 'lucide-react'
import { PageTransition, fadeInUp, staggerContainer } from '@/components/effects/PageTransition'
import { Button } from '@/components/ui/Button'
import { industries } from '@/data/industries'

const iconMap: Record<string, React.ReactNode> = {
  Wheat: <Wheat className="w-8 h-8" />,
  TreePine: <TreePine className="w-8 h-8" />,
  Trees: <Trees className="w-8 h-8" />,
  Flag: <Flag className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
  Building: <Building className="w-8 h-8" />,
  Home: <Home className="w-8 h-8" />,
}

export default function IndustriesPage() {
  return (
    <PageTransition>
      <Helmet>
        <title>Industries We Serve | Aorangi Aerials</title>
        <meta
          name="description"
          content="Professional drone services for agriculture, construction, utilities, conservation, real estate and more. Tailored solutions for your industry needs."
        />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-purple/5 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="enter"
            className="max-w-3xl"
          >
            <motion.span
              variants={fadeInUp}
              className="text-accent-purple text-sm font-medium uppercase tracking-wider"
            >
              Industries
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="heading-display text-5xl sm:text-6xl text-white mt-4 mb-6"
            >
              Solutions for Every Industry
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/60 text-xl">
              From agriculture to construction, we deliver tailored drone solutions that meet the unique needs of your industry.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 bg-dark-lighter">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-accent-purple/50 transition-colors"
              >
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 flex items-center justify-center text-accent-purple group-hover:scale-110 transition-transform">
                      {iconMap[industry.icon] || <Building className="w-8 h-8" />}
                    </div>
                    <div>
                      <h2 className="font-display font-semibold text-white text-2xl mb-2">
                        {industry.name}
                      </h2>
                      <p className="text-white/60">{industry.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-white/80 text-sm font-medium uppercase tracking-wider mb-3">
                      Applications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {industry.applications.slice(0, 6).map((app, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-dark-lighter rounded-full text-white/60 text-sm"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                    <div className="flex gap-2">
                      {industry.services.slice(0, 3).map((serviceId) => (
                        <span
                          key={serviceId}
                          className="px-2 py-1 bg-accent-purple/10 border border-accent-purple/30 rounded text-accent-purple text-xs"
                        >
                          {serviceId.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                    <Link
                      to="/quote"
                      className="flex items-center gap-2 text-accent-purple text-sm font-medium hover:underline"
                    >
                      Get Quote
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 border border-dark-border rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="heading-display text-3xl sm:text-4xl text-white mb-4">
              Don't See Your Industry?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              We work with businesses across all sectors. Contact us to discuss your specific requirements.
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">
                Contact Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
