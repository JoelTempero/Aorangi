// Image URLs sourced from Aorangi Aerials website
// These will be replaced with local assets once downloaded

export const images = {
  // Logo
  logo: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/AE0aowDkkRUp5gQz/circle-white-transparent-cnVYIxtm9T78mfcz.png',
  logoSquare: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=756,fit=crop,f=jpeg/AE0aowDkkRUp5gQz/circle-square-color-SRzRJpSPNKfEaovK.png',

  // Hero/Featured
  hero: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,fit=crop/AE0aowDkkRUp5gQz/dji_20260124100906_0089_d-uzTFQNne7KNNuNwn.jpg',

  // Certifications
  caaLogo: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=280,fit=crop/AE0aowDkkRUp5gQz/caalogo-Awv9yWZwXBTgyQRD.png',

  // Service backgrounds
  servicesBackground: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=452,fit=crop,trim=0;0;0;0/AE0aowDkkRUp5gQz/services-backround-mnlJnXKJJ2ubKPG6.png',

  // Portfolio/Gallery
  portfolio: [
    'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=crop/AE0aowDkkRUp5gQz/dji_20260124101358_0100_d-xknXl5Tb6QnV9H5S.jpg',
    'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=crop/AE0aowDkkRUp5gQz/lidar-3-d9543v4G2XS6Oayq.jpg',
    'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=crop/AE0aowDkkRUp5gQz/_mg_9231-F6dzRebf1688OZWL.jpg',
    'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=512,fit=crop/AE0aowDkkRUp5gQz/dji_20251229152449_0079_d-hQVF0Jw97Vc8b1ac.jpg',
    'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=512,fit=crop/AE0aowDkkRUp5gQz/dji_20251230191012_0118_d-DQmuhs4DhJL3fumv.jpg',
  ],

  // Icons
  icons: {
    safety: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=375,fit=crop/AE0aowDkkRUp5gQz/2258567-AR0MyRebxJH37x7K.png',
    settings: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=375,fit=crop/AE0aowDkkRUp5gQz/settings-m6Ljweqbg8FblED1.png',
    book: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=375,fit=crop/AE0aowDkkRUp5gQz/open-book-AwvDM2E97zU28gkX.png',
  },

  // Contact page images
  contact: {
    map: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=375,fit=crop/AE0aowDkkRUp5gQz/image-8-YZ9xVkP2VoSWyWea.png',
    drone: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=375,fit=crop/AE0aowDkkRUp5gQz/image-10-YX4ayk8Pl2ck7LRD.png',
  },
}

// Placeholder for hero video - user will provide
export const heroVideo = {
  // Put your hero video file in /public/videos/hero.mp4
  src: '/videos/hero.mp4',
  poster: images.hero, // Fallback image while video loads
}

// Extended gallery images for portfolio page
export const galleryImages = [
  // Original portfolio images
  ...images.portfolio,
  // Additional high-res images
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,fit=crop/AE0aowDkkRUp5gQz/dji_20260124101358_0100_d-xknXl5Tb6QnV9H5S.jpg',
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,fit=crop/AE0aowDkkRUp5gQz/dji_20251229152449_0079_d-hQVF0Jw97Vc8b1ac.jpg',
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,fit=crop/AE0aowDkkRUp5gQz/dji_20251230191012_0118_d-DQmuhs4DhJL3fumv.jpg',
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,fit=crop/AE0aowDkkRUp5gQz/_mg_9231-F6dzRebf1688OZWL.jpg',
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,fit=crop/AE0aowDkkRUp5gQz/lidar-3-d9543v4G2XS6Oayq.jpg',
  'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,fit=crop/AE0aowDkkRUp5gQz/dji_20260124100906_0089_d-uzTFQNne7KNNuNwn.jpg',
]

// Service-specific images for detail pages
export const serviceImages: Record<string, string[]> = {
  'aerial-photography': [
    images.portfolio[0],
    images.portfolio[3],
    images.hero,
  ],
  'surveying-mapping': [
    images.portfolio[1],
    images.portfolio[4],
    images.servicesBackground,
  ],
  'asset-inspections': [
    images.portfolio[2],
    images.portfolio[0],
    images.portfolio[4],
  ],
  'thermal-imaging': [
    images.portfolio[1],
    images.portfolio[3],
    images.portfolio[2],
  ],
  'surveillance-monitoring': [
    images.portfolio[4],
    images.portfolio[0],
    images.portfolio[1],
  ],
  'heavy-lift': [
    images.portfolio[2],
    images.portfolio[4],
    images.portfolio[3],
  ],
  'web-gis': [
    images.portfolio[1],
    images.portfolio[0],
    images.portfolio[2],
  ],
}
