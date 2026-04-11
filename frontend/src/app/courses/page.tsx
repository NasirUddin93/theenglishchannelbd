'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Clock, BookOpen, Star, Filter, GraduationCap } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  slug: string;
  instructor: string;
  description: string;
  syllabus: string | null;
  price: string;
  duration_hours: number;
  lessons_count: number;
  level: string;
  image: string | null;
  is_featured: boolean;
  is_active: boolean;
  category: string;
  created_at: string;
  updated_at: string;
  average_rating?: number;
  reviews_count?: number;
  enrolled_count?: number;
}

interface CoursesResponse {
  data: Course[];
  current_page: number;
  last_page: number;
  total: number;
}

const levelColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

const categoryLabels: Record<string, string> = {
  writing: 'Writing',
  literature: 'Literature',
  language: 'Language',
  general: 'General',
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState<{ name: string; slug: string; count: number }[]>([]);
  const [levels, setLevels] = useState<{ id: number; name: string; slug: string }[]>([]);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
    fetchLevels();
  }, [selectedCategory, selectedLevel, search, sortBy]);

  const fetchLevels = async () => {
    try {
      const res = await fetch('/api/courses/levels');
      if (res.ok) {
        const data = await res.json();
        setLevels(data);
      }
    } catch (error) {
      console.error('Failed to fetch levels:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/courses/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedLevel !== 'all') params.level = selectedLevel;
      if (search) params.search = search;
      if (sortBy !== 'newest') params.sort = sortBy;

      const res = await fetch(`/api/courses?${new URLSearchParams(params)}`);
      if (res.ok) {
        const data: CoursesResponse = await res.json();
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Our Courses</h1>
          </div>
          <p className="text-lg text-orange-100 max-w-2xl">
            Expand your knowledge with expert-led courses in writing, literature, and language mastery.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-9 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Levels</option>
                {levels.map(level => (
                  <option key={level.id} value={level.slug}>{level.name}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="flex justify-between pt-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                    <div className="h-8 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {courses.map((course) => (
               <Link
                 key={course.id}
                 href={course.slug ? `/courses/${course.slug}` : '#'}
                 className="block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
               >
                 <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-50 relative flex items-center justify-center overflow-hidden">
                   {course.image ? (
                     <img 
                       src={course.image} 
                       alt={course.title} 
                       className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                       onError={(e) => {
                         (e.target as HTMLImageElement).style.display = 'none';
                         (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                       }}
                     />
                   ) : null}
                   <BookOpen className={`w-16 h-16 text-orange-300 group-hover:text-orange-400 transition-colors absolute ${course.image ? 'fallback-icon hidden' : ''}`} />
                   {course.is_featured && (
                     <div className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                       <Star className="w-3 h-3 fill-current" />
                       Featured
                     </div>
                   )}
                 </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelColors[course.level] || 'bg-gray-100 text-gray-700'}`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {categoryLabels[course.category] || course.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration_hours}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.lessons_count} lessons</span>
                    </div>
                  </div>

                  {/* Rating and Enrollment Stats */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= Math.round(course.average_rating || 0)
                                ? 'fill-orange-500 text-orange-500'
                                : 'fill-gray-300 text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {(course.average_rating || 0).toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({course.reviews_count || 0} review{(course.reviews_count || 0) !== 1 ? 's' : ''})
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      {(course.enrolled_count || 0) > 0 ? (
                        <span className="font-semibold text-blue-600">{course.enrolled_count} student{(course.enrolled_count || 0) !== 1 ? 's' : ''} enrolled</span>
                      ) : (
                        <span className="font-medium text-green-600">Be the first to enroll!</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Instructor</p>
                      <p className="text-sm font-medium text-gray-900">{course.instructor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">৳{course.price}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
