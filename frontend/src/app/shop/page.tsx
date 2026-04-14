'use client';

import { useState, useEffect, Suspense, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { Book } from '@/types';
import BookCard from '@/components/BookCard';
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  X,
  SlidersHorizontal,
  BookOpen,
  ArrowUpDown,
  Sparkles,
  Check,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api, mapApiBookToBook, ApiCategory } from '@/lib/api';
import { useWishlist } from '@/context/WishlistContext';
import { AnimatePresence, motion } from 'motion/react';

function PremiumSurface({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 backdrop-blur-2xl shadow-[0_24px_80px_-24px_rgba(249,115,22,0.14)]',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.07),transparent_35%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function HeroStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}

function FilterBlock({
  title,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-[0_16px_50px_-30px_rgba(249,115,22,0.14)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-50 text-orange-600">
            <Icon className="h-4 w-4" />
          </span>
          <h4 className="text-sm font-bold uppercase tracking-[0.22em] text-gray-900">
            {title}
          </h4>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function FiltersPanel({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategoryIds,
  toggleCategory,
  priceRange,
  setPriceRange,
  priceMax,
  activeFilterCount,
  clearAllFilters,
  onClose,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  categories: ApiCategory[];
  selectedCategoryIds: number[];
  toggleCategory: (catId: number) => void;
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  priceMax: number;
  activeFilterCount: number;
  clearAllFilters: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange-500/70">
            Refine
          </p>
          <h3 className="mt-1 text-lg font-bold text-gray-900">Filters</h3>
          <p className="mt-1 text-sm text-gray-500">
            Search, narrow, and perfect your catalog view.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-600 transition-colors hover:bg-orange-100"
            >
              Reset
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
              aria-label="Close filters"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-orange-500" />
          <input
            type="text"
            placeholder="Search title, author, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-gray-200/80 bg-white px-12 py-3.5 text-sm text-gray-900 placeholder-gray-400 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/15"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400">
          Search by title, author, or any keyword you remember.
        </p>
      </div>

      <FilterBlock
        title="Categories"
        icon={Filter}
        action={
          selectedCategoryIds.length > 0 ? (
            <button
              onClick={() => {
                if (selectedCategoryIds.length > 0) {
                  clearAllFilters();
                }
              }}
              className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600 transition-colors hover:text-orange-700"
            >
              Clear
            </button>
          ) : null
        }
      >
        <div className="max-h-[320px] space-y-1 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const isActive = selectedCategoryIds.includes(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200',
                  isActive
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <span
                  className={cn(
                    'grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-all',
                    isActive
                      ? 'border-orange-600 bg-orange-600'
                      : 'border-gray-300 bg-white'
                  )}
                >
                  {isActive && <Check className="h-3 w-3 text-white" />}
                </span>
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </FilterBlock>

      <FilterBlock title="Price Range" icon={ArrowUpDown}>
        <div className="space-y-5">
          <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
            <div className="relative h-1.5 rounded-full bg-gray-100">
              <div
                className="absolute h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-150"
                style={{
                  left: `${(priceRange[0] / Math.max(1, priceMax)) * 100}%`,
                  right: `${100 - (priceRange[1] / Math.max(1, priceMax)) * 100}%`,
                }}
              />
              <input
                type="range"
                min={0}
                max={priceMax}
                value={priceRange[0]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val <= priceRange[1]) setPriceRange([val, priceRange[1]]);
                }}
                className="absolute h-1.5 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(249,115,22,0.3)]"
              />
              <input
                type="range"
                min={0}
                max={priceMax}
                value={priceRange[1]}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  if (val >= priceRange[0]) setPriceRange([priceRange[0], val]);
                }}
                className="absolute h-1.5 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(249,115,22,0.3)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                Min
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                  ৳
                </span>
                <input
                  type="number"
                  min={0}
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    if (val <= priceRange[1]) setPriceRange([val, priceRange[1]]);
                  }}
                  className="w-full rounded-2xl border border-gray-200/80 bg-white py-3 pl-7 pr-3 text-center text-sm font-semibold text-gray-800 outline-none transition-all focus:border-orange-300 focus:ring-2 focus:ring-orange-500/15"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                Max
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                  ৳
                </span>
                <input
                  type="number"
                  min={priceRange[0]}
                  max={priceMax}
                  value={priceRange[1]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    if (val >= priceRange[0] && val <= priceMax) {
                      setPriceRange([priceRange[0], val]);
                    }
                  }}
                  className="w-full rounded-2xl border border-gray-200/80 bg-white py-3 pl-7 pr-3 text-center text-sm font-semibold text-gray-800 outline-none transition-all focus:border-orange-300 focus:ring-2 focus:ring-orange-500/15"
                />
              </div>
            </div>
          </div>
        </div>
      </FilterBlock>
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [priceMax, setPriceMax] = useState<number>(100);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { checkWishlist } = useWishlist();

  const booksPerPage = viewMode === 'grid' ? 32 : 8;
  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    selectedCategoryIds.length +
    (priceRange[0] > 0 || priceRange[1] < priceMax ? 1 : 0);

  const selectedCategoryNames = categories
    .filter((c) => selectedCategoryIds.includes(c.id))
    .map((c) => c.name);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    api
      .get<ApiCategory[]>('/categories')
      .then((res) => {
        setCategories(res || []);
        const catParam = searchParams?.get('category');
        if (catParam) {
          const found = (res || []).find(
            (c) => c.name.toLowerCase() === catParam.toLowerCase()
          );
          if (found) setSelectedCategoryIds([found.id]);
        }
      })
      .catch(() => {});
  }, [searchParams]);

  useEffect(() => {
    if (viewMode === 'grid') setCurrentPage(1);
  }, [viewMode]);

  useEffect(() => {
    let alive = true;

    const fetchAllBooks = async () => {
      setLoading(true);

      const params: Record<string, string> = {
        per_page: '12',
        status: 'all',
        sort: 'newest',
      };

      if (debouncedSearch) params.search = debouncedSearch;

      try {
        const firstRes = await api.get<any>('/books', params);
        const allData = [...(firstRes.data || [])];
        const totalPages = firstRes.last_page || 1;
        const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);

        const pageResults = await Promise.allSettled(
          remainingPages.map((page) =>
            api.get<any>('/books', {
              ...params,
              page: String(page),
            })
          )
        );

        pageResults.forEach((result) => {
          if (result.status === 'fulfilled' && result.value?.data) {
            allData.push(...result.value.data);
          }
        });

        if (!alive) return;

        let fetchedBooks = allData.map(mapApiBookToBook);

        if (sortBy === 'price_asc') {
          fetchedBooks = [...fetchedBooks].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
          fetchedBooks = [...fetchedBooks].sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name') {
          fetchedBooks = [...fetchedBooks].sort((a, b) =>
            a.title.localeCompare(b.title)
          );
        }

        setAllBooks(fetchedBooks);

        const bookIds = fetchedBooks.map((b) => b.id);
        checkWishlist(bookIds);

        if (fetchedBooks.length > 0) {
          const prices = fetchedBooks.map((b) => b.price || 0);
          const rawMax = Math.max(...prices, 100);
          const niceMax = (() => {
            if (rawMax <= 20) return Math.ceil(rawMax / 5) * 5;
            if (rawMax <= 100) return Math.ceil(rawMax / 10) * 10;
            if (rawMax <= 500) return Math.ceil(rawMax / 50) * 50;
            if (rawMax <= 2000) return Math.ceil(rawMax / 100) * 100;
            return Math.ceil(rawMax / 500) * 500;
          })();

          const finalMax = Math.max(10000, niceMax);
          setPriceMax(finalMax);

          setPriceRange((prev) => {
            if (prev[0] === 0 && prev[1] === priceMax) return [0, finalMax];
            return [Math.min(prev[0], finalMax), Math.min(prev[1], finalMax)];
          });
        }
      } catch {
        if (!alive) return;
        setAllBooks([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchAllBooks();

    return () => {
      alive = false;
    };
  }, [debouncedSearch]); // intentionally fetch by search only; sorting is handled locally

  useEffect(() => {
    let filtered = [...allBooks];

    if (selectedCategoryIds.length > 0) {
      const categoryNames = categories
        .filter((c) => selectedCategoryIds.includes(c.id))
        .map((c) => c.name);
      filtered = filtered.filter((b) => categoryNames.includes(b.category));
    }

    filtered = filtered.filter(
      (b) => b.price >= priceRange[0] && b.price <= priceRange[1]
    );

    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setBooks(filtered);
    setCurrentPage(1);
  }, [priceRange, allBooks, selectedCategoryIds, categories, sortBy]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setMobileFiltersOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileFiltersOpen(false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFiltersOpen]);

  const toggleCategory = (catId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategoryIds([]);
    setPriceRange([0, priceMax]);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(books.length / booksPerPage));
  const paginatedBooks = books.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const isInitialLoading = loading && allBooks.length === 0;
  const isRefreshing = loading && allBooks.length > 0;

  if (isInitialLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-white via-orange-50/35 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-[3px] border-orange-100" />
            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-[3px] border-orange-600 border-t-transparent" />
          </div>
          <p className="text-sm font-semibold text-gray-500">
            Loading premium catalog...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/35 to-white">
      <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-8 md:px-6 lg:px-8">
        {/* Hero */}
        <PremiumSurface className="p-6 md:p-8 lg:p-10">
          <div className="absolute right-0 top-0 h-72 w-72 -translate-y-1/2 translate-x-1/2 rounded-full bg-orange-100/60 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-56 w-56 -translate-x-1/2 translate-y-1/2 rounded-full bg-orange-50/80 blur-3xl" />
          <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] text-orange-600">
                <Sparkles className="h-3.5 w-3.5" />
                Premium Book Discovery
              </div>

              <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
                Browse Collection
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500 md:text-lg">
                Discover your next favorite read from our curated library of exceptional books,
                presented with a refined premium browsing experience.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <HeroStat label="Total Titles" value={allBooks.length} />
              <HeroStat label="Active Filters" value={activeFilterCount} />
              <HeroStat label="Visible Books" value={books.length} />
            </div>
          </div>
        </PremiumSurface>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="hidden self-start lg:sticky lg:top-6 lg:col-span-3 lg:block lg:h-[calc(100vh-3rem)] lg:overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <PremiumSurface className="p-3">
              <FiltersPanel
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                categories={categories}
                selectedCategoryIds={selectedCategoryIds}
                toggleCategory={toggleCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                priceMax={priceMax}
                activeFilterCount={activeFilterCount}
                clearAllFilters={clearAllFilters}
              />
            </PremiumSurface>
          </aside>

          {/* Main */}
          <main className="lg:col-span-9">
            <PremiumSurface className="p-5 md:p-6 lg:p-8">
              <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-orange-500/70">
                      Catalog
                    </p>
                    <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-gray-900">
                      Curated Books
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {loading
                        ? 'Refreshing catalog...'
                        : `${books.length} curated result${
                            books.length === 1 ? '' : 's'
                          } · ${allBooks.length} total titles`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex rounded-2xl border border-white/80 bg-white/75 p-1 shadow-sm">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        'rounded-xl p-2.5 transition-all duration-300',
                        viewMode === 'grid'
                          ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                      )}
                      aria-label="Grid view"
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        'rounded-xl p-2.5 transition-all duration-300',
                        viewMode === 'list'
                          ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                      )}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none rounded-2xl border border-white/80 bg-white/75 py-3 pl-4 pr-11 text-sm font-medium text-gray-900 shadow-sm outline-none transition-all focus:border-orange-300 focus:ring-2 focus:ring-orange-500/15"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="name">Name: A-Z</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>

                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(17,24,39,0.35)] transition-all hover:bg-orange-600"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-1 grid h-5 w-5 place-items-center rounded-full bg-orange-600 text-[10px] font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Active filters */}
              {activeFilterCount > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-2 rounded-3xl border border-white/70 bg-white/60 p-4">
                  {searchQuery.trim() && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="inline-flex max-w-[220px] items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-100"
                    >
                      <span className="truncate">“{searchQuery}”</span>
                      <X className="h-3 w-3 shrink-0" />
                    </button>
                  )}

                  {selectedCategoryIds.map((catId) => {
                    const cat = categories.find((c) => c.id === catId);
                    if (!cat) return null;

                    return (
                      <button
                        key={catId}
                        onClick={() => toggleCategory(catId)}
                        className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 transition-colors hover:bg-orange-100"
                      >
                        <span className="max-w-[160px] truncate">{cat.name}</span>
                        <X className="h-3 w-3 shrink-0" />
                      </button>
                    );
                  })}

                  <button
                    onClick={clearAllFilters}
                    className="ml-auto text-xs font-bold uppercase tracking-[0.18em] text-gray-500 transition-colors hover:text-orange-600"
                  >
                    Clear all
                  </button>
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${viewMode}-${sortBy}-${books.length}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className={cn(
                    'transition-opacity duration-300',
                    isRefreshing ? 'opacity-75' : 'opacity-100'
                  )}
                >
                  {loading && allBooks.length > 0 && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-3 text-sm font-medium text-orange-700">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
                      Updating results...
                    </div>
                  )}

                  {books.length > 0 ? (
                    <>
                      <div
                        className={cn(
                          'grid gap-6',
                          viewMode === 'grid'
                            ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                            : 'grid-cols-1'
                        )}
                      >
                        {paginatedBooks.map((book) => (
                          <BookCard key={book.id} book={book} viewMode={viewMode} />
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className="mt-14 flex flex-col items-center gap-4">
                          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/70 bg-white/75 p-2 shadow-sm">
                            <button
                              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="rounded-full px-5 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              Previous
                            </button>

                            <div className="flex items-center gap-1">
                              {Array.from({ length: totalPages }).map((_, i) => {
                                const page = i + 1;
                                const isCurrent = page === currentPage;
                                const shouldShow =
                                  page === 1 ||
                                  page === totalPages ||
                                  (page >= currentPage - 1 && page <= currentPage + 1);
                                const isGap = page === 2 && currentPage > 3;
                                const isEndGap =
                                  page === totalPages - 1 &&
                                  currentPage < totalPages - 2;

                                if (isGap || isEndGap) {
                                  return (
                                    <span
                                      key={page}
                                      className="w-10 text-center text-sm text-gray-300"
                                    >
                                      •••
                                    </span>
                                  );
                                }

                                if (!shouldShow) return null;

                                return (
                                  <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={cn(
                                      'grid h-10 w-10 place-items-center rounded-full text-sm font-semibold transition-all',
                                      isCurrent
                                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 scale-105'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    )}
                                  >
                                    {page}
                                  </button>
                                );
                              })}
                            </div>

                            <button
                              onClick={() =>
                                setCurrentPage((p) => Math.min(totalPages, p + 1))
                              }
                              disabled={currentPage === totalPages}
                              className="rounded-full px-5 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              Next
                            </button>
                          </div>

                          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                            Page {currentPage} of {totalPages} · Showing{' '}
                            {Math.min((currentPage - 1) * booksPerPage + 1, books.length)}–
                            {Math.min(currentPage * booksPerPage, books.length)} of {books.length}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-orange-200 bg-white/70 py-24 text-center shadow-[0_18px_50px_-30px_rgba(249,115,22,0.18)]">
                      <div className="mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-orange-50 text-orange-500">
                        <Search className="h-8 w-8" />
                      </div>

                      <h3 className="text-xl font-bold text-gray-900">
                        {allBooks.length > 0
                          ? 'No books match your filters'
                          : 'No books available'}
                      </h3>

                      <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
                        {allBooks.length > 0
                          ? 'Try widening your price range, changing categories, or clearing the search.'
                          : 'The catalog is currently empty right now. Please check back again soon.'}
                      </p>

                      <button
                        onClick={clearAllFilters}
                        className="mt-8 inline-flex items-center justify-center rounded-2xl bg-orange-600 px-8 py-4 font-bold text-white transition-all hover:bg-orange-700 hover:shadow-[0_18px_40px_-18px_rgba(234,88,12,0.45)]"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </PremiumSurface>
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-white/70 bg-gradient-to-b from-white to-orange-50/40 p-5 shadow-2xl lg:hidden"
            >
              <PremiumSurface className="p-5">
                <FiltersPanel
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  categories={categories}
                  selectedCategoryIds={selectedCategoryIds}
                  toggleCategory={toggleCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  priceMax={priceMax}
                  activeFilterCount={activeFilterCount}
                  clearAllFilters={clearAllFilters}
                  onClose={() => setMobileFiltersOpen(false)}
                />
              </PremiumSurface>

              <div className="sticky bottom-0 mt-5 border-t border-white/70 bg-gradient-to-t from-white via-white to-transparent pt-4">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full rounded-2xl bg-orange-600 px-5 py-4 font-bold text-white shadow-[0_18px_40px_-18px_rgba(234,88,12,0.45)] transition-all hover:bg-orange-700"
                >
                  Done
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-white via-orange-50/35 to-white">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-[3px] border-orange-100" />
            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-[3px] border-orange-600 border-t-transparent" />
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}