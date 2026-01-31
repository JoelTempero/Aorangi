import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowRight, Check, ArrowLeft } from 'lucide-react'
import { PageTransition, fadeInUp, staggerContainer } from '@/components/effects/PageTransition'
import { Button } from '@/components/ui/Button'
import { getServiceBySlug, services } from '@/data/services'

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const service = slug ? getServiceBySlug(slug) : undefined

  if (!service) {
    return <Navigate to="/services" replace />
  }

  const relatedServices = services.filter((s) => s.id !== service.id).slice(0, 3)

  return (
    <PageTransition>
      <Helmet>
        <title>{service.name} | Aorangi Aerials</title>
        <meta name="description" content={service.description} />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>

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
              {service.tagline}
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="heading-display text-4xl sm:text-5xl lg:text-6xl text-white mt-4 mb-6"
            >
              {service.name}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/60 text-xl">
              {service.description}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features & Applications */}
      <section className="py-16 bg-dark-lighter">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-display text-2xl text-white mb-6">Key Features</h2>
              <div className="space-y-4">
                {service.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-dark-card rounded-xl border border-dark-border"
                  >
                    <div className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-accent-blue" />
                    </div>
                    <span className="text-white/80">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Applications */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="heading-display text-2xl text-white mb-6">Applications</h2>
              <div className="grid grid-cols-2 gap-3">
                {service.applications.map((app, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-dark-card rounded-xl border border-dark-border text-center"
                  >
                    <span className="text-white/70 text-sm">{app}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Equipment */}
      {service.equipment && service.equipment.length > 0 && (
        <section className="py-16 bg-dark">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="heading-display text-3xl text-white mb-4">Our Equipment</h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                We use industry-leading equipment to ensure the highest quality results for every project.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.equipment.map((equip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-dark-card border border-dark-border rounded-2xl p-6"
                >
                  <h3 className="font-display font-semibold text-white text-lg mb-2">
                    {equip.name}
                  </h3>
                  <p className="text-white/60 text-sm mb-4">{equip.description}</p>
                  <ul className="space-y-2">
                    {equip.specs.map((spec, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
                        <Check className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Deliverables */}
      {service.deliverables && service.deliverables.length > 0 && (
        <section className="py-16 bg-dark-lighter">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="heading-display text-3xl text-white mb-4">Deliverables</h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                What you'll receive from your project.
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {service.deliverables.map((deliverable, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded-full text-white/70 text-sm"
                >
                  {deliverable}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 border border-dark-border rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="heading-display text-3xl sm:text-4xl text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Contact us today for a free quote on your {service.shortName.toLowerCase()} project.
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

      {/* Related Services */}
      <section className="py-16 bg-dark-lighter">
        <div className="container mx-auto px-4">
          <h2 className="heading-display text-2xl text-white mb-8">Related Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedServices.map((related) => (
              <Link
                key={related.id}
                to={`/services/${related.slug}`}
                className="group bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-accent-blue/50 transition-colors"
              >
                <h3 className="font-display font-semibold text-white mb-2 group-hover:text-accent-blue transition-colors">
                  {related.shortName}
                </h3>
                <p className="text-white/60 text-sm line-clamp-2">{related.tagline}</p>
                <div className="flex items-center gap-2 mt-4 text-accent-blue text-sm">
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
