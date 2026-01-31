import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import { companyInfo } from '@/data/content'
import { services } from '@/data/services'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-lighter border-t border-dark-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                <span className="font-display font-bold text-white text-lg">A</span>
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg">Aorangi</span>
                <span className="text-white/60 text-sm ml-1">Aerials</span>
              </div>
            </Link>
            <p className="text-white/60 text-sm mb-6">
              {companyInfo.description}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={companyInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-dark-card border border-dark-border text-white/60 hover:text-white hover:border-accent-blue/50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={companyInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-dark-card border border-dark-border text-white/60 hover:text-white hover:border-accent-blue/50 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={companyInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-dark-card border border-dark-border text-white/60 hover:text-white hover:border-accent-blue/50 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {service.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-white/60 text-sm hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/industries" className="text-white/60 text-sm hover:text-white transition-colors">
                  Industries
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-white/60 text-sm hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/60 text-sm hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/quote" className="text-white/60 text-sm hover:text-white transition-colors">
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link to="/portal" className="text-white/60 text-sm hover:text-white transition-colors">
                  Customer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {companyInfo.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  {companyInfo.phone}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    {companyInfo.address.city}, {companyInfo.address.region}
                    <br />
                    {companyInfo.address.country}
                  </span>
                </div>
              </li>
            </ul>

            {/* Certifications */}
            <div className="mt-6 flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-xs font-medium">
                CAA Part 102
              </div>
              <div className="px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/30 text-accent-purple text-xs font-medium">
                Fully Insured
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {currentYear} Aorangi Aerials. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Part of Southern Drone Solutions Group
          </p>
        </div>
      </div>
    </footer>
  )
}
