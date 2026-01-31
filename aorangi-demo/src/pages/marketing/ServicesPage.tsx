import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PageTransition, fadeInUp, staggerContainer } from '@/components/effects/PageTransition'
import { ServiceCard } from '@/components/sections/ServiceCard'
import { Button } from '@/components/ui/Button'
import { services } from '@/data/services'

export default function ServicesPage() {
  return (
    <PageTransition>
      <Helmet>
        <title>Professional Drone Services | Aorangi Aerials</title>
        <meta
          name="description"
          content="Explore our comprehensive drone services including aerial photography, surveying, mapping, inspections, thermal imaging, surveillance, and heavy lift operations."
        />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="enter"
            className="max-w-3xl"
          >
            <motion.span
              variants={fadeInUp}
              className="text-accent-blue text-sm font-medium uppercase tracking-wider"
            >
              Our Services
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="heading-display text-5xl sm:text-6xl text-white mt-4 mb-6"
            >
              Professional Drone Solutions
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/60 text-xl">
              Safe, compliant and efficient aerial solutions. We combine advanced technology with expert operators to deliver exceptional results across a wide range of applications.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-dark-lighter">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 border border-dark-border rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="heading-display text-3xl sm:text-4xl text-white mb-4">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Contact us for a free consultation. We'll help you determine the best solution for your project requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/quote">
                  Get a Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
