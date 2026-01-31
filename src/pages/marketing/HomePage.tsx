import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Shield,
  Award,
  Cpu,
  Phone,
  Play,
} from 'lucide-react'
import { WeatherWidget } from '@/components/sections/WeatherWidget'
import { ServiceCard } from '@/components/sections/ServiceCard'
import { PageTransition, fadeInUp, staggerContainer } from '@/components/effects/PageTransition'
import { Button } from '@/components/ui/Button'
import { services } from '@/data/services'
import { companyInfo, whyChooseUs, testimonials } from '@/data/content'
import { images, heroVideo } from '@/data/images'
import { cn } from '@/lib/utils'
import { useLoading } from '@/contexts/LoadingContext'

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { isInitialLoading } = useLoading()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  // Delay animations until loading screen is gone
  const animationDelay = isInitialLoading ? 2.8 : 0

  return (
    <PageTransition>
      <Helmet>
        <title>Aorangi Aerials | Professional Drone Services Christchurch NZ</title>
        <meta
          name="description"
          content="CAA Part 102 certified drone services in Christchurch, New Zealand. Aerial photography, surveying, mapping, inspections, thermal imaging & heavy lift operations."
        />
      </Helmet>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Video Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: animationDelay - 0.3, ease: 'easeOut' }}
          style={{ scale: heroScale, y: heroY }}
          className="absolute inset-0 z-0"
        >
          <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={heroVideo.poster}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={heroVideo.src} type="video/mp4" />
            </video>
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-24">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: animationDelay, ease: 'easeOut' }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/30 mb-8">
                <Shield className="w-4 h-4 text-accent-blue" />
                <span className="text-accent-blue text-sm font-medium">CAA Part 102 Certified</span>
              </div>

              {/* Headline - Each word on its own row */}
              <h1 className="heading-display text-white mb-8">
                <span className="block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl text-gradient">
                  Precision
                </span>
                <span className="block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl">
                  From
                </span>
                <span className="block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl">
                  Above
                </span>
              </h1>

              <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
                {companyInfo.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button size="lg" asChild>
                  <Link to="/quote">
                    <Phone className="w-5 h-5 mr-2" />
                    Get a Quote
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/portfolio">
                    <Play className="w-5 h-5 mr-2" />
                    View Our Work
                  </Link>
                </Button>
              </div>

              {/* Weather Widget */}
              <div className="max-w-xs mx-auto">
                <WeatherWidget />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-dark-lighter relative">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="enter"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="text-accent-blue text-sm font-medium uppercase tracking-wider"
            >
              Our Services
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="heading-display text-4xl sm:text-5xl text-white mt-4 mb-6"
            >
              Safe, Compliant & Efficient
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-white/60 text-lg max-w-2xl mx-auto"
            >
              From aerial photography to heavy lift operations, we deliver professional drone solutions across New Zealand.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link to="/services">
                View All Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-dark relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${images.servicesBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-blue/5 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-accent-blue text-sm font-medium uppercase tracking-wider">
                Why Choose Us
              </span>
              <h2 className="heading-display text-4xl sm:text-5xl text-white mt-4 mb-6">
                Your Trusted Aerial Partner
              </h2>
              <p className="text-white/60 text-lg mb-8">
                With industry-leading equipment, certified operators, and a commitment to safety, we deliver exceptional results for every project.
              </p>

              <div className="space-y-6">
                {whyChooseUs.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-accent-blue flex-shrink-0">
                      {iconMap[item.icon] || <Shield className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-white text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-white/60 text-sm">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-6"
            >
              {companyInfo.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'bg-dark-card border border-dark-border rounded-2xl p-6 text-center',
                    index === 0 && 'lg:translate-y-8',
                    index === 3 && 'lg:-translate-y-8'
                  )}
                >
                  <div className="text-4xl sm:text-5xl font-display font-bold text-gradient mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-dark-lighter">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-accent-blue text-sm font-medium uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="heading-display text-4xl sm:text-5xl text-white mt-4 mb-6">
              What Our Clients Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-card border border-dark-border rounded-2xl p-6"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-white/70 text-sm mb-6 line-clamp-4">"{testimonial.quote}"</p>

                <div>
                  <p className="text-white font-medium text-sm">{testimonial.name}</p>
                  <p className="text-white/50 text-xs">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-accent-blue/20 via-dark to-accent-purple/20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="heading-display text-4xl sm:text-5xl text-white mb-6">
              Ready to Take Your Project to New Heights?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Contact us today for a free consultation and quote. Our team is ready to help you achieve your aerial objectives.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/quote">
                  Get a Free Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
