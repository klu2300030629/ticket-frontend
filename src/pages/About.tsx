import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

const About: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-black" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 blur-3xl" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white text-center">
            About Us
          </h1>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We connect people with unforgettable experiences through seamless ticket booking.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Our Mission', desc: 'To make discovering and booking events delightful and effortless.' },
            { title: 'Our Vision', desc: 'A world where every seat leads to a memorable story.' },
            { title: 'Our Values', desc: 'Customer-first, innovation, and trust guide everything we do.' }
          ].map((card) => (
            <motion.div key={card.title} variants={fadeUp} transition={{ duration: 0.6 }} className="group relative overflow-hidden rounded-2xl p-6 bg-white/70 dark:bg-white/5 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 hover:shadow-xl transition-shadow">
              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:to-pink-500/10 rounded-2xl transition" />
              <div className="relative">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Meet the Team</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Passionate people behind TicketHub</p>
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Alex Johnson', role: 'CEO & Co-founder', img: 'https://i.pravatar.cc/300?img=1' },
            { name: 'Priya Sharma', role: 'Head of Product', img: 'https://i.pravatar.cc/300?img=2' },
            { name: 'Diego Martinez', role: 'Lead Engineer', img: 'https://i.pravatar.cc/300?img=3' }
          ].map((member) => (
            <motion.div key={member.name} variants={fadeUp} transition={{ duration: 0.6 }} className="group rounded-2xl overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 hover:shadow-xl transition">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={member.img} alt={member.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{member.role}</p>
                <div className="mt-4 flex items-center gap-3">
                  {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                    <a key={i} href="/#" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default About;


