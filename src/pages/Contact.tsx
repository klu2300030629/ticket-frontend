import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const leftIn = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

const Contact: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-black" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 blur-3xl" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }} className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Get in Touch
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.05 }} className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We'd love to hear from you. Send us a message and we'll respond soon.
        </motion.p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger} className="space-y-4">
            {[{ Icon: Mail, label: 'Email', value: 'support@tickethub.com' }, { Icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' }, { Icon: MapPin, label: 'Location', value: '123 Event St, City, ST 12345' }].map(({ Icon, label, value }) => (
              <motion.div key={label} variants={leftIn} transition={{ duration: 0.6 }} className="flex items-center gap-4 rounded-2xl p-4 bg-white/70 dark:bg-white/5 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                  <p className="text-gray-900 dark:text-white font-medium">{value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.form initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} transition={{ duration: 0.6 }} className="group relative rounded-2xl p-6 bg-white/60 dark:bg-white/5 backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10 shadow-lg">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
                <input type="text" className="mt-1 w-full rounded-lg bg-white/70 dark:bg-white/5 px-4 py-3 outline-none ring-1 ring-black/10 dark:ring-white/10 focus:ring-2 focus:ring-indigo-500 transition text-gray-900 dark:text-white" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                <input type="email" className="mt-1 w-full rounded-lg bg-white/70 dark:bg-white/5 px-4 py-3 outline-none ring-1 ring-black/10 dark:ring-white/10 focus:ring-2 focus:ring-indigo-500 transition text-gray-900 dark:text-white" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Message</label>
                <textarea rows={5} className="mt-1 w-full rounded-lg bg-white/70 dark:bg-white/5 px-4 py-3 outline-none ring-1 ring-black/10 dark:ring-white/10 focus:ring-2 focus:ring-indigo-500 transition text-gray-900 dark:text-white" placeholder="How can we help?" />
              </div>
              <div className="flex items-center justify-between">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} type="submit" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-white shadow-sm hover:bg-indigo-500 transition">
                  <Send className="h-4 w-4" /> Send Message
                </motion.button>
                <motion.a href="#contact" whileHover={{ y: -2, scale: 1.05 }} whileTap={{ scale: 0.98 }} className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 text-white text-sm shadow-lg">
                  Contact Sales
                </motion.a>
              </div>
            </div>
            <motion.div aria-hidden className="pointer-events-none absolute -inset-1 rounded-3xl blur-2xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-indigo-500/20 group-focus-within:to-pink-500/20 transition" />
          </motion.form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl"
        >
          <div className="aspect-[16/9]">
            <iframe
              title="map"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509428!2d144.95373631590446!3d-37.81627974251406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ5JzAwLjYiUyAxNDTCsDU3JzE0LjQiRQ!5e0!3m2!1sen!2sus!4v1614038341132"
            />
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;


