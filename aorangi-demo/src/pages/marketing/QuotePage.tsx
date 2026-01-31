import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, ArrowRight, ArrowLeft, Calculator, Send } from 'lucide-react'
import { PageTransition, fadeInUp, staggerContainer } from '@/components/effects/PageTransition'
import { Button } from '@/components/ui/Button'
import { services } from '@/data/services'
import { cn } from '@/lib/utils'

const quoteSchema = z.object({
  service: z.string().min(1, 'Please select a service'),
  projectType: z.string().optional(),
  location: z.string().min(2, 'Please enter a location'),
  area: z.number().optional(),
  timeline: z.string().min(1, 'Please select a timeline'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  details: z.string().min(10, 'Please provide some project details'),
})

type QuoteFormData = z.infer<typeof quoteSchema>

const timelines = [
  { value: 'urgent', label: 'Urgent (1-2 days)' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'Within a month' },
  { value: 'flexible', label: 'Flexible' },
]

export default function QuotePage() {
  const [step, setStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState<{ min: number; max: number } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      area: 1,
    },
  })

  const selectedService = watch('service')
  const area = watch('area')

  // Simple price estimator
  const calculateEstimate = () => {
    const basePrice: Record<string, { min: number; max: number; perHectare?: number }> = {
      'aerial-photography': { min: 350, max: 2500 },
      'surveying-mapping': { min: 500, max: 5000, perHectare: 250 },
      'asset-inspections': { min: 400, max: 2000 },
      'thermal-multispectral': { min: 600, max: 3000 },
      'surveillance-monitoring': { min: 1500, max: 5000 },
      'heavy-lift': { min: 800, max: 4000 },
      'geospatial-analysis': { min: 500, max: 3000 },
    }

    const service = basePrice[selectedService]
    if (!service) return null

    let min = service.min
    let max = service.max

    if (service.perHectare && area) {
      min = Math.max(service.min, area * service.perHectare * 0.8)
      max = Math.max(service.max, area * service.perHectare * 1.2)
    }

    return { min: Math.round(min), max: Math.round(max) }
  }

  const handleNext = async () => {
    const fieldsToValidate: (keyof QuoteFormData)[][] = [
      ['service', 'location', 'timeline'],
      ['name', 'email', 'details'],
    ]

    const isValid = await trigger(fieldsToValidate[step - 1])
    if (isValid) {
      if (step === 1) {
        setEstimatedPrice(calculateEstimate())
      }
      setStep(step + 1)
    }
  }

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Quote request submitted:', data)
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Get a Quote | Aorangi Aerials</title>
        <meta
          name="description"
          content="Request a free quote for professional drone services. Fast response and competitive pricing for aerial photography, surveying, inspections and more."
        />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-8 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="enter"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.span
              variants={fadeInUp}
              className="text-accent-blue text-sm font-medium uppercase tracking-wider"
            >
              Free Quote
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="heading-display text-4xl sm:text-5xl text-white mt-4 mb-6"
            >
              Get Your Project Quote
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/60 text-lg">
              Tell us about your project and we'll provide a tailored quote within 24 hours.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-8 pb-24 bg-dark-lighter">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="flex items-center justify-center gap-4 mb-12">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors',
                      step >= s
                        ? 'bg-accent-blue text-white'
                        : 'bg-dark-card border border-dark-border text-white/40'
                    )}
                  >
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={cn(
                        'w-16 h-0.5 mx-2',
                        step > s ? 'bg-accent-blue' : 'bg-dark-border'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="heading-display text-2xl text-white mb-2">Quote Request Received!</h2>
                <p className="text-white/60 mb-6">
                  Thanks for your interest. We'll review your requirements and send you a detailed quote within 24 hours.
                </p>
                {estimatedPrice && (
                  <div className="bg-dark-lighter rounded-xl p-4 mb-6">
                    <p className="text-white/60 text-sm">Estimated Range</p>
                    <p className="text-2xl font-display font-bold text-gradient">
                      ${estimatedPrice.min.toLocaleString()} - ${estimatedPrice.max.toLocaleString()} NZD
                    </p>
                  </div>
                )}
                <Button variant="secondary" onClick={() => window.location.reload()}>
                  Submit Another Request
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
                  {/* Step 1: Project Details */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Service Required *</label>
                        <select
                          {...register('service')}
                          className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white focus:border-accent-blue focus:outline-none transition-colors"
                        >
                          <option value="">Select a service</option>
                          {services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.shortName}
                            </option>
                          ))}
                        </select>
                        {errors.service && (
                          <p className="text-red-400 text-sm mt-1">{errors.service.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm mb-2">Project Location *</label>
                        <input
                          {...register('location')}
                          className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white placeholder-white/40 focus:border-accent-blue focus:outline-none transition-colors"
                          placeholder="e.g., Christchurch, Canterbury"
                        />
                        {errors.location && (
                          <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>
                        )}
                      </div>

                      {(selectedService === 'surveying-mapping' || selectedService === 'thermal-multispectral') && (
                        <div>
                          <label className="block text-white/80 text-sm mb-2">
                            Approximate Area (hectares)
                          </label>
                          <input
                            {...register('area', { valueAsNumber: true })}
                            type="number"
                            min="0.1"
                            step="0.1"
                            className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white placeholder-white/40 focus:border-accent-blue focus:outline-none transition-colors"
                            placeholder="e.g., 5"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-white/80 text-sm mb-2">Timeline *</label>
                        <div className="grid grid-cols-2 gap-3">
                          {timelines.map((t) => (
                            <label
                              key={t.value}
                              className={cn(
                                'flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors',
                                watch('timeline') === t.value
                                  ? 'border-accent-blue bg-accent-blue/10 text-white'
                                  : 'border-dark-border text-white/60 hover:border-white/30'
                              )}
                            >
                              <input
                                type="radio"
                                {...register('timeline')}
                                value={t.value}
                                className="sr-only"
                              />
                              {t.label}
                            </label>
                          ))}
                        </div>
                        {errors.timeline && (
                          <p className="text-red-400 text-sm mt-1">{errors.timeline.message}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Contact Details */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {estimatedPrice && (
                        <div className="bg-dark-lighter rounded-xl p-4 mb-6 flex items-center gap-4">
                          <Calculator className="w-8 h-8 text-accent-blue" />
                          <div>
                            <p className="text-white/60 text-sm">Estimated Price Range</p>
                            <p className="text-xl font-display font-bold text-white">
                              ${estimatedPrice.min.toLocaleString()} - ${estimatedPrice.max.toLocaleString()} NZD
                            </p>
                          </div>
                        </div>
                      )}

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
                        <label className="block text-white/80 text-sm mb-2">Project Details *</label>
                        <textarea
                          {...register('details')}
                          rows={4}
                          className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white placeholder-white/40 focus:border-accent-blue focus:outline-none transition-colors resize-none"
                          placeholder="Tell us more about your project requirements..."
                        />
                        {errors.details && (
                          <p className="text-red-400 text-sm mt-1">{errors.details.message}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-border">
                    {step > 1 ? (
                      <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                    ) : (
                      <div />
                    )}

                    {step < 2 ? (
                      <Button type="button" onClick={handleNext}>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button type="submit" loading={isSubmitting}>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Request
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
