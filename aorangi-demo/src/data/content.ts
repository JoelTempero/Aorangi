import type { FAQ, Testimonial, PortfolioItem } from '../types'

export const companyInfo = {
  name: 'Aorangi Aerials',
  tagline: 'Precision From Above',
  description: 'Aorangi Aerials offers high quality drone services such as aerial photography, videography, surveying, thermal imaging, surveillance and heavy lift operations in the South Island.',
  mission: 'Taking your perspective to new heights - combining advanced technology with appreciation for New Zealand\'s landscapes to deliver both beautiful and practical aerial solutions.',
  phone: '03 4217 520',
  phoneFormatted: '+64 3 4217 520',
  email: 'hello@aorangiaerials.nz',
  address: {
    city: 'Christchurch',
    region: 'Canterbury',
    country: 'New Zealand'
  },
  social: {
    instagram: 'https://www.instagram.com/aorangi_aerials',
    linkedin: 'https://www.linkedin.com/company/aorangi-aerials',
    facebook: 'https://www.facebook.com/aorangiaerials'
  },
  certifications: [
    {
      name: 'CAA Part 102 Certified',
      description: 'Operating under a Civil Aviation Authority Unmanned Aircraft Operator Certificate',
      icon: 'Shield'
    },
    {
      name: 'Fully Insured',
      description: 'Comprehensive public liability and aviation insurance coverage',
      icon: 'FileCheck'
    },
    {
      name: 'Night Operations',
      description: 'Authorized for night operations and special airspace permissions',
      icon: 'Moon'
    }
  ],
  stats: [
    { label: 'Projects Completed', value: 500, suffix: '+' },
    { label: 'Flight Hours', value: 2500, suffix: '+' },
    { label: 'Happy Clients', value: 150, suffix: '+' },
    { label: 'Years Experience', value: 8, suffix: '' }
  ]
}

export const whyChooseUs = [
  {
    title: 'Industry Proven Equipment',
    description: 'We use industry-tested equipment that we trust to deliver high-quality results for our customers.',
    icon: 'Cpu'
  },
  {
    title: 'Licensed & Insured',
    description: 'As a licensed and insured company, you can trust us for safe and reliable service.',
    icon: 'Shield'
  },
  {
    title: 'Certified Drone Operators',
    description: 'All of our drone operators have completed CAA Part 102 Training and consistently enhance their skills in their respective areas of expertise.',
    icon: 'Award'
  }
]

export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What areas do you service?',
    answer: 'We primarily service the Canterbury region, including Christchurch and surrounding areas. However, we regularly travel throughout the South Island for larger projects. Contact us to discuss your location.',
    category: 'General'
  },
  {
    id: 'faq-2',
    question: 'Are you CAA certified?',
    answer: 'Yes, Aorangi Aerials operates under a CAA Part 102 Unmanned Aircraft Operator Certificate. All our pilots are fully trained and certified, with authorization for night operations, flights near aerodromes, and special airspace permissions.',
    category: 'Certifications'
  },
  {
    id: 'faq-3',
    question: 'How much does drone surveying cost?',
    answer: 'Pricing varies based on project size, complexity, and deliverables required. As a guide, basic aerial photography starts from $350, while comprehensive surveying projects are typically quoted per hectare. Contact us for a free quote tailored to your needs.',
    category: 'Pricing'
  },
  {
    id: 'faq-4',
    question: 'What happens if the weather is bad on flight day?',
    answer: 'We monitor weather conditions closely and will reschedule if conditions are unsafe or will compromise data quality. There\'s no charge for weather-related postponements, and we work with you to find the next available suitable day.',
    category: 'Operations'
  },
  {
    id: 'faq-5',
    question: 'How accurate is drone surveying data?',
    answer: 'Using RTK-enabled drones and ground control points, we achieve accuracies of 2-3cm horizontally and 3-5cm vertically. LiDAR surveys can penetrate vegetation to capture ground surface data that photogrammetry cannot.',
    category: 'Technical'
  },
  {
    id: 'faq-6',
    question: 'What deliverables do you provide?',
    answer: 'Deliverables depend on the service, but commonly include: orthomosaic images, digital surface/terrain models, point clouds, contour maps, 4K/8K video, high-resolution photography, thermal reports, and interactive ArcGIS web maps.',
    category: 'Deliverables'
  },
  {
    id: 'faq-7',
    question: 'Do I need any permits or permissions?',
    answer: 'Our Part 102 certification covers most operational requirements. For flights in controlled airspace or special locations, we handle all necessary CAA applications and landowner permissions. We\'ll advise if any additional permits are needed.',
    category: 'Certifications'
  },
  {
    id: 'faq-8',
    question: 'How long until I receive my data?',
    answer: 'Standard turnaround is 3-5 business days for photography and video, 5-7 days for surveying and mapping deliverables. Rush processing is available for urgent projects at an additional cost.',
    category: 'Operations'
  }
]

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'James Anderson',
    company: 'Anderson Construction',
    role: 'Project Manager',
    quote: 'Aorangi Aerials provided exceptional surveying services for our subdivision project. The accuracy of their LiDAR data and the interactive web maps made our resource consent process significantly smoother.',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Michelle Chen',
    company: 'Canterbury Real Estate',
    role: 'Senior Agent',
    quote: 'The aerial photography and video they produce is simply stunning. Our luxury listings now sell faster thanks to the incredible showcase content they create.',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'David Thompson',
    company: 'Southern Power',
    role: 'Asset Manager',
    quote: 'Their thermal inspection service identified several hotspots we would have missed with traditional methods. Professional, efficient, and thorough reporting.',
    rating: 5
  },
  {
    id: 'test-4',
    name: 'Sarah Williams',
    company: 'DOC Canterbury',
    role: 'Conservation Officer',
    quote: 'The heavy lift drone service has transformed how we deploy pest control traps in remote areas. What used to take days of hiking now takes hours.',
    rating: 5
  }
]

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Queenstown Luxury Estate',
    description: 'Cinematic aerial showcase of a stunning lakefront property featuring 4K video and twilight photography.',
    service: 'Aerial Photography',
    industry: 'Real Estate',
    location: 'Queenstown',
    date: '2025-12-15',
    images: ['/images/portfolio/queenstown-1.webp', '/images/portfolio/queenstown-2.webp'],
    videoUrl: '/videos/portfolio/queenstown.mp4',
    featured: true
  },
  {
    id: 'port-2',
    title: 'Canterbury Plains Wind Farm',
    description: 'Comprehensive thermal inspection of 45 wind turbines identifying maintenance priorities.',
    service: 'Asset Inspections',
    industry: 'Utilities',
    location: 'Canterbury',
    date: '2025-11-20',
    images: ['/images/portfolio/windfarm-1.webp', '/images/portfolio/windfarm-2.webp'],
    featured: true
  },
  {
    id: 'port-3',
    title: 'Rolleston Industrial Development',
    description: 'Monthly progress monitoring and volumetric surveys for a 50-hectare industrial park development.',
    service: 'Surveying & Mapping',
    industry: 'Construction',
    location: 'Rolleston',
    date: '2025-10-08',
    images: ['/images/portfolio/rolleston-1.webp', '/images/portfolio/rolleston-2.webp'],
    featured: true
  },
  {
    id: 'port-4',
    title: 'Marlborough Vineyard Mapping',
    description: 'Multispectral imaging and precision mapping for vineyard health monitoring and irrigation planning.',
    service: 'Thermal & Multispectral',
    industry: 'Agriculture',
    location: 'Marlborough',
    date: '2025-09-12',
    images: ['/images/portfolio/vineyard-1.webp', '/images/portfolio/vineyard-2.webp'],
    featured: false
  },
  {
    id: 'port-5',
    title: 'Arthur\'s Pass Conservation',
    description: 'Trap deployment and wildlife monitoring supporting DOC pest control efforts in remote alpine terrain.',
    service: 'Heavy Lift',
    industry: 'Conservation',
    location: 'Arthur\'s Pass',
    date: '2025-08-25',
    images: ['/images/portfolio/arthurs-pass-1.webp', '/images/portfolio/arthurs-pass-2.webp'],
    featured: false
  },
  {
    id: 'port-6',
    title: 'Hagley Oval Cricket',
    description: 'Live event aerial coverage for international cricket broadcast production.',
    service: 'Surveillance & Monitoring',
    industry: 'Events',
    location: 'Christchurch',
    date: '2025-07-18',
    images: ['/images/portfolio/hagley-1.webp', '/images/portfolio/hagley-2.webp'],
    featured: false
  }
]
