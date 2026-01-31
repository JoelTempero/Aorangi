import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Receipt, Download, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { usePortalStore } from '@/stores/portalStore'
import { PageTransition } from '@/components/effects/PageTransition'
import { Button } from '@/components/ui/Button'
import { formatDate, formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

const statusConfig = {
  draft: { label: 'Draft', color: 'text-white/60', bg: 'bg-white/10', icon: Clock },
  sent: { label: 'Awaiting Payment', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: AlertCircle },
  paid: { label: 'Paid', color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle },
  overdue: { label: 'Overdue', color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle },
}

export default function InvoicesPage() {
  const { invoices } = usePortalStore()

  const totalOutstanding = invoices
    .filter((i) => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.total, 0)

  const totalPaid = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0)

  return (
    <PageTransition>
      <Helmet>
        <title>Invoices | Aorangi Aerials Portal</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="heading-display text-2xl text-white">Invoices</h1>
          <p className="text-white/60">View and manage your invoices.</p>
        </div>

        {/* Summary */}
        <div className="grid sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-card border border-dark-border rounded-xl p-6"
          >
            <p className="text-white/60 text-sm">Outstanding Balance</p>
            <p className="text-3xl font-display font-bold text-white mt-1">
              {formatCurrency(totalOutstanding)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-card border border-dark-border rounded-xl p-6"
          >
            <p className="text-white/60 text-sm">Total Paid</p>
            <p className="text-3xl font-display font-bold text-green-500 mt-1">
              {formatCurrency(totalPaid)}
            </p>
          </motion.div>
        </div>

        {/* Invoices List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-card border border-dark-border rounded-xl"
        >
          <div className="p-4 border-b border-dark-border">
            <h2 className="font-display font-semibold text-white">All Invoices</h2>
          </div>

          {invoices.length === 0 ? (
            <div className="p-12 text-center">
              <Receipt className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">No invoices yet</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-border">
              {invoices.map((invoice) => {
                const status = statusConfig[invoice.status]
                const StatusIcon = status.icon

                return (
                  <div key={invoice.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-dark-lighter flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-5 h-5 text-white/40" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <p className="text-white font-medium">{invoice.invoiceNumber}</p>
                          <span className={cn('px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1', status.bg, status.color)}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-white/50 text-sm truncate">{invoice.projectName}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-white font-medium">{formatCurrency(invoice.total)}</p>
                        <p className="text-white/40 text-sm">
                          {invoice.status === 'paid'
                            ? `Paid ${formatDate(invoice.paidDate!)}`
                            : `Due ${formatDate(invoice.dueDate)}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Invoice Items Preview */}
                    <div className="mt-4 pl-16">
                      <div className="bg-dark-lighter rounded-lg p-3">
                        <div className="space-y-1">
                          {invoice.items.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-white/60">{item.description}</span>
                              <span className="text-white/80">{formatCurrency(item.total)}</span>
                            </div>
                          ))}
                          {invoice.items.length > 2 && (
                            <p className="text-white/40 text-xs">
                              +{invoice.items.length - 2} more items
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between text-sm mt-2 pt-2 border-t border-dark-border">
                          <span className="text-white/60">GST (15%)</span>
                          <span className="text-white/80">{formatCurrency(invoice.tax)}</span>
                        </div>
                      </div>

                      {invoice.status === 'sent' && (
                        <div className="mt-3">
                          <Button size="sm" className="w-full sm:w-auto">
                            Pay Now
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  )
}
