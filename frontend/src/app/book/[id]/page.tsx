'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Book } from '@/types';
import { Star, ShoppingCart, BookOpen, MessageSquare, HelpCircle, ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Heart, Send, Shield, Truck, Award, Sparkles, Quote, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { api, ApiBook, mapApiBookToBook } from '@/lib/api';
import { toast } from 'sonner';

interface ApiReview {
  id: number;
  book_id: number;
  user_id: number | null;
  user_name: string;
  user_email: string | null;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

interface ApiQuestion {
  id: number;
  book_id: number;
  user_id: number | null;
  user_name: string;
  user_email: string | null;
  question: string;
  answer: string | null;
  is_answered: boolean;
  is_approved: boolean;
  created_at: string;
}

export default function BookDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const router = useRouter();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist: toggleWishlistFromContext } = useWishlist();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'preview' | 'reviews' | 'qanda'>('details');
  const [previewPage, setPreviewPage] = useState(0);

  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [guestReviewName, setGuestReviewName] = useState('');
  const [guestReviewEmail, setGuestReviewEmail] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [guestQuestionName, setGuestQuestionName] = useState('');
  const [guestQuestionEmail, setGuestQuestionEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [hasPurchased, setHasPurchased] = useState(false);
  const [userReview, setUserReview] = useState<ApiReview | null>(null);
  const [editingReview, setEditingReview] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      api.get<ApiBook>(`/books/${id}`),
      api.get<{ reviews: ApiReview[]; average_rating: number; total: number }>(`/books/${id}/reviews`),
      api.get<{ questions: ApiQuestion[]; total: number }>(`/books/${id}/questions`),
    ])
      .then(([bookRes, reviewsRes, questionsRes]) => {
        setBook(mapApiBookToBook(bookRes));
        setReviews(reviewsRes.reviews || []);
        setAverageRating(reviewsRes.average_rating || 0);
        setQuestions(questionsRes.questions || []);
      })
      .catch((err) => {
        console.error('Book detail error:', err);
        setBook(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;

    const orders = JSON.parse(localStorage.getItem('lumina_orders') || '[]');
    const purchased = orders.some((order: any) =>
      order.status === 'delivered' &&
      order.items.some((item: any) => String(item.bookId) === String(id))
    );
    setHasPurchased(purchased);

    const myReview = reviews.find(r =>
      r.user_email === user.email ||
      (user && r.user_name === user.displayName)
    );
    if (myReview) {
      setUserReview(myReview);
      setNewReview({ rating: myReview.rating, comment: myReview.comment });
    }
  }, [user, id, reviews]);

  const handleAddToCart = () => {
    if (book) {
      addToCart(book);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      router.push('/auth');
      return;
    }
    if (!id) return;

    setWishlistLoading(true);
    try {
      const added = await toggleWishlistFromContext(id);
      toast.success(added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || submitting) return;

    const name = user ? user.displayName : guestReviewName.trim();
    if (!name) {
      toast.error('Please enter your name');
      return;
    }

    if (!hasPurchased && user) {
      toast.error('You can only review books you have received');
      return;
    }

    setSubmitting(true);

    try {
      if (userReview) {
        await api.put(`/books/${id}/reviews/${userReview.id}`, {
          user_name: name,
          user_email: user ? user.email : guestReviewEmail.trim() || undefined,
          rating: newReview.rating,
          comment: newReview.comment,
        });
        toast.success('Review updated successfully!');
      } else {
        await api.post(`/books/${id}/reviews`, {
          user_name: name,
          user_email: user ? user.email : guestReviewEmail.trim() || undefined,
          rating: newReview.rating,
          comment: newReview.comment,
        });
        toast.success('Review submitted!');
      }
      setNewReview({ rating: 5, comment: '' });
      setGuestReviewName('');
      setGuestReviewEmail('');
      setEditingReview(false);

      const res = await api.get<{ reviews: ApiReview[]; average_rating: number; total: number }>(`/books/${id}/reviews`);
      setReviews(res.reviews || []);
      setAverageRating(res.average_rating || 0);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || submitting) return;

    const name = user ? user.displayName : guestQuestionName.trim();
    if (!name) {
      toast.error('Please enter your name');
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/books/${id}/questions`, {
        user_name: name,
        user_email: user ? user.email : guestQuestionEmail.trim() || undefined,
        question: newQuestion,
      });
      toast.success('Question submitted!');
      setNewQuestion('');
      setGuestQuestionName('');
      setGuestQuestionEmail('');

      const res = await api.get<{ questions: ApiQuestion[]; total: number }>(`/books/${id}/questions`);
      setQuestions(res.questions || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit question');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="relative">
          <div className="w-16 h-16 border-[3px] border-orange-100 rounded-full animate-spin border-t-orange-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-orange-400" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-orange-300" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-gray-900">Book not found</h2>
        <p className="text-gray-400 text-sm">The book you're looking for doesn't exist or has been removed.</p>
        <Link href="/shop" className="px-6 py-3 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition-all">
          Browse Collection
        </Link>
      </div>
    );
  }

  const isStaff = user?.role === 'staff';
  const totalPreviewPages = (book.previewImages && book.previewImages.length) ? book.previewImages.length : book.previewContent.length;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    return { star, count, percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0 };
  });

  return (
    <div className="pb-24">
      {/* NavigationBreadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2.5 text-[13px] font-medium text-gray-400 hover:text-orange-600 transition-all duration-300 tracking-wide"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-orange-50 transition-colors duration-300">
            <ArrowLeft className="w-3.5 h-3.5" />
          </span>
          <span className="uppercase tracking-[0.15em]">Back to Collection</span>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Book Cover Column */}
        <motion.div
          className="lg:col-span-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="sticky top-28">
            {/* Cover Image */}
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-br from-orange-200/30 via-orange-100/20 to-transparent rounded-[2rem] blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.04)] bg-white">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg shadow-lg shadow-black/5">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-orange-600">{book.category}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {!isStaff && (
              <div className="mt-8 space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="group/btn w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl font-semibold text-[15px] hover:from-orange-700 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 hover:shadow-xl active:scale-[0.98]"
                >
                  <ShoppingCart className="w-[18px] h-[18px] group-hover/btn:scale-110 transition-transform" />
                  <span>Add to Cart</span>
                  <span className="ml-auto text-orange-200 text-sm font-medium">৳{book.price.toFixed(2)}</span>
                </button>
                <button
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                  className={cn(
                    "w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-300 active:scale-[0.98]",
                    isInWishlist(id)
                      ? "bg-red-50 text-red-500 border border-red-100 hover:bg-red-100/70"
                      : "bg-white text-gray-700 border border-gray-200/80 hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50/50"
                  )}
                >
                  <Heart className={cn("w-[18px] h-[18px] transition-all", isInWishlist(id) && "fill-current")} />
                  <span>{isInWishlist(id) ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>
            )}

            {/* Trust badges */}
            {!isStaff && (
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { icon: Shield, label: 'Secure' },
                  { icon: Truck, label: 'Fast Delivery' },
                  { icon: Award, label: 'Quality' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-gray-50/80">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Content Column */}
        <motion.div
          className="lg:col-span-8"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {/* Book Meta */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4 transition-colors",
                      i < Math.round(averageRating) ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200"
                    )}
                  />
                ))}
                <span className="text-sm font-semibold text-gray-500 ml-2">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-300 mx-1">·</span>
                <span className="text-sm text-gray-400">{reviews.length} reviews</span>
              </div>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-gray-900 leading-[1.1] mb-4 tracking-tight">
              {book.title}
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              by <span className="text-gray-700 font-medium">{book.author}</span>
            </p>
          </div>

          {/* Price & Stock Card */}
          <div className="flex items-stretch gap-0 mb-10 rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex-1 px-7 py-5 flex flex-col justify-center">
              <p className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-1.5">Price</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">৳{book.price.toFixed(2)}</p>
            </div>
            <div className="w-px bg-gray-50" />
            <div className="flex-1 px-7 py-5 flex flex-col justify-center">
              <p className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-1.5">Availability</p>
              <p className="flex items-center gap-2 text-[15px] font-semibold text-gray-700">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </span>
                {book.stock} in stock
              </p>
            </div>
            <div className="w-px bg-gray-50" />
            <div className="flex-1 px-7 py-5 flex flex-col justify-center">
              <p className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-1.5">Category</p>
              <p className="text-[15px] font-semibold text-orange-600">{book.category}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="relative mb-0">
            <div className="flex gap-0 border-b border-gray-100">
              {[
                { id: 'details', label: 'Details', icon: MessageSquare },
                { id: 'preview', label: 'Preview', icon: BookOpen },
                { id: 'reviews', label: 'Reviews', icon: Star },
                { id: 'qanda', label: 'Q&A', icon: HelpCircle },
              ].map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "relative flex items-center gap-2 px-5 py-3.5 text-[13px] font-semibold tracking-wide transition-all duration-300",
                    activeTab === tab.id
                      ? "text-orange-600"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <tab.icon className="w-[15px] h-[15px]" />
                  <span>{tab.label}</span>
                  {tab.id === 'reviews' && reviews.length > 0 && (
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-md text-[10px] font-bold",
                      activeTab === 'reviews' ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"
                    )}>
                      {reviews.length}
                    </span>
                  )}
                  {tab.id === 'qanda' && questions.length > 0 && (
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-md text-[10px] font-bold",
                      activeTab === 'qanda' ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"
                    )}>
                      {questions.length}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="premium-tab-indicator"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-[340px] pt-8"
            >
              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <p className="text-gray-500 leading-[1.85] text-[16px] max-w-3xl">
                    {book.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                    {[
                      { label: 'Format', value: 'Paperback' },
                      { label: 'Language', value: 'English' },
                      { label: 'Category', value: book.category },
                    ].map(({ label, value }) => (
                      <div key={label} className="px-5 py-4 rounded-xl bg-gray-50/70 border border-gray-100/60">
                        <p className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.15em] mb-1">{label}</p>
                        <p className="text-sm font-semibold text-gray-700">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Tab */}
              {activeTab === 'preview' && (
                <div className="space-y-6">
                  <div className="relative rounded-2xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
                    {/* Preview Header */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50">
                          <BookOpen className="w-4 h-4 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Free Preview</p>
                          <p className="text-[11px] text-gray-400">Page {previewPage + 1} of {totalPreviewPages}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={previewPage === 0}
                          onClick={() => setPreviewPage(p => p - 1)}
                          className="p-2.5 rounded-xl bg-gray-50 text-gray-400 disabled:opacity-25 hover:bg-orange-50 hover:text-orange-500 transition-all duration-200"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex gap-1 px-2">
                          {[...Array(totalPreviewPages)].map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setPreviewPage(i)}
                              className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                i === previewPage ? "bg-orange-500 w-4" : "bg-gray-200 hover:bg-gray-300"
                              )}
                            />
                          ))}
                        </div>
                        <button
                          disabled={previewPage === totalPreviewPages - 1}
                          onClick={() => setPreviewPage(p => p + 1)}
                          className="p-2.5 rounded-xl bg-gray-50 text-gray-400 disabled:opacity-25 hover:bg-orange-50 hover:text-orange-500 transition-all duration-200"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Preview Content */}
                    <div className="p-8 md:p-12 min-h-[300px] flex items-center justify-center">
                      {book.previewImages && book.previewImages.length > 0 ? (
                        <motion.img
                          key={previewPage}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          src={book.previewImages[previewPage]}
                          alt={`Preview page ${previewPage + 1}`}
                          className="max-w-full max-h-[55vh] object-contain rounded-lg shadow-md"
                        />
                      ) : (
                        <motion.div
                          key={previewPage}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="max-w-lg mx-auto"
                        >
                          <Quote className="w-8 h-8 text-orange-200 mb-4" />
                          <p className="font-serif text-xl md:text-2xl leading-[1.8] text-gray-600 italic">
                            {book.previewContent[previewPage]}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {!isStaff && (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-orange-50/80 to-amber-50/50 border border-orange-100/60 p-8">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/40 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                      <div className="relative flex items-center justify-between gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-orange-500" />
                            <p className="text-sm font-semibold text-orange-800">Enjoying the preview?</p>
                          </div>
                          <p className="text-[13px] text-orange-600/70">Get the full book and continue your reading journey.</p>
                        </div>
                        <button
                          onClick={handleAddToCart}
                          className="shrink-0 px-6 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition-all shadow-md shadow-orange-600/15 active:scale-[0.97]"
                        >
                          Get Full Book
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  {/* Rating Summary */}
                  {reviews.length > 0 && (
                    <div className="flex items-start gap-10 p-7 rounded-2xl bg-white border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                      <div className="text-center shrink-0">
                        <p className="text-5xl font-bold text-gray-900 tracking-tight">{averageRating.toFixed(1)}</p>
                        <div className="flex items-center gap-0.5 my-2 justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-4 h-4", i < Math.round(averageRating) ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200")} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 font-medium">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {ratingDistribution.map(({ star, count, percentage }) => (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-gray-400 w-3 text-right">{star}</span>
                            <Star className="w-3 h-3 text-gray-300 fill-gray-300" />
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (5 - star) * 0.08 }}
                                className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                              />
                            </div>
                            <span className="text-xs text-gray-400 font-medium w-6">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Review Form / State */}
                  {user ? (
                    userReview ? (
                      <div className="p-7 rounded-2xl bg-blue-50/60 border border-blue-100/60 space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Star className="w-4 h-4 text-blue-500 fill-blue-500" />
                            </div>
                            <h3 className="font-semibold text-gray-800 text-[15px]">Your Review</h3>
                          </div>
                          <button
                            onClick={() => setEditingReview(!editingReview)}
                            className="text-[13px] font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                          >
                            {editingReview ? 'Cancel' : 'Edit'}
                          </button>
                        </div>
                        {editingReview ? (
                          <form onSubmit={handleAddReview} className="space-y-4">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                  className="p-0.5 transition-all hover:scale-125"
                                >
                                  <Star className={cn(
                                    "w-6 h-6 transition-colors",
                                    newReview.rating >= star ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200"
                                  )} />
                                </button>
                              ))}
                            </div>
                            <textarea
                              value={newReview.comment}
                              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                              placeholder="Share your thoughts..."
                              required
                              className="w-full p-4 bg-white border border-blue-100/60 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all outline-none min-h-[110px] text-[15px] text-gray-600 placeholder:text-gray-300 resize-none"
                            />
                            <button
                              type="submit"
                              disabled={submitting}
                              className="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all disabled:opacity-40 shadow-sm"
                            >
                              {submitting ? 'Updating...' : 'Update Review'}
                            </button>
                          </form>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={cn("w-4 h-4", i < userReview.rating ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200")} />
                              ))}
                            </div>
                            <p className="text-gray-600 leading-relaxed text-[15px]">{userReview.comment}</p>
                            <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              {new Date(userReview.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : hasPurchased ? (
                      <form onSubmit={handleAddReview} className="p-7 rounded-2xl bg-gradient-to-br from-orange-50/80 to-amber-50/40 border border-orange-100/60 space-y-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-orange-500" />
                          </div>
                          <h3 className="font-semibold text-gray-800 text-[15px]">Write a Review</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                              className="p-0.5 transition-all hover:scale-125"
                            >
                              <Star className={cn(
                                "w-6 h-6 transition-colors",
                                newReview.rating >= star ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200"
                              )} />
                            </button>
                          ))}
                          <span className="text-sm text-gray-400 ml-2 font-medium">{newReview.rating}/5</span>
                        </div>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                          placeholder="Share your experience with this book..."
                          required
                          className="w-full p-4 bg-white border border-orange-100/60 rounded-xl focus:border-orange-200 focus:ring-2 focus:ring-orange-100 transition-all outline-none min-h-[110px] text-[15px] text-gray-600 placeholder:text-gray-300 resize-none"
                        />
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition-all disabled:opacity-40 shadow-sm shadow-orange-600/15"
                        >
                          {submitting ? 'Posting...' : 'Post Review'}
                        </button>
                      </form>
                    ) : (
                      <div className="p-8 rounded-2xl bg-gray-50/60 border border-dashed border-gray-200/80 text-center space-y-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-5 h-5 text-gray-300" />
                        </div>
                        <p className="text-gray-400 text-[15px]">You can review this book after receiving your order.</p>
                      </div>
                    )
                  ) : (
                    <div className="p-8 rounded-2xl bg-gray-50/60 border border-dashed border-gray-200/80 text-center space-y-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                        <User className="w-5 h-5 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-[15px]">Please sign in to write a review.</p>
                      <Link href="/auth" className="inline-block text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors">Sign In →</Link>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.length > 0 ? reviews.map((review, idx) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-600 font-bold text-sm">
                              {review.user_name[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-[14px]">{review.user_name}</p>
                              <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" />
                                {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200")} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-500 leading-[1.75] text-[14.5px]">{review.comment}</p>
                      </motion.div>
                    )) : (
                      <div className="py-16 rounded-2xl bg-gray-50/50 border border-dashed border-gray-200/80 text-center">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Star className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-gray-400 text-[15px]">No reviews yet. Be the first to share your thoughts!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Q&A Tab */}
              {activeTab === 'qanda' && (
                <div className="space-y-8">
                  {/* Ask Question Form */}
                  {user && !isStaff ? (
                    <form onSubmit={handleAddQuestion} className="p-7 rounded-2xl bg-blue-50/50 border border-blue-100/50 space-y-4">
                      <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <HelpCircle className="w-4 h-4 text-blue-500" />
                        </div>
                        <h3 className="font-semibold text-gray-800 text-[15px]">Ask a Question</h3>
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          placeholder="What would you like to know about this book?"
                          required
                          className="flex-1 p-4 bg-white border border-blue-100/50 rounded-xl focus:border-blue-200 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-[15px] text-gray-600 placeholder:text-gray-300"
                        />
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all disabled:opacity-40 flex items-center justify-center shadow-sm shrink-0"
                        >
                          {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-[18px] h-[18px]" />}
                        </button>
                      </div>
                    </form>
                  ) : !user ? (
                    <div className="p-8 rounded-2xl bg-gray-50/60 border border-dashed border-gray-200/80 text-center space-y-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                        <User className="w-5 h-5 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-[15px]">Please sign in to ask a question.</p>
                      <Link href="/auth" className="inline-block text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors">Sign In →</Link>
                    </div>
                  ) : null}

                  {/* Questions List */}
                  <div className="space-y-4">
                    {questions.length > 0 ? questions.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-300"
                      >
                        <div className="flex items-start gap-3.5 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-xs shrink-0 mt-0.5">Q</div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-[14.5px] leading-snug">{item.question}</p>
                            <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1.5">
                              <User className="w-3 h-3" />
                              {item.user_name}
                              <span className="text-gray-300">·</span>
                              <Clock className="w-3 h-3" />
                              {new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        {item.answer ? (
                          <div className="flex items-start gap-3.5 ml-[46px] pt-4 border-t border-gray-50">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 font-bold text-xs shrink-0 mt-0.5">A</div>
                            <p className="text-gray-500 leading-[1.75] text-[14px] italic">{item.answer}</p>
                          </div>
                        ) : (
                          <div className="ml-[46px] pt-3">
                            <p className="text-[12px] text-gray-300 italic flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              Awaiting response...
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )) : (
                      <div className="py-16 rounded-2xl bg-gray-50/50 border border-dashed border-gray-200/80 text-center">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <HelpCircle className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-gray-400 text-[15px]">No questions yet. Curious about something?</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}