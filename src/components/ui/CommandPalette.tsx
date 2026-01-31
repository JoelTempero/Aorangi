import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Home,
  Camera,
  Map,
  Thermometer,
  Eye,
  Package,
  Globe,
  Building,
  Phone,
  Briefcase,
  Image,
  FileText,
  User,
  Settings,
  X,
} from 'lucide-react'
import { useCommandPaletteStore } from '@/stores/commandPaletteStore'

interface CommandItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  category: string
  keywords?: string[]
}

const commands: CommandItem[] = [
  // Pages
  { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" />, href: '/', category: 'Pages' },
  { id: 'services', label: 'Services', icon: <Briefcase className="w-4 h-4" />, href: '/services', category: 'Pages' },
  { id: 'industries', label: 'Industries', icon: <Building className="w-4 h-4" />, href: '/industries', category: 'Pages' },
  { id: 'portfolio', label: 'Portfolio', icon: <Image className="w-4 h-4" />, href: '/portfolio', category: 'Pages' },
  { id: 'about', label: 'About Us', icon: <User className="w-4 h-4" />, href: '/about', category: 'Pages' },
  { id: 'contact', label: 'Contact', icon: <Phone className="w-4 h-4" />, href: '/contact', category: 'Pages' },
  { id: 'quote', label: 'Get a Quote', icon: <FileText className="w-4 h-4" />, href: '/quote', category: 'Pages' },

  // Services
  { id: 'photography', label: 'Aerial Photography & Videography', icon: <Camera className="w-4 h-4" />, href: '/services/aerial-photography', category: 'Services', keywords: ['video', 'photo', 'film'] },
  { id: 'surveying', label: 'Surveying & Mapping', icon: <Map className="w-4 h-4" />, href: '/services/surveying-mapping', category: 'Services', keywords: ['lidar', 'orthomosaic', 'dtm', 'dsm'] },
  { id: 'inspections', label: 'Asset Inspections', icon: <Search className="w-4 h-4" />, href: '/services/asset-inspections', category: 'Services', keywords: ['roof', 'tower', 'infrastructure'] },
  { id: 'thermal', label: 'Thermal & Multispectral', icon: <Thermometer className="w-4 h-4" />, href: '/services/thermal-multispectral', category: 'Services', keywords: ['heat', 'ndvi', 'agriculture'] },
  { id: 'surveillance', label: 'Surveillance & Monitoring', icon: <Eye className="w-4 h-4" />, href: '/services/surveillance-monitoring', category: 'Services', keywords: ['event', 'security', 'crowd'] },
  { id: 'heavy-lift', label: 'Heavy Lift Operations', icon: <Package className="w-4 h-4" />, href: '/services/heavy-lift', category: 'Services', keywords: ['cargo', 'delivery', 'transport'] },
  { id: 'geospatial', label: 'Geospatial Analysis', icon: <Globe className="w-4 h-4" />, href: '/services/geospatial-analysis', category: 'Services', keywords: ['gis', 'arcgis', 'mapping'] },

  // Portal
  { id: 'portal', label: 'Customer Portal', icon: <Settings className="w-4 h-4" />, href: '/portal', category: 'Portal' },
  { id: 'projects', label: 'My Projects', icon: <Briefcase className="w-4 h-4" />, href: '/portal/projects', category: 'Portal' },
  { id: 'deliverables', label: 'Deliverables', icon: <FileText className="w-4 h-4" />, href: '/portal/deliverables', category: 'Portal' },
]

export function CommandPalette() {
  const { isOpen, close } = useCommandPaletteStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  const filteredCommands = useMemo(() => {
    if (!query) return commands

    const lowerQuery = query.toLowerCase()
    return commands.filter((cmd) => {
      const matchLabel = cmd.label.toLowerCase().includes(lowerQuery)
      const matchKeywords = cmd.keywords?.some((k) => k.toLowerCase().includes(lowerQuery))
      return matchLabel || matchKeywords
    })
  }, [query])

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) groups[cmd.category] = []
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        useCommandPaletteStore.getState().toggle()
      }

      if (!isOpen) return

      if (e.key === 'Escape') {
        close()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        navigate(filteredCommands[selectedIndex].href)
        close()
        setQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close, filteredCommands, selectedIndex, navigate])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Dialog */}
          <motion.div
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 border-b border-dark-border">
                <Search className="w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search pages, services..."
                  className="flex-1 py-4 bg-transparent text-white placeholder-white/40 outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={close}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <p className="px-4 py-8 text-center text-white/40">No results found</p>
                ) : (
                  Object.entries(groupedCommands).map(([category, items]) => (
                    <div key={category} className="mb-2">
                      <p className="px-3 py-1 text-xs text-white/40 uppercase tracking-wider">
                        {category}
                      </p>
                      {items.map((item) => {
                        const globalIndex = filteredCommands.indexOf(item)
                        return (
                          <button
                            key={item.id}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              globalIndex === selectedIndex
                                ? 'bg-accent-blue/20 text-white'
                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                            onClick={() => {
                              navigate(item.href)
                              close()
                              setQuery('')
                            }}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-dark-border flex items-center justify-between text-xs text-white/40">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-dark-lighter rounded">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-dark-lighter rounded">↵</kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-dark-lighter rounded">Esc</kbd>
                    Close
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
