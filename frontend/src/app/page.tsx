'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book } from '@/types';
import BookCard from '@/components/BookCard';
import { ArrowRight, BookOpen, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { api, ApiBook, mapApiBookToBook, ApiCategory } from '@/lib/api';
import { useWishlist } from '@/context/WishlistContext';

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { checkWishlist } = useWishlist();

  useEffect(() => {
    Promise.all([
      api.get<{ data: ApiBook[] }>('/books', { featured: 'true' }),
      api.get<{ data: ApiBook[] }>('/books', { sort: 'newest' }),
      api.get<ApiCategory[]>('/categories'),
    ])
      .then(([featuredRes, allRes, catRes]) => {
        const featured = (featuredRes.data || []).map(mapApiBookToBook);
        const newArr = (allRes.data || []).slice(0, 4).map(mapApiBookToBook);
        setFeaturedBooks(featured);
        setNewArrivals(newArr);
        setCategories(catRes || []);
        
        const allBookIds = [...featured, ...newArr].map(b => b.id);
        if (allBookIds.length > 0) {
          checkWishlist(allBookIds);
        }
      })
      .catch((err) => {
        console.error('Failed to load homepage data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Seamless ticker: continuously scroll featured book cards leftwards.
  const router = useRouter();

  function SeamlessTicker({ books, speed = 40 }: { books: Book[]; speed?: number }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);

    // Interaction refs
    const isDraggingRef = useRef(false);
    const pointerIdRef = useRef<number | null>(null);
    const startXRef = useRef(0);
    const startYRef = useRef(0);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);
    const velocityRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track || books.length === 0) return;

      let width = track.scrollWidth / 2;
      let x = 0;
      let last = performance.now();
      lastTimeRef.current = last;

      const step = (now: number) => {
        const dt = now - last;
        last = now;

        if (!isDraggingRef.current) {
          // Auto-scroll when not dragging
          x -= (speed * dt) / 1000;
          // Apply small velocity momentum after drag ends (velocity measured in px/frame)
          if (Math.abs(velocityRef.current) > 0.5) {
            x += velocityRef.current * (dt / 16);
            velocityRef.current *= 0.92; // stronger decay for stability
          } else {
            velocityRef.current = 0;
          }
        }

        // wrap-around logic for duplicated track
        if (x <= -width) x += width;
        if (x >= 0) x -= width;

        track.style.transform = `translateX(${x}px)`;
        rafRef.current = requestAnimationFrame(step);
      };

      const onResize = () => {
        width = track.scrollWidth / 2;
      };

      const onPointerDown = (e: PointerEvent) => {
        isDraggingRef.current = true;
        pointerIdRef.current = e.pointerId;
        startXRef.current = e.clientX;
        startYRef.current = e.clientY;
        lastXRef.current = e.clientX;
        lastTimeRef.current = performance.now();
        velocityRef.current = 0;
        try {
          (container as Element).setPointerCapture(e.pointerId);
        } catch (err) {}
        // visual feedback
        track.style.cursor = 'grabbing';
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDraggingRef.current || pointerIdRef.current !== e.pointerId) return;
        const nowMove = performance.now();
        const dtMove = Math.max(1, nowMove - lastTimeRef.current);
        const dx = e.clientX - lastXRef.current;
        lastXRef.current = e.clientX;
        lastTimeRef.current = nowMove;
        // move track by dx
        x += dx;
        // velocity in px/frame approximation
        const v = (dx / dtMove) * 16;
        // clamp velocity to avoid instability
        velocityRef.current = Math.max(-300, Math.min(300, v));
      };

      const onPointerUp = (e: PointerEvent) => {
        if (pointerIdRef.current !== e.pointerId) return;
        // detect tap (small movement & short time)
        const dxTotal = Math.abs(e.clientX - startXRef.current);
        const dyTotal = Math.abs(e.clientY - startYRef.current);
        const timeElapsed = performance.now() - lastTimeRef.current;

        isDraggingRef.current = false;
        pointerIdRef.current = null;
        try {
          (container as Element).releasePointerCapture(e.pointerId);
        } catch (err) {}
        track.style.cursor = 'grab';

        // consider it a click/tap if movement small
        if (dxTotal < 6 && dyTotal < 6 && timeElapsed < 500) {
          const el = document.elementFromPoint(e.clientX, e.clientY) as Element | null;
          const anchor = el?.closest && el.closest('a');
          if (anchor) {
            const href = anchor.getAttribute('href');
            if (href && href.startsWith('/book')) {
              // use next/navigation router for SPA nav
              router.push(href);
            } else if (anchor instanceof HTMLAnchorElement && anchor.href) {
              window.location.href = anchor.href;
            }
            return;
          }
        }

        // momentum will be applied by RAF loop
      };

      window.addEventListener('resize', onResize);
      // attach pointer listeners to container so capture works consistently
      container.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);

      rafRef.current = requestAnimationFrame(step);

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        window.removeEventListener('resize', onResize);
        container.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };
    }, [books, speed]);

    if (!books || books.length === 0) return <div className="h-80 grid place-items-center">No featured books</div>;

    return (
      <div ref={containerRef} className="overflow-hidden" style={{ touchAction: 'pan-y', userSelect: 'none' }}>
        <div ref={trackRef} className="flex items-center gap-6 will-change-transform" style={{ transform: 'translateX(0)', cursor: 'grab' }}>
          {books.concat(books).map((b, i) => (
            <div key={`${b.id}-${i}`} className="flex-shrink-0 w-56">
              <BookCard book={b} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Category ticker: similar seamless ticker for categories
  function CategoryTicker({ cats, speed = 30 }: { cats: ApiCategory[]; speed?: number }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const isDraggingRef = useRef(false);
    const pointerIdRef = useRef<number | null>(null);
    const startXRef = useRef(0);
    const lastXRef = useRef(0);
    const lastTimeRef = useRef(0);
    const velocityRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track || !cats || cats.length === 0) return;

      let width = track.scrollWidth / 2;
      let x = 0;
      let last = performance.now();

      const step = (now: number) => {
        const dt = now - last;
        last = now;

        if (!isDraggingRef.current) {
          x -= (speed * dt) / 1000;
          if (Math.abs(velocityRef.current) > 0.5) {
            x += velocityRef.current * (dt / 16);
            velocityRef.current *= 0.92;
          } else {
            velocityRef.current = 0;
          }
        }

        if (x <= -width) x += width;
        if (x >= 0) x -= width;

        track.style.transform = `translateX(${x}px)`;
        rafRef.current = requestAnimationFrame(step);
      };

      const onResize = () => {
        width = track.scrollWidth / 2;
      };

      const onPointerDown = (e: PointerEvent) => {
        isDraggingRef.current = true;
        pointerIdRef.current = e.pointerId;
        startXRef.current = e.clientX;
        lastXRef.current = e.clientX;
        lastTimeRef.current = performance.now();
        velocityRef.current = 0;
        try { container.setPointerCapture(e.pointerId); } catch (err) {}
        track.style.cursor = 'grabbing';
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDraggingRef.current || pointerIdRef.current !== e.pointerId) return;
        const nowMove = performance.now();
        const dtMove = Math.max(1, nowMove - lastTimeRef.current);
        const dx = e.clientX - lastXRef.current;
        lastXRef.current = e.clientX;
        lastTimeRef.current = nowMove;
        x += dx;
        const v = (dx / dtMove) * 16;
        velocityRef.current = Math.max(-300, Math.min(300, v));
      };

      const onPointerUp = (e: PointerEvent) => {
        if (pointerIdRef.current !== e.pointerId) return;
        isDraggingRef.current = false;
        pointerIdRef.current = null;
        try { container.releasePointerCapture(e.pointerId); } catch (err) {}
        track.style.cursor = 'grab';
      };

      window.addEventListener('resize', onResize);
      container.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);

      rafRef.current = requestAnimationFrame(step);

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        window.removeEventListener('resize', onResize);
        container.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };
    }, [cats, speed]);

    if (!cats || cats.length === 0) return <div className="h-40 grid place-items-center">No categories</div>;

    return (
      <div ref={containerRef} className="overflow-hidden" style={{ touchAction: 'pan-y', userSelect: 'none' }}>
        <div ref={trackRef} className="flex items-center gap-6 will-change-transform" style={{ transform: 'translateX(0)', cursor: 'grab' }}>
          {cats.concat(cats).map((c, i) => (
            <Link key={`${c.id}-${i}`} href={`/shop?category=${encodeURIComponent(c.name)}`} className="flex-shrink-0 w-48 p-6 rounded-2xl bg-blue-50 text-blue-600 hover:scale-105 transition-transform text-center shadow-sm">
              <div className="text-3xl mb-2">📖</div>
              <div className="font-bold">{c.name}</div>
              <div className="text-xs text-gray-500 mt-1">{c.books_count || 0} Books</div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-20">
      <section className="relative overflow-hidden rounded-3xl bg-gray-900 text-white p-8 md:p-16 lg:p-24">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-orange-500/20 to-transparent"></div>
          <img src="https://picsum.photos/seed/library/800/1200" className="w-full h-full object-cover" alt="" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-orange-400 mb-6"
          >
            <Sparkles className="w-3 h-3" />
            <span>Curated with Love</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-8"
          >
            Discover Your Next <span className="text-orange-500 italic">Masterpiece</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg"
          >
            Explore our hand-picked collection of literary gems, from timeless classics to contemporary breakthroughs.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/shop" className="px-8 py-4 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-600/20">
              Browse Collection
            </Link>
            <Link href="/auth" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-bold hover:bg-white/20 transition-all border border-white/10">
              Join Community
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: BookOpen, title: 'Curated Selection', desc: 'Every book is hand-picked by our literary experts.' },
          { icon: Truck, title: 'Fast Delivery', desc: 'Free worldwide shipping on orders over $50.' },
          { icon: ShieldCheck, title: 'Secure Shopping', desc: 'Your data is protected with enterprise-grade security.' },
        ].map((feature, i) => (
          <div key={i} className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-orange-100 transition-all">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-6">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Featured Books</h2>
            <p className="text-gray-500">Our editors' top picks for this month.</p>
          </div>
          <Link href="/shop" className="group flex items-center gap-2 text-sm font-bold text-orange-600 uppercase tracking-widest">
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Auto-sliding featured carousel (SeamlessTicker) */}
        <div className="relative">
          <SeamlessTicker books={featuredBooks} />
        </div>
      </section>

      <section className="bg-white rounded-3xl p-12 border border-gray-100">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Explore Categories</h2>
          <p className="text-gray-500">Find your favorite genre and dive into a new world.</p>
        </div>
        <div>
          <CategoryTicker cats={categories} />
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">New Arrivals</h2>
            <p className="text-gray-500">Freshly added to our shelves.</p>
          </div>
          <Link href="/shop" className="group flex items-center gap-2 text-sm font-bold text-orange-600 uppercase tracking-widest">
            <span>Explore New</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div>
          <SeamlessTicker books={newArrivals.slice(0, 10)} speed={50} />
        </div>
      </section>
    </div>
  );
}
