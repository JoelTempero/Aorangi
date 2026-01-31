// Service types
export interface Service {
  id: string
  slug: string
  name: string
  shortName: string
  tagline: string
  description: string
  icon: string
  features: string[]
  applications: string[]
  equipment?: Equipment[]
  deliverables?: string[]
  image: string
  heroImage?: string
}

export interface Equipment {
  name: string
  description: string
  specs: string[]
  image?: string
}

// Industry types
export interface Industry {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  services: string[]
  applications: string[]
  image: string
}

// Project types
export interface Project {
  id: string
  name: string
  client: string
  status: 'pending' | 'in_progress' | 'review' | 'completed'
  service: string
  location: string
  startDate: string
  endDate?: string
  progress: number
  description: string
  thumbnail?: string
  deliverableCount: number
  flightDate?: string
  weather?: string
}

// Deliverable types
export interface Deliverable {
  id: string
  projectId: string
  name: string
  type: 'image' | 'video' | 'document' | 'data' | '3d_model' | 'point_cloud'
  status: 'pending' | 'ready' | 'approved' | 'revision_requested'
  fileUrl: string
  thumbnailUrl?: string
  fileSize: number
  uploadedAt: string
  approvedAt?: string
  revisionComment?: string
  metadata?: {
    width?: number
    height?: number
    duration?: number
    format?: string
    resolution?: string
  }
}

// Invoice types
export interface Invoice {
  id: string
  invoiceNumber: string
  projectId: string
  projectName: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  amount: number
  tax: number
  total: number
  issuedDate: string
  dueDate: string
  paidDate?: string
  items: InvoiceItem[]
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

// Notification types
export interface Notification {
  id: string
  type: 'project_update' | 'deliverable_ready' | 'invoice' | 'message' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
}

// Quote request types
export interface QuoteRequest {
  service: string
  projectType: string
  location: string
  area?: number
  timeline: string
  name: string
  email: string
  phone?: string
  company?: string
  details: string
}

// Portfolio types
export interface PortfolioItem {
  id: string
  title: string
  description: string
  service: string
  industry: string
  location: string
  date: string
  images: string[]
  videoUrl?: string
  featured: boolean
}

// FAQ types
export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

// Contact form types
export interface ContactForm {
  name: string
  email: string
  phone?: string
  company?: string
  service?: string
  message: string
}

// Team member types
export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string
  certifications: string[]
}

// Testimonial types
export interface Testimonial {
  id: string
  name: string
  company: string
  role: string
  quote: string
  image?: string
  rating: number
}
