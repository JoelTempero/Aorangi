import type { Project, Deliverable, Invoice, Notification } from '../types'

export const demoData = {
  user: {
    id: 'demo-user-1',
    name: 'Sarah Mitchell',
    email: 'sarah@acmeconstruction.co.nz',
    company: 'Acme Construction Ltd',
    avatar: '/images/avatars/demo-user.webp'
  },

  projects: [
    {
      id: 'proj-001',
      name: 'Halswell Subdivision Survey',
      client: 'Acme Construction Ltd',
      status: 'in_progress' as const,
      service: 'Surveying & Mapping',
      location: 'Halswell, Christchurch',
      startDate: '2026-01-15',
      endDate: '2026-02-15',
      progress: 65,
      description: 'Comprehensive aerial survey of 12-hectare subdivision site including orthomosaic, DSM, DTM, and contour mapping for resource consent application.',
      thumbnail: '/images/projects/halswell-survey.webp',
      deliverableCount: 8,
      flightDate: '2026-01-28',
      weather: 'Clear, 8km/h NW wind'
    },
    {
      id: 'proj-002',
      name: 'Lincoln Road Solar Farm Inspection',
      client: 'Acme Construction Ltd',
      status: 'review' as const,
      service: 'Thermal Imaging',
      location: 'Lincoln, Canterbury',
      startDate: '2026-01-20',
      endDate: '2026-01-25',
      progress: 90,
      description: 'Thermal inspection of 5MW solar installation to identify underperforming panels and potential hotspots before summer peak.',
      thumbnail: '/images/projects/solar-inspection.webp',
      deliverableCount: 12,
      flightDate: '2026-01-22',
      weather: 'Sunny, ideal thermal conditions'
    },
    {
      id: 'proj-003',
      name: 'Sumner Property Showcase',
      client: 'Acme Construction Ltd',
      status: 'completed' as const,
      service: 'Aerial Photography',
      location: 'Sumner, Christchurch',
      startDate: '2026-01-05',
      endDate: '2026-01-10',
      progress: 100,
      description: 'Premium aerial photography and 4K video production for luxury clifftop property listing.',
      thumbnail: '/images/projects/sumner-property.webp',
      deliverableCount: 24,
      flightDate: '2026-01-07',
      weather: 'Golden hour, perfect conditions'
    },
    {
      id: 'proj-004',
      name: 'Port Hills Erosion Monitoring',
      client: 'Acme Construction Ltd',
      status: 'pending' as const,
      service: 'Surveying & Mapping',
      location: 'Port Hills, Christchurch',
      startDate: '2026-02-01',
      progress: 0,
      description: 'Quarterly LiDAR scan to monitor slope stability and erosion patterns following recent seismic activity.',
      thumbnail: '/images/projects/port-hills.webp',
      deliverableCount: 0
    }
  ] as Project[],

  deliverables: [
    // Halswell project deliverables
    {
      id: 'del-001',
      projectId: 'proj-001',
      name: 'Orthomosaic - Full Site',
      type: 'image' as const,
      status: 'approved' as const,
      fileUrl: '/deliverables/halswell-ortho.tiff',
      thumbnailUrl: '/images/deliverables/halswell-ortho-thumb.webp',
      fileSize: 245000000,
      uploadedAt: '2026-01-25T10:30:00Z',
      approvedAt: '2026-01-26T14:20:00Z',
      metadata: {
        width: 15000,
        height: 12000,
        format: 'GeoTIFF',
        resolution: '2.5cm/px'
      }
    },
    {
      id: 'del-002',
      projectId: 'proj-001',
      name: 'Digital Surface Model',
      type: 'data' as const,
      status: 'ready' as const,
      fileUrl: '/deliverables/halswell-dsm.tiff',
      thumbnailUrl: '/images/deliverables/halswell-dsm-thumb.webp',
      fileSize: 180000000,
      uploadedAt: '2026-01-26T09:15:00Z',
      metadata: {
        format: 'GeoTIFF',
        resolution: '5cm/px'
      }
    },
    {
      id: 'del-003',
      projectId: 'proj-001',
      name: 'Point Cloud - LAS',
      type: 'point_cloud' as const,
      status: 'ready' as const,
      fileUrl: '/deliverables/halswell-pointcloud.las',
      thumbnailUrl: '/images/deliverables/pointcloud-thumb.webp',
      fileSize: 520000000,
      uploadedAt: '2026-01-27T11:00:00Z'
    },
    {
      id: 'del-004',
      projectId: 'proj-001',
      name: 'Contour Map - 0.5m',
      type: 'document' as const,
      status: 'pending' as const,
      fileUrl: '/deliverables/halswell-contours.pdf',
      thumbnailUrl: '/images/deliverables/contours-thumb.webp',
      fileSize: 8500000,
      uploadedAt: '2026-01-28T08:30:00Z'
    },
    // Solar inspection deliverables
    {
      id: 'del-005',
      projectId: 'proj-002',
      name: 'Thermal Overview Map',
      type: 'image' as const,
      status: 'ready' as const,
      fileUrl: '/deliverables/solar-thermal-map.jpg',
      thumbnailUrl: '/images/deliverables/solar-thermal-thumb.webp',
      fileSize: 45000000,
      uploadedAt: '2026-01-23T14:00:00Z',
      metadata: {
        width: 8000,
        height: 6000,
        format: 'JPEG'
      }
    },
    {
      id: 'del-006',
      projectId: 'proj-002',
      name: 'Hotspot Analysis Report',
      type: 'document' as const,
      status: 'ready' as const,
      fileUrl: '/deliverables/solar-report.pdf',
      thumbnailUrl: '/images/deliverables/report-thumb.webp',
      fileSize: 12000000,
      uploadedAt: '2026-01-24T09:30:00Z'
    },
    // Sumner property deliverables
    {
      id: 'del-007',
      projectId: 'proj-003',
      name: 'Hero Shot - Ocean View',
      type: 'image' as const,
      status: 'approved' as const,
      fileUrl: '/deliverables/sumner-hero.jpg',
      thumbnailUrl: '/images/deliverables/sumner-hero-thumb.webp',
      fileSize: 28000000,
      uploadedAt: '2026-01-08T16:00:00Z',
      approvedAt: '2026-01-09T10:00:00Z',
      metadata: {
        width: 8192,
        height: 5464,
        format: 'JPEG'
      }
    },
    {
      id: 'del-008',
      projectId: 'proj-003',
      name: 'Property Video - 4K',
      type: 'video' as const,
      status: 'approved' as const,
      fileUrl: '/deliverables/sumner-video.mp4',
      thumbnailUrl: '/images/deliverables/sumner-video-thumb.webp',
      fileSize: 850000000,
      uploadedAt: '2026-01-09T11:30:00Z',
      approvedAt: '2026-01-10T09:00:00Z',
      metadata: {
        width: 3840,
        height: 2160,
        duration: 180,
        format: 'MP4'
      }
    }
  ] as Deliverable[],

  invoices: [
    {
      id: 'inv-001',
      invoiceNumber: 'INV-2026-0042',
      projectId: 'proj-003',
      projectName: 'Sumner Property Showcase',
      status: 'paid' as const,
      amount: 1850.00,
      tax: 277.50,
      total: 2127.50,
      issuedDate: '2026-01-10',
      dueDate: '2026-01-24',
      paidDate: '2026-01-18',
      items: [
        { description: 'Aerial Photography - Half Day', quantity: 1, unitPrice: 850.00, total: 850.00 },
        { description: '4K Video Production', quantity: 1, unitPrice: 650.00, total: 650.00 },
        { description: 'Professional Editing & Colour Grading', quantity: 1, unitPrice: 350.00, total: 350.00 }
      ]
    },
    {
      id: 'inv-002',
      invoiceNumber: 'INV-2026-0048',
      projectId: 'proj-002',
      projectName: 'Lincoln Road Solar Farm Inspection',
      status: 'sent' as const,
      amount: 2400.00,
      tax: 360.00,
      total: 2760.00,
      issuedDate: '2026-01-25',
      dueDate: '2026-02-08',
      items: [
        { description: 'Thermal Drone Inspection - Full Day', quantity: 1, unitPrice: 1600.00, total: 1600.00 },
        { description: 'Thermal Analysis & Reporting', quantity: 1, unitPrice: 600.00, total: 600.00 },
        { description: 'Interactive Web Map Setup', quantity: 1, unitPrice: 200.00, total: 200.00 }
      ]
    },
    {
      id: 'inv-003',
      invoiceNumber: 'INV-2026-0051',
      projectId: 'proj-001',
      projectName: 'Halswell Subdivision Survey',
      status: 'draft' as const,
      amount: 4200.00,
      tax: 630.00,
      total: 4830.00,
      issuedDate: '2026-01-30',
      dueDate: '2026-02-13',
      items: [
        { description: 'LiDAR Survey - 12 Hectares', quantity: 12, unitPrice: 250.00, total: 3000.00 },
        { description: 'Ground Control Point Setup', quantity: 8, unitPrice: 50.00, total: 400.00 },
        { description: 'Data Processing & DSM/DTM Generation', quantity: 1, unitPrice: 500.00, total: 500.00 },
        { description: 'ArcGIS Online Portal Setup', quantity: 1, unitPrice: 300.00, total: 300.00 }
      ]
    }
  ] as Invoice[],

  notifications: [
    {
      id: 'notif-001',
      type: 'deliverable_ready' as const,
      title: 'New Deliverable Ready',
      message: 'Point Cloud data for Halswell Subdivision Survey is ready for download.',
      read: false,
      createdAt: '2026-01-27T11:05:00Z',
      link: '/portal/projects/proj-001'
    },
    {
      id: 'notif-002',
      type: 'project_update' as const,
      title: 'Flight Completed',
      message: 'Aerial survey flight for Halswell project completed successfully. Processing data now.',
      read: false,
      createdAt: '2026-01-28T15:30:00Z',
      link: '/portal/projects/proj-001'
    },
    {
      id: 'notif-003',
      type: 'invoice' as const,
      title: 'Invoice Available',
      message: 'Invoice INV-2026-0048 for Solar Farm Inspection is ready for payment.',
      read: true,
      createdAt: '2026-01-25T10:00:00Z',
      link: '/portal/invoices'
    },
    {
      id: 'notif-004',
      type: 'system' as const,
      title: 'Upcoming Flight',
      message: 'Reminder: Port Hills Erosion Monitoring flight scheduled for Feb 1st. Weather forecast looks favorable.',
      read: false,
      createdAt: '2026-01-29T09:00:00Z',
      link: '/portal/projects/proj-004'
    }
  ] as Notification[]
}

// Admin sees ALL clients and projects
export const adminDemoData = {
  projects: [
    ...demoData.projects,
    // Additional projects from other clients
    {
      id: 'proj-005',
      name: 'Rolleston Industrial Park Survey',
      client: 'Southern Land Developers',
      status: 'in_progress' as const,
      service: 'Surveying & Mapping',
      location: 'Rolleston, Canterbury',
      startDate: '2026-01-18',
      endDate: '2026-02-20',
      progress: 45,
      description: 'Large-scale topographic survey for new industrial development zone.',
      thumbnail: '/images/projects/rolleston-survey.webp',
      deliverableCount: 4,
      flightDate: '2026-01-20',
      weather: 'Overcast, calm'
    },
    {
      id: 'proj-006',
      name: 'Akaroa Harbour Inspection',
      client: 'Environment Canterbury',
      status: 'completed' as const,
      service: 'Asset Inspection',
      location: 'Akaroa, Banks Peninsula',
      startDate: '2026-01-10',
      endDate: '2026-01-12',
      progress: 100,
      description: 'Coastal erosion assessment and cliff face inspection using high-resolution imaging.',
      thumbnail: '/images/projects/akaroa-inspection.webp',
      deliverableCount: 18,
      flightDate: '2026-01-11',
      weather: 'Clear, light breeze'
    },
    {
      id: 'proj-007',
      name: 'Waimakariri Bridge Inspection',
      client: 'NZTA',
      status: 'review' as const,
      service: 'Asset Inspection',
      location: 'Waimakariri, Canterbury',
      startDate: '2026-01-22',
      endDate: '2026-01-28',
      progress: 85,
      description: 'Structural inspection of bridge pillars and deck using close-range aerial photography.',
      thumbnail: '/images/projects/bridge-inspection.webp',
      deliverableCount: 32,
      flightDate: '2026-01-25',
      weather: 'Sunny, 12km/h wind'
    },
    {
      id: 'proj-008',
      name: 'Ashburton Farm Crop Analysis',
      client: 'Ashburton Farming Co.',
      status: 'pending' as const,
      service: 'Agriculture & Farming',
      location: 'Ashburton, Canterbury',
      startDate: '2026-02-05',
      progress: 0,
      description: 'Multispectral crop health analysis across 500 hectares of dairy support land.',
      thumbnail: '/images/projects/crop-analysis.webp',
      deliverableCount: 0
    }
  ] as Project[],

  deliverables: [
    ...demoData.deliverables,
    // Additional deliverables
    {
      id: 'del-009',
      projectId: 'proj-006',
      name: 'Cliff Face Orthomosaic',
      type: 'image' as const,
      status: 'approved' as const,
      fileUrl: '/deliverables/akaroa-ortho.tiff',
      thumbnailUrl: '/images/deliverables/akaroa-thumb.webp',
      fileSize: 320000000,
      uploadedAt: '2026-01-12T10:00:00Z',
      approvedAt: '2026-01-13T14:00:00Z'
    },
    {
      id: 'del-010',
      projectId: 'proj-007',
      name: 'Bridge Pillar Report',
      type: 'document' as const,
      status: 'ready' as const,
      fileUrl: '/deliverables/bridge-report.pdf',
      thumbnailUrl: '/images/deliverables/bridge-report-thumb.webp',
      fileSize: 25000000,
      uploadedAt: '2026-01-27T15:00:00Z'
    }
  ] as Deliverable[],

  invoices: [
    ...demoData.invoices,
    {
      id: 'inv-004',
      invoiceNumber: 'INV-2026-0038',
      projectId: 'proj-006',
      projectName: 'Akaroa Harbour Inspection',
      status: 'paid' as const,
      amount: 3200.00,
      tax: 480.00,
      total: 3680.00,
      issuedDate: '2026-01-13',
      dueDate: '2026-01-27',
      paidDate: '2026-01-20',
      items: [
        { description: 'Coastal Aerial Survey - Full Day', quantity: 1, unitPrice: 1800.00, total: 1800.00 },
        { description: 'Cliff Face Analysis & Reporting', quantity: 1, unitPrice: 900.00, total: 900.00 },
        { description: 'High-Resolution Orthomosaic Processing', quantity: 1, unitPrice: 500.00, total: 500.00 }
      ]
    },
    {
      id: 'inv-005',
      invoiceNumber: 'INV-2026-0052',
      projectId: 'proj-007',
      projectName: 'Waimakariri Bridge Inspection',
      status: 'draft' as const,
      amount: 5500.00,
      tax: 825.00,
      total: 6325.00,
      issuedDate: '2026-01-30',
      dueDate: '2026-02-13',
      items: [
        { description: 'Bridge Inspection - 2 Days', quantity: 2, unitPrice: 2000.00, total: 4000.00 },
        { description: 'Structural Analysis Report', quantity: 1, unitPrice: 1200.00, total: 1200.00 },
        { description: 'Travel & Equipment', quantity: 1, unitPrice: 300.00, total: 300.00 }
      ]
    }
  ] as Invoice[],

  notifications: [
    ...demoData.notifications,
    {
      id: 'notif-005',
      type: 'system' as const,
      title: 'New Client Enquiry',
      message: 'New quote request from Selwyn District Council for roading assessment.',
      read: false,
      createdAt: '2026-01-30T08:30:00Z',
      link: '/portal/quotes'
    },
    {
      id: 'notif-006',
      type: 'project_update' as const,
      title: 'Weather Alert',
      message: 'High winds forecast for Feb 1-2. Port Hills flight may need rescheduling.',
      read: false,
      createdAt: '2026-01-30T07:00:00Z',
      link: '/portal/projects/proj-004'
    }
  ] as Notification[]
}
