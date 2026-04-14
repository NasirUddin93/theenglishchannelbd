'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Mail, Phone, MapPin, Heart, Target, Users,
  Book as BookIcon, Sparkles, ArrowRight, Quote, Star,
  Globe, Feather, ChevronRight,
} from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { api } from '@/lib/api';

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

/* ── Fade-in wrapper ──────────────────────────────────────────── */
function FadeIn({
  children, delay = 0, direction = 'up', className = '',
}: { children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' | 'none'; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 32 : 0,
      x: direction === 'left' ? -32 : direction === 'right' ? 32 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

/* ── Section label ────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
      bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest mb-5">
      <Sparkles className="w-3 h-3" />
      {children}
    </div>
  );
}

/* ── Divider ──────────────────────────────────────────────────── */
function Divider() {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="w-1.5 h-1.5 rounded-full bg-orange-300" />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
export default function About() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<AboutData>('/about')
      .then(setAbout)
      .catch(() => setAbout(null))
      .finally(() => setLoading(false));
  }, []);

  /* ── Loading ── */
  if (loading) return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center space-y-5">
        <div className="relative w-14 h-14 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-orange-400 animate-pulse" />
          </div>
        </div>
        <p className="text-sm text-gray-400 tracking-widest uppercase font-medium">Loading…</p>
      </div>
    </div>
  );

  if (!about) return (
    <div className="flex items-center justify-center min-h-[60vh] text-center">
      <div className="space-y-3">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
          <BookOpen className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Failed to load about page</h2>
        <p className="text-gray-500">Please try refreshing the page.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-28 pb-24 overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gray-950 min-h-[560px] flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0">
          <img src="https://picsum.photos/seed/about/1600/900" alt=""
            className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-gray-900/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
        </div>

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

        {/* Decorative glow */}
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-28">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-orange-400 mb-7 shadow-sm">
              <BookIcon className="w-3.5 h-3.5" />
              Our Story
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: [0.22,1,0.36,1] }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] text-white mb-7 tracking-tight">
              {about.title}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7 }}
              className="text-lg text-gray-300/90 leading-relaxed max-w-xl mb-10">
              {about.hero_description}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
              className="flex flex-wrap items-center gap-4">
              <Link href="/shop"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-orange-600 to-amber-500
                  text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all
                  shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0">
                <BookIcon className="w-4 h-4" /> Browse Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={`mailto:${about.contact_email}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/8 backdrop-blur-sm border border-white/10
                  text-white rounded-2xl font-semibold text-sm hover:bg-white/12 transition-all">
                <Mail className="w-4 h-4 text-orange-400" /> Get in Touch
              </a>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#faf9f7] to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════
          FEATURE PILLARS
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <SectionLabel>What Drives Us</SectionLabel>
          <h2 className="font-serif text-4xl font-bold text-gray-900 tracking-tight">
            Built on Three Pillars
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen, label: 'Curated Collection',
              desc: 'Every book is hand-picked by our literary experts to ensure unmatched quality and depth.',
              accent: 'from-orange-500/10 to-amber-400/5', border: 'hover:border-orange-200',
              iconBg: 'bg-orange-50 border-orange-100', iconColor: 'text-orange-600',
            },
            {
              icon: Heart, label: 'Passion for Reading',
              desc: 'We believe in the transformative power of stories to reshape lives and expand horizons.',
              accent: 'from-rose-500/10 to-pink-400/5', border: 'hover:border-rose-200',
              iconBg: 'bg-rose-50 border-rose-100', iconColor: 'text-rose-500',
            },
            {
              icon: Users, label: 'Community First',
              desc: 'Building deep connections through a shared love of literature and the written word.',
              accent: 'from-violet-500/10 to-purple-400/5', border: 'hover:border-violet-200',
              iconBg: 'bg-violet-50 border-violet-100', iconColor: 'text-violet-600',
            },
          ].map((f, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className={`group relative h-full p-8 bg-white rounded-3xl border border-gray-100 ${f.border}
                hover:shadow-2xl hover:shadow-gray-100/80 hover:-translate-y-1.5
                transition-all duration-300 overflow-hidden cursor-default`}>
                {/* gradient blob */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className={`w-14 h-14 ${f.iconBg} border rounded-2xl flex items-center justify-center mb-7 shadow-sm
                    group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-900">{f.label}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
                </div>

                {/* bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.accent.replace('/10','').replace('/5','')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STORY + MISSION
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Story */}
          <FadeIn direction="left">
            <div className="h-full rounded-3xl bg-white border border-gray-100 hover:border-orange-100 hover:shadow-xl hover:shadow-orange-50 transition-all duration-300 overflow-hidden">
              {/* Card top accent */}
              <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-400" />
              <div className="p-10">
                <SectionLabel>Chapter One</SectionLabel>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center shadow-sm">
                    <BookOpen className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Our Story</h2>
                </div>
                <Divider />
                <div className="mt-6 relative">
                  <Quote className="absolute -top-1 -left-1 w-8 h-8 text-orange-100" />
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line pl-12 text-[15px]">
                    {about.our_story}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Mission */}
          <FadeIn direction="right">
            <div className="h-full rounded-3xl bg-white border border-gray-100 hover:border-amber-100 hover:shadow-xl hover:shadow-amber-50 transition-all duration-300 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-400" />
              <div className="p-10">
                <SectionLabel>Our Purpose</SectionLabel>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center shadow-sm">
                    <Target className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Our Mission</h2>
                </div>
                <Divider />
                <div className="mt-6 relative">
                  <Quote className="absolute -top-1 -left-1 w-8 h-8 text-amber-100" />
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line pl-12 text-[15px]">
                    {about.our_mission}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          VALUES (full-width premium card)
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-10 sm:p-14 lg:p-20">
            {/* Texture */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <SectionLabel>What We Believe</SectionLabel>

              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/10 border border-white/15 rounded-2xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-orange-400" />
                </div>
                <h2 className="font-serif text-4xl lg:text-5xl font-bold tracking-tight">Our Values</h2>
              </div>

              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mb-8" />

              <p className="text-gray-300/90 leading-relaxed whitespace-pre-line text-[16px] lg:text-lg">
                {about.our_values}
              </p>

              {/* Value icons row */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
                {[
                  { icon: Star,   label: 'Excellence' },
                  { icon: Globe,  label: 'Inclusivity' },
                  { icon: Feather,label: 'Creativity' },
                  { icon: Heart,  label: 'Empathy' },
                ].map((v) => (
                  <div key={v.label} className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center
                      group-hover:bg-orange-500/20 group-hover:border-orange-500/30 transition-all duration-200">
                      <v.icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">{v.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════════════════════════════════
          CONTACT CARDS
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <SectionLabel>Reach Out</SectionLabel>
          <h2 className="font-serif text-4xl font-bold text-gray-900 tracking-tight">Get in Touch</h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
            We'd love to hear from you. Choose the most convenient way to connect with us.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email */}
          {about.contact_email && (
            <FadeIn delay={0}>
              <a href={`mailto:${about.contact_email}`}
                className="group relative flex flex-col items-center text-center p-9 bg-white rounded-3xl border border-gray-100
                  hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-50 hover:-translate-y-2
                  transition-all duration-300 overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mb-6
                  group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300 shadow-sm">
                  <Mail className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Email Us</h3>
                <p className="text-gray-500 text-sm break-all">{about.contact_email}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Send email <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </a>
            </FadeIn>
          )}

          {/* Phone */}
          {about.contact_phone && (
            <FadeIn delay={0.1}>
              <a href={`tel:${about.contact_phone}`}
                className="group relative flex flex-col items-center text-center p-9 bg-white rounded-3xl border border-gray-100
                  hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-50 hover:-translate-y-2
                  transition-all duration-300 overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6
                  group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300 shadow-sm">
                  <Phone className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Call Us</h3>
                <p className="text-gray-500 text-sm">{about.contact_phone}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Call now <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </a>
            </FadeIn>
          )}

          {/* Address */}
          {about.contact_address && (
            <FadeIn delay={0.2}>
              <div className="group relative flex flex-col items-center text-center p-9 bg-white rounded-3xl border border-gray-100
                hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 hover:-translate-y-2
                transition-all duration-300 overflow-hidden h-full cursor-default">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-6
                  group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300 shadow-sm">
                  <MapPin className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Visit Us</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{about.contact_address}</p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 p-12 sm:p-16 text-center shadow-2xl shadow-orange-200">
            {/* Texture */}
            <div className="absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '36px 36px' }} />
            {/* Blobs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-amber-300/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-6">
                <Sparkles className="w-3 h-3" /> Start Your Journey
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                Ready to Discover<br />Great Books?
              </h2>
              <p className="text-orange-50/80 mb-9 text-base leading-relaxed">
                Explore our hand-curated collection of literary masterpieces — chosen to inspire, educate, and transform.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/shop"
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold text-sm
                    hover:bg-orange-50 transition-all shadow-xl shadow-orange-700/20 hover:shadow-orange-700/30
                    hover:-translate-y-0.5 active:translate-y-0">
                  <BookIcon className="w-4.5 h-4.5" />
                  Browse Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {about.contact_email && (
                  <a href={`mailto:${about.contact_email}`}
                    className="inline-flex items-center gap-2 px-7 py-4 bg-white/15 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold text-sm hover:bg-white/20 transition-all">
                    <Mail className="w-4 h-4" /> Contact Us
                  </a>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}