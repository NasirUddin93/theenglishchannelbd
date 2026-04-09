'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { Images, X, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';

interface GalleryPhoto {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  order: number;
  created_at: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await api.get<{ data: GalleryPhoto[] }>('/gallery');
      const apiPhotos = res.data || [];
      
      // If no photos uploaded, generate 25 placeholders
      if (apiPhotos.length === 0) {
        const placeholders: GalleryPhoto[] = Array.from({ length: 25 }, (_, i) => ({
          id: i + 1,
          title: `Photo ${i + 1}`,
          description: `This is a placeholder for Photo ${i + 1}. Upload photos from the staff gallery to replace this placeholder with your actual content.`,
          image: null,
          order: i,
          created_at: new Date(Date.now() - i * 86400000).toISOString(),
        }));
        setPhotos(placeholders);
      } else {
        setPhotos(apiPhotos);
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold mb-6">
              <Images className="w-4 h-4" />
              <span>Our Collection</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Gallery & <span className="italic text-orange-200">Memories</span>
            </h1>
            <p className="text-lg text-orange-100 max-w-2xl mx-auto leading-relaxed">
              Explore our curated collection of moments, milestones, and stories from The English Channel BD.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Premium Bento Grid Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Images className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-3">Gallery Coming Soon</h3>
            <p className="text-gray-500">We're curating amazing content for you!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
            {photos.map((photo, index) => {
              // Determine layout pattern based on index
              const layoutPattern = getLayoutPattern(index, photos.length);
              
              return (
                <GalleryCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  layout={layoutPattern}
                  onClick={() => setSelectedPhoto(photo)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <Lightbox
            photo={selectedPhoto}
            allPhotos={photos}
            onClose={() => setSelectedPhoto(null)}
            onNavigate={(direction) => {
              const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
              const newIndex = direction === 'next'
                ? (currentIndex + 1) % photos.length
                : (currentIndex - 1 + photos.length) % photos.length;
              setSelectedPhoto(photos[newIndex]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Layout pattern generator for bento grid
function getLayoutPattern(index: number, total: number): 'small' | 'big' | 'portrait' | 'landscape' | 'left' | 'right' {
  // Pattern for varied sizes: repeats every 8 items
  const patterns: Array<'small' | 'big' | 'portrait' | 'landscape' | 'left' | 'right'> = [
    'big',       // 2x2
    'small',     // 1x1
    'portrait',  // 1x2
    'landscape', // 2x1
    'left',      // 2x1 left
    'right',     // 2x1 right
    'small',     // 1x1
    'portrait',  // 1x2
  ];
  
  return patterns[index % patterns.length];
}

function GalleryCard({ photo, index, layout, onClick }: { 
  photo: GalleryPhoto; 
  index: number; 
  layout: 'small' | 'big' | 'portrait' | 'landscape' | 'left' | 'right';
  onClick: () => void;
}) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [imageError, setImageError] = useState(false);

  // Grid span classes based on layout
  const gridClasses = {
    small: 'col-span-1 row-span-1',
    big: 'col-span-2 row-span-2',
    portrait: 'col-span-1 row-span-2',
    landscape: 'col-span-2 row-span-1',
    left: 'col-span-2 row-span-1',
    right: 'col-span-2 row-span-1',
  };

  const hasValidImage = photo.image && !imageError;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer ${gridClasses[layout]}`}
      onClick={onClick}
    >
      {/* Number Badge */}
      <div className="absolute top-4 left-4 z-10 w-10 h-10 bg-gradient-to-br from-orange-600 to-amber-500 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg">
        {index + 1}
      </div>

      {/* Image */}
      {hasValidImage ? (
        <img
          src={photo.image!}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-orange-100 via-amber-50 to-orange-100 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, #f97316 2px, transparent 2px)',
              backgroundSize: '30px 30px'
            }} />
          </div>
          
          {/* Photo Number */}
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-xl mb-3 mx-auto">
              {index + 1}
            </div>
            <div className="text-sm font-bold text-orange-600 uppercase tracking-wider">Photo {index + 1}</div>
            <div className="text-xs text-orange-400 mt-1">Upload to replace</div>
          </div>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content on Hover */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{photo.title}</h3>
        {photo.description && (
          <p className="text-sm text-gray-300 line-clamp-2 mb-3">{photo.description}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>{new Date(photo.created_at).toLocaleDateString()}</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-bold">
          <span>View Details</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}

function Lightbox({ photo, allPhotos, onClose, onNavigate }: {
  photo: GalleryPhoto;
  allPhotos: GalleryPhoto[];
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
}) {
  const currentIndex = allPhotos.findIndex(p => p.id === photo.id);
  const [imageError, setImageError] = useState(false);
  const hasValidImage = photo.image && !imageError;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-7xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Navigation Buttons */}
        <button
          onClick={() => onNavigate('prev')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => onNavigate('next')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/70 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Split Layout: Photo Left, Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-[90vh]">
          {/* Left: Photo */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center min-h-[300px] lg:min-h-full">
            {hasValidImage ? (
              <img
                src={photo.image!}
                alt={photo.title}
                className="w-full h-full object-contain max-h-[90vh]"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 25% 25%, #f97316 3px, transparent 3px)',
                    backgroundSize: '40px 40px'
                  }} />
                </div>
                
                {/* Photo Number */}
                <div className="relative z-10 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-black text-5xl shadow-2xl mb-6 mx-auto">
                    {currentIndex + 1}
                  </div>
                  <div className="text-2xl font-bold text-orange-400 uppercase tracking-wider mb-2">Photo {currentIndex + 1}</div>
                  <div className="text-sm text-gray-400">Not yet uploaded</div>
                </div>
              </div>
            )}
            
            {/* Photo Counter */}
            <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full text-white text-sm font-bold">
              {currentIndex + 1} / {allPhotos.length}
            </div>
          </div>

          {/* Right: Title & Description */}
          <div className="p-8 lg:p-12 overflow-y-auto bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
                {currentIndex + 1}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date(photo.created_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              {photo.title}
            </h2>

            {photo.description ? (
              <div className="prose prose-lg max-w-none">
                <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-orange-500">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{photo.description}</p>
                </div>
              </div>
            ) : (
              <div className="bg-orange-50 rounded-2xl p-6 border-l-4 border-orange-500">
                <p className="text-gray-600 italic">No description provided for this photo.</p>
              </div>
            )}

            {/* Navigation Hint */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span>Use arrows to navigate</span>
                <ChevronRight className="w-4 h-4" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
