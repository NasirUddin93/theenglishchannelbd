'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Mail, Phone, MapPin, Heart, Target, Users, Book as BookIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface AboutData {
  id: number;
  title: string;
  hero_description: string;
  our_story: string;
  our_mission: string;
  our_values: string;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
}

export default function About() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<AboutData>('/about')
      .then((res) => setAbout(res))
      .catch(() => setAbout(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Failed to load about page</h2>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-20">
      <section className="relative overflow-hidden rounded-3xl bg-gray-900 text-white p-8 md:p-16 lg:p-24">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-orange-500/20 to-transparent"></div>
          <img src="https://picsum.photos/seed/about/800/1200" className="w-full h-full object-cover" alt="" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-orange-400 mb-6"
          >
            <BookIcon className="w-3 h-3" />
            <span>Our Story</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-8"
          >
            {about.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-300 leading-relaxed max-w-lg"
          >
            {about.hero_description}
          </motion.p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: BookOpen, title: 'Curated Collection', desc: 'Every book is hand-picked by our literary experts.' },
          { icon: Heart, title: 'Passion for Reading', desc: 'We believe in the transformative power of stories.' },
          { icon: Users, title: 'Community First', desc: 'Building connections through shared love of literature.' },
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-orange-100 transition-all"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-6">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-gray-900">Our Story</h2>
          </div>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{about.our_story}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{about.our_mission}</p>
        </motion.div>
      </section>

      <section className="bg-white rounded-3xl p-12 border border-gray-100">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Heart className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-gray-900">Our Values</h2>
          </div>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{about.our_values}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {about.contact_email && (
          <motion.a 
            href={`mailto:${about.contact_email}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-orange-100 transition-all text-center group"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-500">{about.contact_email}</p>
          </motion.a>
        )}

        {about.contact_phone && (
          <motion.a 
            href={`tel:${about.contact_phone}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-orange-100 transition-all text-center group"
          >
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-500">{about.contact_phone}</p>
          </motion.a>
        )}

        {about.contact_address && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-orange-100 transition-all text-center"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-500">{about.contact_address}</p>
          </motion.div>
        )}
      </section>

      <section className="text-center">
        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-6">Ready to Discover Great Books?</h2>
        <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
          <BookIcon className="w-5 h-5" />
          <span>Browse Our Collection</span>
        </Link>
      </section>
    </div>
  );
}
