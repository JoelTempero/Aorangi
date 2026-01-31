import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Calendar, ArrowRight } from 'lucide-react'
import { PageTransition, fadeInUp, staggerContainer } from '@/components/effects/PageTransition'
import { Button } from '@/components/ui/Button'
import { portfolioItems } from '@/data/content'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

const categories = ['All', 'Aerial Photography', 'Surveying & Mapping', 'Asset Inspections', 'Thermal & Multispectral', 'Surveillance & Monitoring', 'Heavy Lift']

export default function PortfolioPage() {
  const [filter, setFilter] = useState('All')
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null)

  const filteredItems = filter === 'All'
    ? portfolioItems
    : portfolioItems.filter((item) => item.service === filter)

  return (
    <PageTransition>
      <Helmet>
        <title>Portfolio | Aorangi Aerials</title>
        <meta
          name="description"
          content="View our portfolio of aerial photography, surveying, and drone service projects across Canterbury and New Zealand."
        />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-cyan/5 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="enter"
            className="max-w-3xl"
          >
            <motion.span
              variants={fadeInUp}
              className="text-accent-cyan text-sm font-medium uppercase tracking-wider"
            >
              Our Work
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="heading-display text-5xl sm:text-6xl text-white mt-4 mb-6"
            >
              Portfolio
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/60 text-xl">
              Explore our recent projects showcasing aerial photography, surveying, inspections, and more across Canterbury and New Zealand.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="py-16 bg-dark-lighter">
        <div className="container mx-auto px-4">
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  filter === category
                    ? 'bg-accent-blue text-white'
                    : 'bg-dark-card border border-dark-border text-white/60 hover:text-white hover:border-accent-blue/50'
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Portfolio grid */}
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-dark-card">
                    {/* Placeholder image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center">
                      <span className="text-white/20 text-sm">[Project Image]</span>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <span className="text-accent-blue text-xs font-medium mb-2">
                        {item.service}
                      </span>
                      <h3 className="font-display font-semibold text-white text-xl mb-2 group-hover:text-accent-blue transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-4 text-white/60 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.date)}
                        </span>
                      </div>
                    </div>

                    {/* Featured badge */}
                    {item.featured && (
                      <div className="absolute top-4 right-4 px-2 py-1 bg-accent-blue/90 rounded text-white text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60">No projects found for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-card border border-dark-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-dark-lighter text-white/60 hover:text-white z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image placeholder */}
              <div className="aspect-video bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center">
                <span className="text-white/20">[Project Gallery]</span>
              </div>

              {/* Content */}
              <div className="p-8">
                <span className="text-accent-blue text-sm font-medium">{selectedItem.service}</span>
                <h2 className="heading-display text-3xl text-white mt-2 mb-4">
                  {selectedItem.title}
                </h2>
                <p className="text-white/70 mb-6">{selectedItem.description}</p>

                <div className="flex flex-wrap gap-6 mb-8">
                  <div>
                    <p className="text-white/40 text-sm">Industry</p>
                    <p className="text-white">{selectedItem.industry}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">Location</p>
                    <p className="text-white">{selectedItem.location}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">Date</p>
                    <p className="text-white">{formatDate(selectedItem.date)}</p>
                  </div>
                </div>

                <Button asChild>
                  <Link to="/quote">
                    Start Similar Project
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-accent-cyan/10 to-accent-blue/10 border border-dark-border rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="heading-display text-3xl sm:text-4xl text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Let's create something amazing together. Contact us to discuss your requirements.
            </p>
            <Button size="lg" asChild>
              <Link to="/quote">
                Get a Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
