import type { Industry } from '../types'

export const industries: Industry[] = [
  {
    id: 'agriculture',
    slug: 'agriculture',
    name: 'Agriculture & Horticulture',
    description: 'Precision agriculture solutions to optimize crop management, monitor plant health, and improve yields through advanced aerial data collection.',
    icon: 'Wheat',
    services: ['surveying-mapping', 'thermal-multispectral', 'aerial-photography'],
    applications: [
      'Multispectral crop health imaging',
      'High-resolution field mapping',
      '3D terrain models',
      'Vineyard and orchard monitoring',
      'Irrigation assessment',
      'Drainage analysis'
    ],
    image: '/images/industries/agriculture.webp'
  },
  {
    id: 'conservation',
    slug: 'conservation',
    name: 'Conservation & Pest Control',
    description: 'Supporting New Zealand\'s conservation efforts with advanced aerial monitoring and logistics solutions for remote wilderness areas.',
    icon: 'TreePine',
    services: ['heavy-lift', 'thermal-multispectral', 'surveillance-monitoring'],
    applications: [
      'Pest detection and tracking',
      'Wildlife population monitoring',
      'Deer and pig identification',
      'Trap transport to remote areas',
      'Vegetation monitoring',
      'Predator control support'
    ],
    image: '/images/industries/conservation.webp'
  },
  {
    id: 'forestry',
    slug: 'forestry',
    name: 'Forestry',
    description: 'Comprehensive forestry management solutions from planting through harvest, with detailed mapping and health monitoring capabilities.',
    icon: 'Trees',
    services: ['surveying-mapping', 'thermal-multispectral', 'heavy-lift'],
    applications: [
      'High-resolution forest mapping',
      '3D interactive stand models',
      'Forestry metrics calculation',
      'Terrain modeling',
      'Biomass estimation',
      'Tree health monitoring',
      'Seedling delivery to crews'
    ],
    image: '/images/industries/forestry.webp'
  },
  {
    id: 'golf-courses',
    slug: 'golf-courses',
    name: 'Golf Course Mapping',
    description: 'Professional course mapping and turf management solutions for golf courses seeking to optimize maintenance and enhance player experience.',
    icon: 'Flag',
    services: ['surveying-mapping', 'thermal-multispectral', 'aerial-photography'],
    applications: [
      '3D course modeling',
      'Survey-grade mapping',
      'Accurate elevation models',
      'Turf health monitoring',
      'Drainage analysis',
      'Marketing imagery'
    ],
    image: '/images/industries/golf.webp'
  },
  {
    id: 'security',
    slug: 'security',
    name: 'Security & Surveillance',
    description: 'Professional aerial security solutions for events, sites, and facilities requiring continuous monitoring and rapid response capabilities.',
    icon: 'Shield',
    services: ['surveillance-monitoring', 'thermal-multispectral'],
    applications: [
      'Event crowd monitoring',
      'Movement analysis',
      'Disturbance detection',
      'Parking and roadway flow',
      'Emergency response',
      'Entry/exit monitoring',
      'Perimeter security'
    ],
    image: '/images/industries/security.webp'
  },
  {
    id: 'utilities',
    slug: 'utilities',
    name: 'Utilities & Energy',
    description: 'Infrastructure inspection and monitoring solutions for power companies, telecommunications, and renewable energy operators.',
    icon: 'Zap',
    services: ['asset-inspections', 'thermal-multispectral', 'surveying-mapping'],
    applications: [
      'Solar panel inspections',
      'Transmission line surveys',
      'Powerline vegetation management',
      'Infrastructure scanning',
      'Thermal fault detection',
      'LiDAR corridor mapping',
      'Wind turbine inspections'
    ],
    image: '/images/industries/utilities.webp'
  },
  {
    id: 'construction',
    slug: 'construction',
    name: 'Civil & Construction',
    description: 'End-to-end construction monitoring from site surveys through completion, with accurate volumetrics and progress tracking.',
    icon: 'Building',
    services: ['surveying-mapping', 'asset-inspections', 'aerial-photography'],
    applications: [
      'Volumetric surveys',
      '3D site modeling',
      'Survey-grade mapping',
      'Progress monitoring',
      'Elevation profiles',
      'Annotated interactive maps',
      'Stakeholder reports'
    ],
    image: '/images/industries/construction.webp'
  },
  {
    id: 'real-estate',
    slug: 'real-estate',
    name: 'Real Estate & Property',
    description: 'Premium aerial photography and video services to showcase properties and developments with stunning visual content.',
    icon: 'Home',
    services: ['aerial-photography', 'surveying-mapping'],
    applications: [
      'Property marketing imagery',
      'Development showcases',
      'Virtual tour content',
      'Land surveys',
      'Boundary documentation',
      'Twilight photography'
    ],
    image: '/images/industries/real-estate.webp'
  }
]

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug)
}
