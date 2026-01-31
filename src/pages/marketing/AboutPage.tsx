import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Shield, Award, Moon, ArrowRight, Check } from 'lucide-react'
import { PageTransition, fadeInUp, staggerContainer } from '@/components/effects/PageTransition'
import { Button } from '@/components/ui/Button'
import { companyInfo } from '@/data/content'

const certifications = [
  {
    name: 'CAA Part 102 Certified',
    description: 'Operating under a Civil Aviation Authority Unmanned Aircraft Operator Certificate',
    icon: Shield,
  },
  {
    name: 'Fully Insured',
    description: 'Comprehensive public liability and aviation insurance coverage',
    icon: Award,
  },
  {
    name: 'Night Operations',
    description: 'Authorized for night operations and special airspace permissions',
    icon: Moon,
  },
]

const values = [
  {
    title: 'Safety First',
    description: 'We never compromise on safety. Every operation follows strict protocols and CAA guidelines.',
  },
  {
    title: 'Quality Results',
    description: 'We use enterprise-grade equipment and proven workflows to deliver exceptional data and imagery.',
  },
  {
    title: 'Client Focus',
    description: 'Your project goals drive everything we do. We work closely with you to exceed expectations.',
  },
  {
    title: 'Innovation',
    description: 'We continuously invest in the latest technology and techniques to stay at the forefront of the industry.',
  },
]

export default function AboutPage() {
  return (
    <PageTransition>
      <Helmet>
        <title>About Us | Aorangi Aerials</title>
        <meta
          name="description"
          content="Learn about Aorangi Aerials - your CAA Part 102 certified drone service provider in Christchurch, New Zealand. Professional, safe, and reliable aerial solutions."
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
              About Us
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="heading-display text-5xl sm:text-6xl text-white mt-4 mb-6"
            >
              Taking Your Perspective to New Heights
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/60 text-xl">
              {companyInfo.mission}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-dark-lighter">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-display text-3xl text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-white/70">
                <p>
                  Aorangi Aerials was founded with a simple mission: to help clients see their world differently through high-quality drone services. Based in Christchurch, we serve clients throughout Canterbury and the wider South Island.
                </p>
                <p>
                  As part of the Southern Drone Solutions Group, we bring together advanced technology, certified operators, and a deep appreciation for New Zealand's unique landscapes to deliver both beautiful and practical aerial solutions.
                </p>
                <p>
                  From surveying vast farmlands to capturing cinematic footage of our stunning coastlines, every project we undertake reflects our commitment to quality, safety, and professionalism.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {companyInfo.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`bg-dark-card border border-dark-border rounded-2xl p-6 text-center ${
                    index === 0 ? 'col-span-2' : ''
                  }`}
                >
                  <div className="text-4xl font-display font-bold text-gradient mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-display text-3xl text-white mb-4">
              Certified & Compliant
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              We maintain the highest standards of safety and compliance in all our operations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-accent-blue mx-auto mb-4">
                  <cert.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display font-semibold text-white text-xl mb-2">
                  {cert.name}
                </h3>
                <p className="text-white/60 text-sm">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-dark-lighter">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-display text-3xl text-white mb-4">Our Values</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-card border border-dark-border rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-accent-blue mb-4">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">
                  {value.title}
                </h3>
                <p className="text-white/60 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 border border-dark-border rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="heading-display text-3xl sm:text-4xl text-white mb-4">
              Let's Work Together
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Ready to discuss your project? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/quote">
                  Get a Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
