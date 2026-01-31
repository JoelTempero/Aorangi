import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Phone, MapPin, Send, Check, Instagram, Linkedin, Facebook } from 'lucide-react'
import { PageTransition, fadeInUp, staggerContainer } from '@/components/effects/PageTransition'
import { Button } from '@/components/ui/Button'
import { companyInfo } from '@/data/content'
import { services } from '@/data/services'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Contact form submitted:', data)
    setIsSubmitting(false)
    setIsSubmitted(true)
    reset()
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Contact Us | Aorangi Aerials</title>
        <meta
          name="description"
          content="Get in touch with Aorangi Aerials for professional drone services in Christchurch and Canterbury. Call 03 4217 520 or email hello@aorangiaerials.nz"
        />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="enter"
            className="max-w-3xl"
          >
            <motion.span
              variants={fadeInUp}
              className="text-accent-blue text-sm font-medium uppercase tracking-wider"
            >
              Contact Us
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="heading-display text-5xl sm:text-6xl text-white mt-4 mb-6"
            >
              Let's Chat
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/60 text-xl">
              Have a question or ready to start your project? We'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-dark-lighter">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <h2 className="heading-display text-2xl text-white mb-6">Get in Touch</h2>

              <div className="space-y-6 mb-8">
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="flex items-start gap-4 p-4 bg-dark-card border border-dark-border rounded-xl hover:border-accent-blue/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-accent-blue">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Email</p>
                    <p className="text-white font-medium group-hover:text-accent-blue transition-colors">
                      {companyInfo.email}
                    </p>
                  </div>
                </a>

                <a
                  href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-4 p-4 bg-dark-card border border-dark-border rounded-xl hover:border-accent-blue/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-accent-blue">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Phone</p>
                    <p className="text-white font-medium group-hover:text-accent-blue transition-colors">
                      {companyInfo.phone}
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 bg-dark-card border border-dark-border rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-accent-blue">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Location</p>
                    <p className="text-white font-medium">
                      {companyInfo.address.city}, {companyInfo.address.region}
                      <br />
                      {companyInfo.address.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <p className="text-white/60 text-sm mb-4">Follow Us</p>
                <div className="flex gap-3">
                  <a
                    href={companyInfo.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-dark-card border border-dark-border rounded-xl text-white/60 hover:text-white hover:border-accent-blue/50 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href={companyInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-dark-card border border-dark-border rounded-xl text-white/60 hover:text-white hover:border-accent-blue/50 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={companyInfo.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-dark-card border border-dark-border rounded-xl text-white/60 hover:text-white hover:border-accent-blue/50 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="heading-display text-2xl text-white mb-2">Message Sent!</h3>
                    <p className="text-white/60 mb-6">
                      Thanks for getting in touch. We'll respond within 24 hours.
                    </p>
                    <Button variant="secondary" onClick={() => setIsSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Name *</label>
                        <input
                          {...register('name')}
                          className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white placeholder-white/40 focus:border-accent-blue focus:outline-none transition-colors"
                          placeholder="Your name"
                        />
                        {errors.name && (
                          <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Email *</label>
                        <input
                          {...register('email')}
                          type="email"
                          className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white placeholder-white/40 focus:border-accent-blue focus:outline-none transition-colors"
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Phone</label>
                        <input
                          {...register('phone')}
                          type="tel"
                          className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white placeholder-white/40 focus:border-accent-blue focus:outline-none transition-colors"
                          placeholder="021 123 4567"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Company</label>
                        <input
                          {...register('company')}
                          className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white placeholder-white/40 focus:border-accent-blue focus:outline-none transition-colors"
                          placeholder="Your company"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">Service Interest</label>
                      <select
                        {...register('service')}
                        className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white focus:border-accent-blue focus:outline-none transition-colors"
                      >
                        <option value="">Select a service (optional)</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.shortName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">Message *</label>
                      <textarea
                        {...register('message')}
                        rows={5}
                        className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white placeholder-white/40 focus:border-accent-blue focus:outline-none transition-colors resize-none"
                        placeholder="Tell us about your project..."
                      />
                      {errors.message && (
                        <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
