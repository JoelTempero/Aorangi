import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Map,
  Search,
  Thermometer,
  Eye,
  Package,
  Globe,
  ArrowRight,
  Check,
} from 'lucide-react'
import type { Service } from '@/types'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ReactNode> = {
  Camera: <Camera className="w-6 h-6" />,
  Map: <Map className="w-6 h-6" />,
  Search: <Search className="w-6 h-6" />,
  Thermometer: <Thermometer className="w-6 h-6" />,
  Eye: <Eye className="w-6 h-6" />,
  Package: <Package className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
}

interface ServiceCardProps {
  service: Service
  index: number
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div
        className={cn(
          'relative bg-dark-card border border-dark-border rounded-2xl overflow-hidden transition-all duration-500',
          isExpanded ? 'shadow-xl shadow-accent-blue/10' : 'hover:shadow-lg hover:shadow-accent-blue/5'
        )}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-transparent to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform duration-300">
              {iconMap[service.icon] || <Camera className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-white text-lg mb-1">
                {service.shortName}
              </h3>
              <p className="text-white/60 text-sm">{service.tagline}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
            {service.description}
          </p>

          {/* Expand/Collapse button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-accent-blue text-sm font-medium hover:underline mb-4"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>

          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-white/80 text-xs font-medium uppercase tracking-wider mb-2">
                    Key Features
                  </h4>
                  <ul className="space-y-1.5">
                    {service.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                        <Check className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Applications */}
                <div className="mb-4">
                  <h4 className="text-white/80 text-xs font-medium uppercase tracking-wider mb-2">
                    Applications
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {service.applications.slice(0, 4).map((app, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-dark-lighter rounded-md text-white/60 text-xs"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <Link
            to={`/services/${service.slug}`}
            className="flex items-center justify-between p-3 -mx-2 rounded-lg hover:bg-white/5 transition-colors group/link"
          >
            <span className="text-white font-medium text-sm">Learn more</span>
            <ArrowRight className="w-4 h-4 text-accent-blue group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
