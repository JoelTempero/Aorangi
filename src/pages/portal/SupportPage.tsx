import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { HelpCircle, MessageSquare, Phone, Mail, Send, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { PageTransition } from '@/components/effects/PageTransition'
import { Button } from '@/components/ui/Button'
import { faqs, companyInfo } from '@/data/content'

const ticketSchema = z.object({
  subject: z.string().min(5, 'Subject is required'),
  category: z.string().min(1, 'Please select a category'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type TicketFormData = z.infer<typeof ticketSchema>

const categories = [
  { value: 'project', label: 'Project Question' },
  { value: 'deliverable', label: 'Deliverable Issue' },
  { value: 'billing', label: 'Billing & Invoices' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'other', label: 'Other' },
]

export default function SupportPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  })

  const onSubmit = async (data: TicketFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Support ticket submitted:', data)
    setIsSubmitted(true)
    reset()
  }

  return (
    <PageTransition>
      <Helmet>
        <title>Support | Aorangi Aerials Portal</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="heading-display text-2xl text-white">Support</h1>
          <p className="text-white/60">Get help with your projects and account.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contact Info & Ticket Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              <a
                href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
                className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-accent-blue/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-accent-blue" />
                </div>
                <h3 className="text-white font-medium mb-1">Call Us</h3>
                <p className="text-white/60 text-sm">{companyInfo.phone}</p>
                <p className="text-white/40 text-xs mt-2">Mon-Fri, 8am-5pm NZST</p>
              </a>

              <a
                href={`mailto:${companyInfo.email}`}
                className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-accent-blue/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-accent-purple" />
                </div>
                <h3 className="text-white font-medium mb-1">Email Us</h3>
                <p className="text-white/60 text-sm">{companyInfo.email}</p>
                <p className="text-white/40 text-xs mt-2">We respond within 24 hours</p>
              </a>
            </motion.div>

            {/* Support Ticket Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-dark-card border border-dark-border rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-white">Submit a Ticket</h2>
                  <p className="text-white/60 text-sm">We'll get back to you as soon as possible.</p>
                </div>
              </div>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Ticket Submitted!</h3>
                  <p className="text-white/60 text-sm mb-4">
                    We've received your request and will respond within 24 hours.
                  </p>
                  <Button variant="secondary" onClick={() => setIsSubmitted(false)}>
                    Submit Another Ticket
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Category *</label>
                    <select
                      {...register('category')}
                      className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white focus:border-accent-blue focus:outline-none transition-colors"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">Subject *</label>
                    <input
                      {...register('subject')}
                      className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white placeholder-white/40 focus:border-accent-blue focus:outline-none transition-colors"
                      placeholder="Brief description of your issue"
                    />
                    {errors.subject && (
                      <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">Message *</label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white placeholder-white/40 focus:border-accent-blue focus:outline-none transition-colors resize-none"
                      placeholder="Please provide as much detail as possible..."
                    />
                    {errors.message && (
                      <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button type="submit" loading={isSubmitting} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </Button>
                </form>
              )}
            </motion.div>
          </div>

          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-card border border-dark-border rounded-xl"
          >
            <div className="p-4 border-b border-dark-border flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-accent-blue" />
              <h2 className="font-display font-semibold text-white">FAQs</h2>
            </div>

            <div className="divide-y divide-dark-border">
              {faqs.slice(0, 5).map((faq) => (
                <div key={faq.id}>
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white text-sm font-medium">{faq.question}</span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="w-4 h-4 text-white/40 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4">
                      <p className="text-white/60 text-sm">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
