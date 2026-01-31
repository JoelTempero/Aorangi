import type { Service } from '../types'

export const services: Service[] = [
  {
    id: 'aerial-photography',
    slug: 'aerial-photography',
    name: 'Aerial Photography & Videography',
    shortName: 'Photography & Video',
    tagline: 'Precision paired with creative flair',
    description: 'High-quality aerial photography and cinematic video capture for commercial productions, promotional campaigns, tourism showcases, and creative films. Our diverse drone fleet enables flexible delivery across project types, from landscape sweeps to precise tracking shots.',
    icon: 'Camera',
    features: [
      '8K full-frame camera system with DJI Inspire 3',
      'Dual-operator control for complex shots',
      'Triple-camera system with Hasselblad sensor',
      'Up to 43 minutes flight time',
      '15km video transmission range',
      'Cinema-grade 1080p/60fps live feed'
    ],
    applications: [
      'Commercials and brand storytelling',
      'Event and tourism promotion',
      'Social media content creation',
      'Real estate and architectural imagery',
      'Live broadcast',
      'Documentary and creative film production'
    ],
    equipment: [
      {
        name: 'DJI Inspire 3',
        description: 'Professional cinema drone with full-frame 8K camera',
        specs: [
          '8K full-frame camera system',
          'Dual-operator control (pilot + camera)',
          'Up to 28 minutes flight time',
          'Hot-swappable batteries',
          'Interchangeable lenses',
          'Dual native ISO (800/4000)',
          '14+ stops dynamic range',
          'O3 Pro transmission: 15km range'
        ]
      },
      {
        name: 'DJI Mavic 3 Pro',
        description: 'Compact professional drone with triple-camera system',
        specs: [
          '4/3 CMOS Hasselblad sensor',
          'Triple-camera system',
          'Two telephoto lenses',
          '43-minute maximum flight time',
          '5K video and 20MP stills',
          'O3+ video transmission',
          'Compact, inconspicuous design'
        ]
      }
    ],
    image: '/images/services/photography.webp',
    heroImage: '/images/services/photography-hero.webp'
  },
  {
    id: 'surveying-mapping',
    slug: 'surveying-mapping',
    name: 'Aerial Surveying & Mapping',
    shortName: 'Surveying & Mapping',
    tagline: 'Fast, accurate, and cost-effective',
    description: 'Comprehensive surveying solutions for earthworks planning, land development, and environmental tracking. We operate both LiDAR and photogrammetry workflows using enterprise-grade equipment with RTK correction services and ground control validation.',
    icon: 'Map',
    features: [
      'Real-time point cloud capture',
      '3cm vertical / 4cm horizontal accuracy',
      'Ground surface modeling through vegetation',
      'RTK-corrected positioning',
      'Multi-band GNSS receivers',
      'Live ArcGIS platform access'
    ],
    applications: [
      'Site planning and pre-construction surveys',
      'Environmental impact assessments',
      'Earthworks progress tracking',
      'Farm and vineyard mapping',
      'Asset and infrastructure documentation',
      'Flood modeling and catchment analysis'
    ],
    equipment: [
      {
        name: 'DJI Matrice 400 + Zenmuse L3 LiDAR',
        description: 'High-precision LiDAR mapping system',
        specs: [
          'Real-time point cloud capture',
          '3cm vertical accuracy at 120m',
          '4cm horizontal accuracy',
          'Ground surface modeling through vegetation',
          'Topographic mapping capability'
        ]
      },
      {
        name: 'DJI Mavic 3 Enterprise RTK',
        description: 'High-resolution mapping with centimeter-level accuracy',
        specs: [
          'Centimeter-level RTK accuracy',
          'Rapid deployment',
          'Large-area coverage',
          'Orthophoto generation',
          'Stockpile measurement'
        ]
      },
      {
        name: 'EMLID RS2 GNSS Receivers',
        description: 'Survey-grade ground control equipment',
        specs: [
          'Multi-band accuracy',
          'Ground control point placement',
          'Independent data verification'
        ]
      }
    ],
    deliverables: [
      'GeoTIFF orthomosaics',
      'Digital Surface Models (DSM)',
      'Digital Terrain Models (DTM)',
      'Contour maps',
      'Point clouds (LAS/LAZ format)',
      'Elevation profiles and volumetric calculations',
      'Printed maps and digital map books',
      'Interactive ArcGIS Online web maps'
    ],
    image: '/images/services/surveying.webp',
    heroImage: '/images/services/surveying-hero.webp'
  },
  {
    id: 'asset-inspections',
    slug: 'asset-inspections',
    name: 'Drone Asset Inspections',
    shortName: 'Asset Inspections',
    tagline: 'Safe, accurate & cost-effective',
    description: 'Professional aerial inspection services using enterprise-grade drone technology for infrastructure, utilities, and hard-to-reach assets. Reduce the need for scaffolding, harnesses, or personnel in high-risk environments while getting detailed visual and thermal data.',
    icon: 'Search',
    features: [
      '20MP zoom camera for detailed inspection',
      'Wide-angle situational overview',
      'Thermal imaging for fault detection',
      'Laser range finder',
      'GPS-tagged reporting',
      'Minimal operational downtime'
    ],
    applications: [
      'Power line and electrical infrastructure',
      'Solar panel thermal analysis',
      'Building roof and envelope inspections',
      'Cell towers and communication sites',
      'Bridges, chimneys, and industrial structures',
      'Wind turbines and renewable installations'
    ],
    equipment: [
      {
        name: 'DJI Matrice 300 RTK + Zenmuse H20T',
        description: 'Multi-sensor inspection platform',
        specs: [
          '20MP zoom camera',
          'Wide-angle camera',
          'Thermal imaging sensor',
          'Laser range finder',
          'RTK positioning'
        ]
      },
      {
        name: 'DJI Mavic 3 Enterprise',
        description: 'Compact rapid assessment solution',
        specs: [
          'Fast deployment',
          'RTK accuracy',
          'Routine monitoring capability',
          'Detailed visual inspection'
        ]
      }
    ],
    image: '/images/services/inspections.webp',
    heroImage: '/images/services/inspections-hero.webp'
  },
  {
    id: 'thermal-multispectral',
    slug: 'thermal-multispectral',
    name: 'Thermal & Multispectral Imaging',
    shortName: 'Thermal Imaging',
    tagline: 'See beyond the visible',
    description: 'Advanced thermal and multispectral surveying using precision-calibrated payloads to deliver imagery beyond standard RGB capabilities. Detect temperature variations, assess vegetation health, and identify issues invisible to the naked eye.',
    icon: 'Thermometer',
    features: [
      'Radiometric thermal sensors',
      'Multispectral wavelength capture',
      'NDVI, GNDVI, NDRE vegetation indices',
      'High-accuracy RTK positioning',
      'GIS platform integration',
      'Downloadable datasets'
    ],
    applications: [
      'Plant health and crop monitoring',
      'Infrastructure inspections',
      'Heat loss detection in buildings',
      'Electrical fault identification',
      'Wildlife tracking and pest detection',
      'Environmental monitoring',
      'Emergency response and fire risk'
    ],
    image: '/images/services/thermal.webp',
    heroImage: '/images/services/thermal-hero.webp'
  },
  {
    id: 'surveillance-monitoring',
    slug: 'surveillance-monitoring',
    name: 'Surveillance & Monitoring',
    shortName: 'Surveillance',
    tagline: 'Persistent aerial presence',
    description: 'Advanced aerial event monitoring using tethered drone systems with unlimited flight duration. Perfect for large gatherings, festivals, concerts, and sporting events requiring continuous real-time surveillance.',
    icon: 'Eye',
    features: [
      'Tethered system for unlimited flight',
      'Live feed to security command',
      'Multi-sensor payload',
      'Low-light thermal imaging',
      'Real-time hazard identification',
      'Distance measurement capability'
    ],
    applications: [
      'Crowd control and movement analysis',
      'Incident identification',
      'Emergency response support',
      'Entry/exit point monitoring',
      'Event safety enhancement',
      'Security coordination'
    ],
    equipment: [
      {
        name: 'DJI Matrice 300 RTK (Tethered)',
        description: 'Continuous flight surveillance platform',
        specs: [
          'Unlimited flight duration',
          'No battery swap required',
          'Continuous power via tether',
          'Stable altitude maintenance'
        ]
      },
      {
        name: 'DJI H20T Multi-Sensor Payload',
        description: 'Comprehensive surveillance sensor suite',
        specs: [
          '20MP zoom camera',
          'Wide-angle overview',
          'Thermal for nighttime ops',
          'Laser range finder'
        ]
      }
    ],
    image: '/images/services/surveillance.webp',
    heroImage: '/images/services/surveillance-hero.webp'
  },
  {
    id: 'heavy-lift',
    slug: 'heavy-lift',
    name: 'Heavy Lift Drone Operations',
    shortName: 'Heavy Lift',
    tagline: 'Deliver the impossible',
    description: 'Professional heavy-lift drone operations as a cost-effective alternative to cranes and helicopters. Transport payloads up to 40kg to remote or inaccessible locations with speed, precision, and safety.',
    icon: 'Package',
    features: [
      'Up to 40kg payload capacity',
      'Winch attachment for lowering through vegetation',
      'GPS precision delivery',
      'Remote location access',
      'Cost-effective vs traditional methods',
      'Reduced manual labor requirements'
    ],
    applications: [
      'Conservation pest trap delivery',
      'Forestry seedling transport',
      'Rope access crew supplies',
      'Roofing and solar materials',
      'Infrastructure maintenance supplies',
      'Emergency supply delivery'
    ],
    equipment: [
      {
        name: 'DJI Flycart 30',
        description: 'Heavy-lift cargo delivery drone',
        specs: [
          'Up to 40kg payload capacity',
          'Winch attachment system',
          'Safe lowering through trees',
          'Precision GPS delivery',
          'Extended range capability'
        ]
      }
    ],
    image: '/images/services/heavy-lift.webp',
    heroImage: '/images/services/heavy-lift-hero.webp'
  },
  {
    id: 'geospatial-analysis',
    slug: 'geospatial-analysis',
    name: 'GIS Mapping & Spatial Analysis',
    shortName: 'Geospatial Analysis',
    tagline: 'Visualize and manage your world',
    description: 'Comprehensive GIS analysis combining aerial imagery, LiDAR, GNSS ground control, and open-source geospatial data. From custom mapping to cloud-hosted interactive portals, we deliver actionable spatial intelligence.',
    icon: 'Globe',
    features: [
      'Integrated spatial intelligence',
      'Custom mapping solutions',
      'Cloud-hosted interactive maps',
      'ArcGIS Online portals',
      'Spatial data analysis',
      'Professional cartography'
    ],
    applications: [
      'Resource consent submissions',
      'Infrastructure planning',
      'Farm and vineyard block mapping',
      'Natural hazard overlays',
      'Biodiversity assessments',
      'Public engagement dashboards'
    ],
    deliverables: [
      'Zoning and land use maps',
      'Infrastructure location plans',
      'Environmental hazard overlays',
      'Vegetation classifications',
      'Change detection maps',
      'Historical comparison analysis',
      'Interactive web mapping portals'
    ],
    image: '/images/services/geospatial.webp',
    heroImage: '/images/services/geospatial-hero.webp'
  }
]

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id)
}
