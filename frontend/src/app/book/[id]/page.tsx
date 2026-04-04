'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Book } from '@/types';
import { Star, ShoppingCart, BookOpen, MessageSquare, HelpCircle, ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, Heart, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
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

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div></div>;
  if (!book) return <div className="text-center py-20"><h2 className="text-2xl font-bold">Book not found</h2><Link href="/shop" className="text-orange-600 mt-4 inline-block">Back to Shop</Link></div>;

  const isStaff = user?.role === 'staff';

  return (
    <div className="space-y-12 pb-20">
      <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-600 transition-colors uppercase tracking-widest">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Collection</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <div className="aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl shadow-orange-900/10 border border-gray-100">
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
            </div>
            {!isStaff && (
              <div className="mt-8 grid grid-cols-2 gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button 
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                  className={cn(
                    "flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 border",
                    isInWishlist(id) 
                      ? "bg-red-50 border-red-100 text-red-600 hover:bg-red-100" 
                      : "bg-white border-gray-100 text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Heart className={cn("w-5 h-5", isInWishlist(id) && "fill-current")} />
                  <span>{isInWishlist(id) ? 'Wishlisted' : 'Wishlist'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-widest rounded-full">{book.category}</span>
              <div className="flex items-center gap-1 text-orange-400">
                {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-4 h-4 fill-current", i < Math.round(averageRating) ? "text-orange-400" : "text-gray-200")} />)}
                <span className="text-sm font-bold text-gray-600 ml-1">{averageRating.toFixed(1)} ({reviews.length} Reviews)</span>
              </div>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">{book.title}</h1>
            <p className="text-xl text-gray-500 italic mb-8">by <span className="text-gray-900 font-semibold not-italic">{book.author}</span></p>
            
            <div className="flex items-center gap-8 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm mb-8">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price</p>
                <p className="text-3xl font-bold text-gray-900">৳{book.price.toFixed(2)}</p>
              </div>
              <div className="w-px h-12 bg-gray-100"></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Stock</p>
                <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>{book.stock} Available</span>
                </p>
              </div>
            </div>

            <div className="flex border-b border-gray-100 gap-8 mb-8">
              {[
                { id: 'details', label: 'Details', icon: MessageSquare },
                { id: 'preview', label: 'Preview', icon: BookOpen },
                { id: 'reviews', label: 'Reviews', icon: Star },
                { id: 'qanda', label: 'Q&A', icon: HelpCircle },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 py-4 text-sm font-bold uppercase tracking-widest transition-all relative",
                    activeTab === tab.id ? "text-orange-600" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-[300px]"
              >
                {activeTab === 'details' && (
                  <div className="prose prose-orange max-w-none">
                    <p className="text-gray-600 leading-relaxed text-lg">{book.description}</p>
                  </div>
                )}

                {activeTab === 'preview' && (
                  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm relative">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-bold text-gray-900">Page {previewPage + 1} of {(book.previewImages && book.previewImages.length) ? book.previewImages.length : book.previewContent.length}</h3>
                      <div className="flex gap-2">
                        <button 
                          disabled={previewPage === 0}
                          onClick={() => setPreviewPage(p => p - 1)}
                          className="p-2 rounded-lg bg-gray-50 text-gray-600 disabled:opacity-30 hover:bg-orange-50 hover:text-orange-600 transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                          disabled={previewPage === ((book.previewImages && book.previewImages.length) ? book.previewImages.length - 1 : book.previewContent.length - 1)}
                          onClick={() => setPreviewPage(p => p + 1)}
                          className="p-2 rounded-lg bg-gray-50 text-gray-600 disabled:opacity-30 hover:bg-orange-50 hover:text-orange-600 transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {book.previewImages && book.previewImages.length > 0 ? (
                      <div className="w-full flex items-center justify-center">
                        <img src={book.previewImages[previewPage]} alt={`Preview page ${previewPage + 1}`} className="max-w-full max-h-[60vh] object-contain rounded-lg shadow" />
                      </div>
                    ) : (
                      <div className="font-serif text-xl leading-loose text-gray-700 italic border-l-4 border-orange-100 pl-8 py-4">
                        {book.previewContent[previewPage]}
                      </div>
                    )}

                    {!isStaff && (
                      <div className="mt-12 p-6 bg-orange-50 rounded-2xl text-center">
                        <p className="text-sm font-medium text-orange-800 mb-4">Enjoying the preview? Get the full book to continue reading.</p>
                        <button 
                          onClick={handleAddToCart}
                          className="px-6 py-2 bg-orange-600 text-white rounded-full text-sm font-bold hover:bg-orange-700 transition-all"
                        >
                          Buy Full Version
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-8">
                    {user ? (
                      userReview ? (
                        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Your Review</h3>
                            <button
                              onClick={() => setEditingReview(!editingReview)}
                              className="text-sm font-bold text-blue-600 hover:underline"
                            >
                              {editingReview ? 'Cancel' : 'Edit Review'}
                            </button>
                          </div>
                          {editingReview ? (
                            <form onSubmit={handleAddReview} className="space-y-4">
                              <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                    className={cn(
                                      "p-1 transition-all hover:scale-110",
                                      newReview.rating >= star ? "text-orange-400" : "text-gray-300"
                                    )}
                                  >
                                    <Star className={cn("w-6 h-6", newReview.rating >= star && "fill-current")} />
                                  </button>
                                ))}
                              </div>
                              <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                placeholder="Share your thoughts about this book..."
                                required
                                className="w-full p-4 bg-white border border-transparent rounded-2xl focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/10 transition-all outline-none min-h-[100px]"
                              />
                              <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                              >
                                {submitting ? 'Updating...' : 'Update Review'}
                              </button>
                            </form>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-center gap-1 text-orange-400">
                                {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-5 h-5 fill-current", i < userReview.rating ? "text-orange-400" : "text-gray-200")} />)}
                              </div>
                              <p className="text-gray-700 leading-relaxed">{userReview.comment}</p>
                              <p className="text-xs text-gray-400">Reviewed on {new Date(userReview.created_at).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      ) : hasPurchased ? (
                        <form onSubmit={handleAddReview} className="p-6 bg-orange-50 rounded-3xl border border-orange-100 space-y-4">
                          <h3 className="font-bold text-gray-900">Write a Review</h3>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                className={cn(
                                  "p-1 transition-all hover:scale-110",
                                  newReview.rating >= star ? "text-orange-400" : "text-gray-300"
                                )}
                              >
                                <Star className={cn("w-6 h-6", newReview.rating >= star && "fill-current")} />
                              </button>
                            ))}
                          </div>
                          <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Share your thoughts about this book..."
                            required
                            className="w-full p-4 bg-white border border-transparent rounded-2xl focus:border-orange-500/20 focus:ring-2 focus:ring-orange-500/10 transition-all outline-none min-h-[100px]"
                          />
                          <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-orange-600 text-white rounded-full text-sm font-bold hover:bg-orange-700 transition-all disabled:opacity-50"
                          >
                            {submitting ? 'Posting...' : 'Post Review'}
                          </button>
                        </form>
                      ) : (
                        <div className="p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center space-y-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500">You can review this book after receiving your order.</p>
                        </div>
                      )
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center">
                        <p className="text-gray-500 mb-4">Please sign in to write a review.</p>
                        <Link href="/auth" className="text-orange-600 font-bold hover:underline">Sign In</Link>
                      </div>
                    )}

                    <div className="space-y-6">
                      {reviews.length > 0 ? reviews.map(review => (
                        <div key={review.id} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                                {review.user_name[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{review.user_name}</p>
                                <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-orange-400">
                              {[...Array(5)].map((_, i) => <Star key={i} className={cn("w-3 h-3 fill-current", i < review.rating ? "text-orange-400" : "text-gray-200")} />)}
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                      )) : (
                        <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                          <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                          <p className="text-gray-500">No reviews yet. Be the first to rate this book!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'qanda' && (
                  <div className="space-y-8">
                    {user && !isStaff ? (
                      <form onSubmit={handleAddQuestion} className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                        <h3 className="font-bold text-gray-900 mb-4">Ask a Question</h3>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="What would you like to know?"
                            required
                            className="flex-1 p-4 bg-white border border-transparent rounded-2xl focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                          />
                          <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center"
                          >
                            {submitting ? '...' : <Send className="w-5 h-5" />}
                          </button>
                        </div>
                      </form>
                    ) : !user ? (
                      <div className="p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center">
                        <p className="text-gray-500 mb-4">Please sign in to ask a question.</p>
                        <Link href="/auth" className="text-orange-600 font-bold hover:underline">Sign In</Link>
                      </div>
                    ) : null}

                    <div className="space-y-6">
                      {questions.length > 0 ? questions.map(item => (
                        <div key={item.id} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">Q</div>
                            <div>
                              <p className="font-bold text-gray-900">{item.question}</p>
                              <p className="text-xs text-gray-400">Asked by {item.user_name} • {new Date(item.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          {item.answer ? (
                            <div className="flex items-start gap-4 pl-12">
                              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600 font-bold shrink-0">A</div>
                              <p className="text-gray-600 italic leading-relaxed">{item.answer}</p>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 italic pl-12">Waiting for an answer...</p>
                          )}
                        </div>
                      )) : (
                        <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                          <HelpCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                          <p className="text-gray-500">No questions yet. Have a question about this book?</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
