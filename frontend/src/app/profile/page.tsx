'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  Mail,
  XCircle,
  CheckCircle2,
  Truck,
  CreditCard,
  MapPin,
  Calendar,
  ExternalLink,
  BookOpen,
  GraduationCap,
  Play,
  Tag,
  Camera,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { UserProfile, Order, Book } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { api, mapApiBookToBook, mapApiOrderToOrder, joinStorage } from '@/lib/api';
import { toast } from 'sonner';

interface ExtendedOrder extends Order {
  shippingAddress?: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  discount?: { code: string; amount: number } | null;
  discount_amount?: number;
  cod_charge?: number;
  payment_mobile?: string;
  transaction_id?: string;
  shipping_address?: string;
  postal_code?: string;
  city?: string;
  phone?: string;
  items: any[];
  total: number;
  createdAt: string;
}

type ActiveTab = 'orders' | 'my-books' | 'my-courses' | 'wishlist' | 'settings';

const CARD =
  'relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 backdrop-blur-2xl shadow-[0_24px_80px_-24px_rgba(249,115,22,0.14)]';
const CARD_SOFT =
  'relative overflow-hidden rounded-[28px] border border-white/70 bg-white/70 backdrop-blur-2xl shadow-[0_18px_60px_-28px_rgba(249,115,22,0.12)]';
const RING =
  'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.07),transparent_35%)]';

function PremiumSurface({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(CARD, className)}>
      <div className={RING} />
      <div className="relative">{children}</div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange-500/70">
          Premium dashboard
        </p>
        <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

function PremiumStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[32px] border border-dashed border-orange-200 bg-white/70 px-6 py-20 text-center shadow-[0_18px_50px_-30px_rgba(249,115,22,0.18)]">
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-orange-50 text-orange-500">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">{description}</p>
      {action && <div className="mt-8 flex justify-center">{action}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'delivered'
      ? 'bg-green-50 text-green-600'
      : status === 'cancelled'
        ? 'bg-red-50 text-red-600'
        : status === 'shipped'
          ? 'bg-blue-50 text-blue-600'
          : status === 'processing'
            ? 'bg-purple-50 text-purple-600'
            : 'bg-orange-50 text-orange-600';

  const Icon = status === 'delivered' ? CheckCircle2 : status === 'cancelled' ? XCircle : Clock;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]',
        tone
      )}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

const formatMoney = (value?: number | null) => `৳${Number(value || 0).toFixed(2)}`;

const formatLongDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const formatShortDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export default function Profile() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isStaff = user?.role === 'staff';

  const [activeTab, setActiveTab] = useState<ActiveTab>(isStaff ? 'settings' : 'orders');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [wishlistBooks, setWishlistBooks] = useState<Book[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderSort, setOrderSort] = useState<'newest' | 'oldest' | 'total-high' | 'total-low'>('newest');
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [myBooksFilter, setMyBooksFilter] = useState<'all' | 'delivered' | 'to-receive'>('all');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const myBooksCount = orders.reduce((sum, order) => {
    if (order.status === 'cancelled') return sum;
    return sum + (order.items || []).filter((item: any) => item.type !== 'course').length;
  }, 0);

  useEffect(() => {
    if (!user && !loading) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'staff') {
      setActiveTab('settings');
    }
  }, [user]);

  const fetchData = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setWishlistBooks([]);
      setEnrolledCourses([]);
      setOrdersLoading(false);
      setWishlistLoading(false);
      setLoading(false);
      return;
    }

    setOrdersLoading(true);
    setWishlistLoading(true);
    setLoading(true);

    const profileData = user;
    setProfile(profileData);
    setFormData({
      displayName: profileData.displayName,
      email: profileData.email,
      phone: profileData.phone || '',
      address: profileData.address || '',
      city: profileData.city || '',
      zipCode: profileData.zipCode || '',
    });
    setAvatarUrl(profileData.photoUrl || null);

    try {
      const [wishlistRes, ordersRes] = await Promise.all([
        api.get<any[]>('/wishlist').catch(() => []),
        api.get<any>('/orders').catch(() => ({})),
      ]);

      try {
        const books = (wishlistRes || [])
          .filter((item: any) => item.book)
          .map((item: any) => mapApiBookToBook(item.book));
        setWishlistBooks(books);
      } catch {
        setWishlistBooks([]);
      } finally {
        setWishlistLoading(false);
      }

      try {
        const list = Array.isArray(ordersRes) ? ordersRes : ordersRes?.data || [];
        const mapped = (list || []).map(mapApiOrderToOrder);
        const allOrders = [...mapped] as ExtendedOrder[];
        setOrders(allOrders);

        const courses: any[] = [];
        const seenCourseIds = new Set<string>();

        allOrders.forEach((order: any) => {
          if (order.status === 'cancelled') return;

          (order.items || []).forEach((item: any) => {
            const courseId = item.courseId || item.course_id;
            const isCourse = item.type === 'course' || item.course || (item.course_id && !item.book_id);

            if (isCourse && courseId && !seenCourseIds.has(String(courseId))) {
              seenCourseIds.add(String(courseId));
              const courseData = item.course || item;
              const courseSlug = courseData?.slug || item.slug || '';
              const courseImg = courseData?.image || courseData?.coverUrl;
              const finalCoverUrl = courseImg
                ? courseImg.startsWith('http')
                  ? courseImg
                  : joinStorage('http://localhost:8000/storage', courseImg)
                : null;

              courses.push({
                id: String(courseId),
                title: courseData?.title || item.title || 'Unknown Course',
                slug: courseSlug,
                instructor: courseData?.instructor || item.author || 'Unknown',
                price: item.price || courseData?.price || 0,
                coverUrl: finalCoverUrl,
                orderDate: order.createdAt,
                orderId: order.orderId || order.id,
                status: order.status,
              });
            }
          });
        });

        setEnrolledCourses(courses);
      } catch {
        setOrders([]);
        setEnrolledCourses([]);
      } finally {
        setOrdersLoading(false);
      }
    } catch {
      setOrders([]);
      setWishlistBooks([]);
      setEnrolledCourses([]);
      setOrdersLoading(false);
      setWishlistLoading(false);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setOrders([]);
      setProfile(null);
      setWishlistBooks([]);
    }
  }, [user, fetchData]);

  useEffect(() => {
    if (user && pathname === '/profile') {
      fetchData();
    }
  }, [pathname, user, fetchData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && pathname === '/profile' && user) {
        fetchData();
      }
    };

    const handlePageShow = () => {
      if (pathname === '/profile' && user) {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [pathname, user, fetchData]);

  useEffect(() => {
    const handleAuthChange = () => {
      fetchData();
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [fetchData]);

  useEffect(() => {
    const handleProfileRefresh = () => {
      if (user) fetchData();
    };
    window.addEventListener('profile-refresh', handleProfileRefresh);
    return () => window.removeEventListener('profile-refresh', handleProfileRefresh);
  }, [user, fetchData]);

  useEffect(() => {
    const handler = () => {
      fetchData();
    };
    window.addEventListener('orders-changed', handler);
    return () => window.removeEventListener('orders-changed', handler);
  }, [fetchData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      await api.post('/auth/update-profile', {
        name: formData.displayName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zip_code: formData.zipCode,
      });

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              displayName: formData.displayName,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              zipCode: formData.zipCode,
            }
          : null
      );
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const errors = { currentPassword: '', newPassword: '', confirmPassword: '' };
    let hasError = false;

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      hasError = true;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
      hasError = true;
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    setPasswordErrors(errors);
    if (hasError) return;

    setLoading(true);

    try {
      await api.post('/auth/change-password', {
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword,
      });

      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPassword(false);
    } catch (err: any) {
      if (err.message?.includes('current password')) {
        setPasswordErrors((prev) => ({ ...prev, currentPassword: 'Current password is incorrect' }));
      } else {
        toast.error(err.message || 'Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    const updatedOrders = orders.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o));
    setOrders(updatedOrders as ExtendedOrder[]);
    localStorage.setItem('lumina_orders', JSON.stringify(updatedOrders));
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleRemoveFromWishlist = async (bookId: string) => {
    if (!user) return;

    try {
      await api.post('/wishlist/toggle', { book_id: parseInt(bookId) });
      setWishlistBooks((prev) => prev.filter((b) => b.id !== bookId));
      window.dispatchEvent(new Event('auth-change'));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      toast.error('Please select a valid image file (JPEG, PNG, JPG, GIF)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setAvatarUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/auth/update-profile', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Upload failed');
      }

      const data = await response.json();
      const avatarPath = data.user.avatar;
      const fullUrl = avatarPath ? `http://localhost:8000/storage/${avatarPath}` : null;

      setAvatarUrl(fullUrl);
      toast.success('Profile picture updated');
      window.dispatchEvent(new Event('auth-change'));
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-white via-orange-50/30 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />
          <p className="text-sm font-medium text-gray-400">Loading your premium space…</p>
        </div>
      </div>
    );
  }

  const renderOrders = () => {
    const sortedOrders = [...orders].sort((a, b) => {
      if (orderSort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (orderSort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (orderSort === 'total-high') return b.total - a.total;
      if (orderSort === 'total-low') return a.total - b.total;
      return 0;
    });

    return sortedOrders.map((order) => {
      const displayOrderId = order.id || order.orderId;
      const items = order.items || [];

      const hasBooks = items.some((item: any) => item.type !== 'course');
      const hasCourses = items.filter((item: any) => item.type === 'course').length > 0;

      return (
        <motion.div
          key={order.id}
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className={cn(
            'overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_18px_60px_-28px_rgba(249,115,22,0.16)] backdrop-blur-xl',
            'transition-all duration-300 hover:shadow-[0_24px_80px_-30px_rgba(249,115,22,0.22)]'
          )}
        >
          <button
            className="w-full p-6 text-left transition-colors hover:bg-orange-50/35 md:p-8"
            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">
                  Order Number
                </p>
                <p className="text-lg font-bold text-gray-900">{displayOrderId}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">
                  Date
                </p>
                <p className="text-lg font-bold text-gray-900">{formatLongDate(order.createdAt)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">
                  Total
                </p>
                <p className="text-lg font-bold text-gray-900">{formatMoney(order.total)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">
                  Status
                </p>
                <div className="pt-1">
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </div>

            {hasBooks && order.status !== 'cancelled' && order.status !== 'pending' && (
              <div className="mt-6 border-t border-white/70 pt-5">
                <div className="mb-3 flex items-center gap-2 text-gray-500">
                  <Truck className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                    Delivery Progress
                  </span>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {['processing', 'shipped', 'delivered'].map((step, idx) => {
                    const orderIndex = ['processing', 'shipped', 'delivered'].indexOf(order.status);
                    const currentIndex = ['processing', 'shipped', 'delivered'].indexOf(step);

                    const isDone = orderIndex > currentIndex;
                    const isActive = order.status === step;

                    return (
                      <div key={step} className="flex flex-1 items-center">
                        <div
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all',
                            isActive
                              ? 'bg-orange-600 text-white shadow-[0_12px_25px_-10px_rgba(234,88,12,0.75)]'
                              : isDone
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-400'
                          )}
                        >
                          {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                        </div>
                        <span
                          className={cn(
                            'ml-2 text-xs font-bold uppercase tracking-[0.18em]',
                            isActive ? 'text-orange-600' : isDone ? 'text-green-600' : 'text-gray-400'
                          )}
                        >
                          {step}
                        </span>
                        {idx < 2 && (
                          <div
                            className={cn(
                              'mx-2 h-1 flex-1 rounded-full',
                              isDone ? 'bg-green-600' : 'bg-gray-200'
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {hasCourses && (
              <div className="mt-6 border-t border-white/70 pt-5">
                <div className="mb-3 flex items-center gap-2 text-gray-500">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                    Enrolled Courses
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {items
                    .filter((item: any) => item.type === 'course')
                    .map((item: any, idx: number) => (
                      <Link
                        key={`${order.id}-course-${idx}`}
                        href={`/courses/${item.slug}`}
                        className="group flex items-center gap-4 rounded-2xl border border-white/70 bg-purple-50/60 p-3 transition-all hover:bg-purple-50 hover:shadow-sm"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                          <img
                            src={item.coverUrl}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-purple-900 group-hover:text-purple-700">
                            {item.title}
                          </p>
                          <p className="text-xs text-purple-600">{item.instructor}</p>
                        </div>
                        <Play className="h-5 w-5 text-purple-400 transition-colors group-hover:text-purple-600" />
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Order Details Button */}
            <div className="mt-5 flex justify-end border-t border-white/70 pt-4">
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedOrder(expandedOrder === order.id ? null : order.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setExpandedOrder(expandedOrder === order.id ? null : order.id);
                  }
                }}
                className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:shadow-orange-500/35 hover:from-orange-700 hover:to-amber-600 active:scale-[0.97]"
              >
                <span>{expandedOrder === order.id ? 'Hide' : 'View'} Details</span>
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>
          </button>

          {expandedOrder === order.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="border-t border-white/70"
            >
              <div className="space-y-6 p-6 md:p-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Package className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                      Items
                    </span>
                  </div>

                  <div className="space-y-3">
                    {items.map((item: any, idx: number) => {
                      if (item.type === 'course') {
                        return (
                          <div
                            key={`${order.id}-course-${idx}`}
                            className="flex items-center gap-4 rounded-2xl border border-white/70 bg-purple-50/70 p-4"
                          >
                            <div className="h-16 w-12 shrink-0 overflow-hidden rounded-xl">
                              <img
                                src={item.coverUrl}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-serif text-base font-bold text-gray-900">
                                {item.title}
                              </p>
                              <p className="text-sm text-gray-500">{item.instructor}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{formatMoney(item.price)}</p>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={`${order.id}-detail-${idx}`}
                          href={`/book/${item.bookId}`}
                          className="group flex items-center gap-4 rounded-2xl border border-white/70 bg-gray-50/80 p-4 transition-all hover:bg-orange-50/45 hover:shadow-sm"
                        >
                          <div className="h-24 w-16 shrink-0 overflow-hidden rounded-xl shadow-sm transition-transform group-hover:scale-[1.03]">
                            {item.coverUrl ? (
                              <img
                                src={item.coverUrl}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
                                <BookOpen className="h-5 w-5" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-serif text-lg font-bold text-gray-900 transition-colors group-hover:text-orange-600">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-500">by {item.author}</p>
                            <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                            {item.isbn && (
                              <p className="mt-1 text-xs text-blue-600">ISBN: {item.isbn}</p>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              {formatMoney(item.price * item.quantity)}
                            </p>
                            <p className="text-xs text-gray-400">{formatMoney(item.price)} each</p>
                          </div>

                          <ExternalLink className="h-4 w-4 text-gray-300 transition-colors group-hover:text-orange-600" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="ml-auto max-w-md rounded-[28px] border border-orange-100 bg-orange-50/60 p-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold text-gray-900">
                      {formatMoney(
                        Number(order.total || 0) +
                          Number(order.discount_amount || 0) -
                          Number(order.cod_charge || 0)
                      )}
                    </span>
                  </div>

                  {order.discount_amount && order.discount_amount > 0 && (
                    <div className="mt-3 flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-green-600">
                        <Tag className="h-3 w-3" />
                        Discount
                      </span>
                      <span className="font-bold text-green-600">
                        -{formatMoney(Number(order.discount_amount))}
                      </span>
                    </div>
                  )}

                  {order.cod_charge && order.cod_charge > 0 && (
                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-gray-500">COD Charge</span>
                      <span className="font-bold text-gray-900">
                        {formatMoney(Number(order.cod_charge))}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex justify-between border-t border-orange-100 pt-4 text-sm">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">{formatMoney(Number(order.total))}</span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {order.shipping_address && (
                    <div className="rounded-[28px] border border-white/70 bg-white/70 p-6">
                      <div className="mb-3 flex items-center gap-2 text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                          Order Details
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>
                          <span className="font-semibold">Order Number:</span> {displayOrderId}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span> {order.phone || 'N/A'}
                        </p>
                        <p>
                          <span className="font-semibold">Address:</span>{' '}
                          {order.shipping_address || 'N/A'}
                        </p>
                        <p>
                          {order.city} {order.postal_code}
                        </p>
                        {order.trackingNumber && (
                          <p>
                            <span className="font-semibold">Tracking:</span> {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="rounded-[28px] border border-white/70 bg-white/70 p-6">
                    <div className="mb-3 flex items-center gap-2 text-gray-500">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.24em]">
                        Payment
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <span className="font-semibold">Method:</span>{' '}
                        <span className="capitalize">
                          {order.paymentMethod === 'cod'
                            ? 'Cash on Delivery'
                            : order.paymentMethod === 'bkash'
                              ? 'bKash'
                              : order.paymentMethod === 'nagad'
                                ? 'Nagad'
                                : order.paymentMethod}
                        </span>
                      </p>
                      {order.paymentMethod !== 'cod' && order.transaction_id && (
                        <p>
                          <span className="font-semibold">Transaction:</span>{' '}
                          {order.transaction_id}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-white/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <Truck className="h-4 w-4" />
                    Paid via{' '}
                    <span className="font-bold text-gray-900 capitalize">
                      {order.paymentMethod === 'cod'
                        ? 'Cash on Delivery'
                        : order.paymentMethod === 'bkash'
                          ? 'bKash'
                          : order.paymentMethod === 'nagad'
                            ? 'Nagad'
                            : order.paymentMethod}
                    </span>
                  </p>

                  {order.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelOrder(order.id);
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 transition-colors hover:text-red-700 hover:underline"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      );
    });
  };

  const myBooks = (() => {
    const books: {
      bookId: string;
      title: string;
      author: string;
      coverUrl: string;
      price: number;
      quantity: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
      orderDate: string;
      orderId: string;
    }[] = [];

    orders.forEach((order) => {
      if (order.status === 'cancelled') return;
      order.items?.forEach((item: any) => {
        if (item.type === 'course') return;
        books.push({
          bookId: item.bookId || '',
          title: item.title,
          author: item.author,
          coverUrl: item.coverUrl,
          price: item.price,
          quantity: item.quantity,
          status: order.status,
          orderDate: order.createdAt,
          orderId: order.orderId || order.id,
        });
      });
    });

    return books;
  })();

  const filteredBooks =
    myBooksFilter === 'all'
      ? myBooks
      : myBooksFilter === 'delivered'
        ? myBooks.filter((b) => b.status === 'delivered')
        : myBooks.filter((b) => b.status !== 'delivered');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/35 to-white pb-20">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6 lg:px-8">
        <PremiumSurface className="p-6 md:p-8 lg:p-10">
          <div className="absolute right-0 top-0 h-72 w-72 -translate-y-1/2 translate-x-1/2 rounded-full bg-orange-100/60 blur-3xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
              <div className="group relative">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_18px_40px_-18px_rgba(249,115,22,0.35)] ring-1 ring-orange-100">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={profile?.displayName || 'Profile'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-orange-100 text-4xl font-bold text-orange-600">
                      {profile?.displayName?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>

                <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={avatarUploading}
                  />
                  {avatarUploading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </label>
              </div>

              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-600">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  Premium Account
                </div>

                <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                  {profile?.displayName}
                </h1>

                <p className="mt-2 flex items-center justify-center gap-2 text-gray-500 md:justify-start">
                  <Mail className="h-4 w-4" />
                  <span>{profile?.email}</span>
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.22em]',
                      isStaff ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                    )}
                  >
                    {user?.role === 'staff' ? 'Staff Member' : 'Customer'}
                  </span>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-green-600">
                    Verified Account
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="grid grid-cols-3 gap-3">
                <PremiumStat label="Orders" value={orders.length} />
                <PremiumStat label="Wishlist" value={wishlistBooks.length} />
                <PremiumStat label="Courses" value={enrolledCourses.length} />
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 font-bold text-white shadow-[0_18px_40px_-18px_rgba(17,24,39,0.45)] transition-all hover:bg-orange-600 hover:shadow-[0_22px_45px_-18px_rgba(234,88,12,0.5)]"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </PremiumSurface>

        <div className="grid gap-8 lg:grid-cols-12">
          <aside className="lg:sticky lg:top-6 lg:col-span-3 self-start">
            <PremiumSurface className="p-3">
              <div className="space-y-2">
                {[
                  { id: 'orders', label: 'Order History', icon: Package, hide: isStaff, count: orders.length },
                  { id: 'my-books', label: 'My Books', icon: BookOpen, hide: isStaff, count: myBooksCount },
                  { id: 'my-courses', label: 'My Courses', icon: GraduationCap, hide: isStaff, count: enrolledCourses.length },
                  { id: 'wishlist', label: 'My Wishlist', icon: Heart, hide: isStaff, count: wishlistBooks.length },
                  { id: 'settings', label: 'Account Settings', icon: Settings, hide: false, count: 2 },
                ]
                  .filter((tab) => !tab.hide)
                  .map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as ActiveTab)}
                      className={cn(
                        'group flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left transition-all duration-300',
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-[0_20px_50px_-18px_rgba(234,88,12,0.55)]'
                          : 'bg-white/60 text-gray-600 hover:bg-white hover:text-gray-900'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'grid h-10 w-10 place-items-center rounded-xl transition-all',
                            activeTab === tab.id
                              ? 'bg-white/15 text-white'
                              : 'bg-orange-50 text-orange-600 group-hover:bg-orange-100'
                          )}
                        >
                          <tab.icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-bold">{tab.label}</p>
                          <p
                            className={cn(
                              'text-[11px] uppercase tracking-[0.2em]',
                              activeTab === tab.id ? 'text-orange-100' : 'text-gray-400'
                            )}
                          >
                            {tab.count} items
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 transition-transform',
                          activeTab === tab.id
                            ? 'translate-x-1 text-white'
                            : 'text-gray-300 group-hover:text-orange-400'
                        )}
                      />
                    </button>
                  ))}
              </div>
            </PremiumSurface>
          </aside>

          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 14, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <PremiumSurface className="p-6 md:p-8 lg:p-10">
                  {activeTab === 'orders' && (
                    <div className="space-y-6">
                      <SectionHeader
                        title="Your Orders"
                        subtitle="A premium view of every purchase, shipment, payment, and delivery milestone."
                        right={
                          orders.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-500">Sort by:</span>
                              <select
                                value={orderSort}
                                onChange={(e) =>
                                  setOrderSort(e.target.value as typeof orderSort)
                                }
                                className="cursor-pointer rounded-2xl border border-white/80 bg-white/80 px-4 py-2 text-sm font-bold text-gray-700 outline-none transition-all focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/10"
                              >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="total-high">Total: High to Low</option>
                                <option value="total-low">Total: Low to High</option>
                              </select>
                            </div>
                          ) : null
                        }
                      />

                      {ordersLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="rounded-[32px] border border-white/70 bg-white/75 p-8 shadow-[0_18px_60px_-28px_rgba(249,115,22,0.12)] animate-pulse"
                            >
                              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="h-3 w-16 rounded bg-gray-200" />
                                  <div className="h-6 w-24 rounded bg-gray-200" />
                                </div>
                                <div className="space-y-2 text-right">
                                  <div className="h-3 w-16 rounded bg-gray-200" />
                                  <div className="h-6 w-32 rounded bg-gray-200" />
                                </div>
                                <div className="space-y-2 text-right">
                                  <div className="h-3 w-16 rounded bg-gray-200" />
                                  <div className="h-6 w-20 rounded bg-gray-200" />
                                </div>
                              </div>
                              <div className="flex gap-3">
                                {[1, 2, 3, 4].map((j) => (
                                  <div key={j} className="h-24 w-16 rounded-xl bg-gray-200" />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : orders.length > 0 ? (
                        renderOrders()
                      ) : (
                        <EmptyState
                          icon={Package}
                          title="No orders yet"
                          description="You haven't placed any orders yet. Start shopping and your order history will appear here in a beautifully organized timeline."
                          action={
                            <Link
                              href="/shop"
                              className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-8 py-4 font-bold text-white transition-all hover:bg-orange-700 hover:shadow-[0_18px_40px_-18px_rgba(234,88,12,0.45)]"
                            >
                              Start Shopping
                            </Link>
                          }
                        />
                      )}
                    </div>
                  )}

                  {activeTab === 'my-books' && (
                    <div className="space-y-6">
                      <SectionHeader
                        title="My Books"
                        subtitle="A refined library of all purchased books with delivery-aware filters."
                        right={
                          <div className="flex items-center gap-2 rounded-2xl bg-gray-100 p-1">
                            <button
                              onClick={() => setMyBooksFilter('all')}
                              className={cn(
                                'rounded-xl px-4 py-2 text-sm font-bold transition-all',
                                myBooksFilter === 'all'
                                  ? 'bg-white text-gray-900 shadow-sm'
                                  : 'text-gray-500 hover:text-gray-700'
                              )}
                            >
                              All
                            </button>
                            <button
                              onClick={() => setMyBooksFilter('delivered')}
                              className={cn(
                                'rounded-xl px-4 py-2 text-sm font-bold transition-all',
                                myBooksFilter === 'delivered'
                                  ? 'bg-white text-green-600 shadow-sm'
                                  : 'text-gray-500 hover:text-gray-700'
                              )}
                            >
                              Delivered
                            </button>
                            <button
                              onClick={() => setMyBooksFilter('to-receive')}
                              className={cn(
                                'rounded-xl px-4 py-2 text-sm font-bold transition-all',
                                myBooksFilter === 'to-receive'
                                  ? 'bg-white text-orange-600 shadow-sm'
                                  : 'text-gray-500 hover:text-gray-700'
                              )}
                            >
                              To Receive
                            </button>
                          </div>
                        }
                      />

                      {ordersLoading ? (
                        <div className="grid grid-cols-1 gap-6 animate-pulse sm:grid-cols-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-[0_18px_60px_-28px_rgba(249,115,22,0.12)]"
                            >
                              <div className="flex gap-4">
                                <div className="h-28 w-20 rounded-xl bg-gray-200" />
                                <div className="flex-1 space-y-3">
                                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                                  <div className="h-3 w-1/3 rounded bg-gray-200" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : filteredBooks.length === 0 ? (
                        <EmptyState
                          icon={BookOpen}
                          title="No books found"
                          description={
                            myBooksFilter === 'delivered'
                              ? "You haven't received any books yet."
                              : myBooksFilter === 'to-receive'
                                ? 'All your books have been delivered!'
                                : 'Your purchased books will appear here.'
                          }
                        />
                      ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          {filteredBooks.map((book, idx) => (
                            <Link
                              key={`${book.bookId}-${idx}`}
                              href={`/book/${book.bookId}`}
                              className="group rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_60px_-28px_rgba(249,115,22,0.12)] transition-all hover:-translate-y-1 hover:border-orange-100 hover:shadow-[0_24px_70px_-22px_rgba(249,115,22,0.18)]"
                            >
                              <div className="flex gap-4">
                                <div className="h-28 w-20 shrink-0 overflow-hidden rounded-xl shadow-sm transition-transform group-hover:scale-[1.03]">
                                  {book.coverUrl ? (
                                    <img
                                      src={book.coverUrl}
                                      alt={book.title}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
                                      <BookOpen className="h-6 w-6" />
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h3 className="truncate font-serif text-lg font-bold text-gray-900 transition-colors group-hover:text-orange-600">
                                    {book.title}
                                  </h3>
                                  <p className="truncate text-sm text-gray-500">by {book.author}</p>
                                  <p className="mt-1 text-xs text-gray-400">Qty: {book.quantity}</p>
                                  <p className="mt-2 text-sm font-bold text-gray-900">
                                    {formatMoney(book.price * book.quantity)}
                                  </p>
                                  <div className="mt-3 flex items-center gap-2">
                                    <span
                                      className={cn(
                                        'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]',
                                        book.status === 'delivered'
                                          ? 'bg-green-50 text-green-600'
                                          : book.status === 'shipped'
                                            ? 'bg-blue-50 text-blue-600'
                                            : book.status === 'processing'
                                              ? 'bg-purple-50 text-purple-600'
                                              : 'bg-orange-50 text-orange-600'
                                      )}
                                    >
                                      {book.status === 'delivered'
                                        ? 'Delivered'
                                        : book.status === 'shipped'
                                          ? 'Shipped'
                                          : book.status === 'processing'
                                            ? 'Processing'
                                            : 'Pending'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {formatShortDate(book.orderDate)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'my-courses' && (
                    <div className="space-y-6">
                      <SectionHeader
                        title="My Courses"
                        subtitle="A cinematic learning library with direct access to every enrolled course."
                      />

                      {enrolledCourses.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          {enrolledCourses.map((course, idx) => (
                            <Link
                              key={course.id}
                              href={`/courses/${course.slug}/watch`}
                              className="group relative overflow-hidden rounded-[32px] transition-all duration-500 hover:-translate-y-2"
                              style={{ animationDelay: `${idx * 80}ms` }}
                            >
                              {/* Outer glow layer */}
                              <div className="absolute -inset-[1px] rounded-[32px] bg-gradient-to-br from-orange-500/20 via-amber-400/10 to-transparent opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />

                              {/* Main card */}
                              <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-white/90 via-white/85 to-orange-50/40 backdrop-blur-xl shadow-[0_20px_60px_-18px_rgba(249,115,22,0.1),0_8px_24px_-8px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:shadow-[0_28px_80px_-16px_rgba(249,115,22,0.22),0_12px_32px_-10px_rgba(0,0,0,0.08)] group-hover:border-orange-200/70">

                                {/* Decorative corner accents */}
                                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-orange-400/8 to-amber-300/5 blur-2xl transition-all duration-700 group-hover:from-orange-400/15 group-hover:to-amber-300/10" />
                                <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-gradient-to-tr from-orange-500/5 to-transparent blur-2xl" />

                                {/* Image / Cover */}
                                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50">
                                  {course.coverUrl ? (
                                    <img
                                      src={course.coverUrl}
                                      alt={course.title}
                                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                      <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-orange-200/50 blur-xl" />
                                        <BookOpen className="relative h-16 w-16 text-orange-300/70" />
                                      </div>
                                    </div>
                                  )}

                                  {/* Gradient overlays */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                  {/* Shimmer line */}
                                  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                  {/* Play button */}
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative">
                                      {/* Pulse rings */}
                                      <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '2s' }} />
                                      <div className="absolute -inset-3 rounded-full border-2 border-white/10 animate-pulse" />

                                      {/* Main play circle */}
                                      <div className="relative grid h-20 w-20 place-items-center rounded-full bg-white/90 backdrop-blur-md shadow-[0_12px_40px_-8px_rgba(0,0,0,0.25)] transition-all duration-500 group-hover:scale-115 group-hover:bg-white group-hover:shadow-[0_16px_48px_-8px_rgba(234,88,12,0.4)]">
                                        <Play className="ml-1 h-8 w-8 bg-gradient-to-br from-orange-600 to-amber-500 bg-clip-text text-transparent" style={{ WebkitTextFillColor: 'transparent' }} />
                                        <Play className="absolute ml-1 h-8 w-8 text-orange-600 transition-transform duration-500 group-hover:scale-110" fill="currentColor" />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Enrolled badge */}
                                  <div className="absolute left-4 top-4">
                                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-emerald-500/30">
                                      <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                      Enrolled
                                    </div>
                                  </div>

                                  {/* Progress indicator (if available) */}
                                  {course.progress !== undefined && (
                                    <div className="absolute right-4 top-4">
                                      <div className="relative h-12 w-12 rounded-full border-2 border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center">
                                        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
                                          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                                          <circle
                                            cx="24" cy="24" r="20"
                                            fill="none"
                                            stroke="url(#progressGradient)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 20}`}
                                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - course.progress / 100)}`}
                                            className="transition-all duration-700"
                                          />
                                          <defs>
                                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                              <stop offset="0%" stopColor="#ea580c" />
                                              <stop offset="100%" stopColor="#f59e0b" />
                                            </linearGradient>
                                          </defs>
                                        </svg>
                                        <span className="text-[9px] font-bold text-white">{course.progress}%</span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Content */}
                                <div className="relative p-6">
                                  {/* Decorative top line */}
                                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-300/40 to-transparent" />

                                  {/* Title */}
                                  <h3 className="font-serif text-xl font-bold text-gray-900 leading-tight transition-all duration-300 group-hover:text-orange-600 line-clamp-2">
                                    {course.title}
                                  </h3>

                                  {/* Instructor */}
                                  <div className="mt-2.5 flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-amber-50 text-orange-600 text-[10px] font-bold">
                                      {course.instructor?.charAt(0)?.toUpperCase() || 'I'}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">by {course.instructor}</p>
                                  </div>

                                  {/* Metadata row */}
                                  <div className="mt-4 flex flex-wrap items-center gap-3">
                                    {course.duration_hours && (
                                      <div className="flex items-center gap-1.5 rounded-lg bg-orange-50/70 px-2.5 py-1.5 text-[11px] font-medium text-orange-600">
                                        <Clock className="h-3 w-3" />
                                        <span>{course.duration_hours}h</span>
                                      </div>
                                    )}
                                    {course.lessons_count && (
                                      <div className="flex items-center gap-1.5 rounded-lg bg-amber-50/70 px-2.5 py-1.5 text-[11px] font-medium text-amber-600">
                                        <BookOpen className="h-3 w-3" />
                                        <span>{course.lessons_count} lessons</span>
                                      </div>
                                    )}
                                    {course.level && (
                                      <div className={cn(
                                        "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium",
                                        course.level === 'beginner' && 'bg-emerald-50/70 text-emerald-600',
                                        course.level === 'intermediate' && 'bg-blue-50/70 text-blue-600',
                                        course.level === 'advanced' && 'bg-purple-50/70 text-purple-600'
                                      )}>
                                        <Target className="h-3 w-3" />
                                        <span className="capitalize">{course.level}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Footer divider */}
                                  <div className="mt-5 h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200/60 to-transparent" />

                                  {/* Action row */}
                                  <div className="mt-4 flex items-center justify-between">
                                    {/* Enrollment date */}
                                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                      <Calendar className="h-3.5 w-3.5 text-orange-400/60" />
                                      <span>{formatShortDate(course.orderDate)}</span>
                                    </div>

                                    {/* CTA */}
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-orange-600 transition-all duration-300 group-hover:gap-2.5 group-hover:text-orange-700">
                                      <span>Watch Now</span>
                                      <div className="relative overflow-hidden">
                                        <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={GraduationCap}
                          title="No courses enrolled"
                          description="You haven't enrolled in any courses yet. Once you do, they will appear here with premium watch access."
                          action={
                            <Link
                              href="/courses"
                              className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-8 py-4 font-bold text-white transition-all hover:bg-orange-700 hover:shadow-[0_18px_40px_-18px_rgba(234,88,12,0.45)]"
                            >
                              Browse Courses
                            </Link>
                          }
                        />
                      )}
                    </div>
                  )}

                  {activeTab === 'wishlist' && (
                    <div className="space-y-6">
                      <SectionHeader
                        title="My Wishlist"
                        subtitle="A curated collection of books you saved for later."
                      />

                      {wishlistLoading ? (
                        <div className="grid grid-cols-1 gap-6 animate-pulse md:grid-cols-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="flex gap-6 rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-[0_18px_60px_-28px_rgba(249,115,22,0.12)]"
                            >
                              <div className="h-36 w-24 shrink-0 rounded-xl bg-gray-200" />
                              <div className="flex-1 space-y-3">
                                <div className="h-6 w-3/4 rounded bg-gray-200" />
                                <div className="h-4 w-1/2 rounded bg-gray-200" />
                                <div className="mt-4 h-6 w-1/3 rounded bg-gray-200" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : wishlistBooks.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          {wishlistBooks.map((book) => (
                            <div
                              key={book.id}
                              className="group flex gap-6 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_60px_-28px_rgba(249,115,22,0.12)] transition-all hover:-translate-y-1 hover:border-orange-100 hover:shadow-[0_24px_70px_-22px_rgba(249,115,22,0.18)]"
                            >
                              <div className="h-36 w-24 shrink-0 overflow-hidden rounded-xl shadow-lg transition-transform group-hover:scale-[1.03]">
                                <img
                                  src={book.coverUrl}
                                  alt={book.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex min-w-0 flex-1 flex-col justify-between">
                                <div>
                                  <Link
                                    href={`/book/${book.id}`}
                                    className="block truncate font-serif text-xl font-bold text-gray-900 transition-colors hover:text-orange-600"
                                  >
                                    {book.title}
                                  </Link>
                                  <p className="mt-1 text-sm text-gray-500">{book.author}</p>
                                  <p className="mt-2 text-lg font-bold text-gray-900">
                                    {formatMoney(book.price)}
                                  </p>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                  <Link
                                    href={`/book/${book.id}`}
                                    className="inline-flex items-center gap-1 text-sm font-bold text-orange-600 hover:underline"
                                  >
                                    <span>View Details</span>
                                    <ChevronRight className="h-4 w-4" />
                                  </Link>
                                  <button
                                    onClick={() => handleRemoveFromWishlist(book.id)}
                                    className="rounded-xl p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
                                  >
                                    <Heart className="h-5 w-5 fill-red-600 text-red-600" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={Heart}
                          title="Wishlist is empty"
                          description="Your wishlist will appear here when you save books for later."
                          action={
                            <Link
                              href="/shop"
                              className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-8 py-4 font-bold text-white transition-all hover:bg-orange-700 hover:shadow-[0_18px_40px_-18px_rgba(234,88,12,0.45)]"
                            >
                              Discover Books
                            </Link>
                          }
                        />
                      )}
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="space-y-8">
                      <SectionHeader
                        title="Account Settings"
                        subtitle="Refine your personal information and keep your account secure."
                      />

                      <div className="grid gap-8">
                        <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_18px_60px_-28px_rgba(249,115,22,0.12)]">
                          <div className="mb-8 flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                              <p className="mt-1 text-sm text-gray-500">
                                Update your profile details, address, and contact information.
                              </p>
                            </div>

                            {!editing && (
                              <button
                                onClick={() => setEditing(true)}
                                className="text-sm font-bold text-orange-600 transition-colors hover:underline"
                              >
                                Edit Profile
                              </button>
                            )}
                          </div>

                          <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                                  Display Name
                                </label>
                                <input
                                  type="text"
                                  value={formData.displayName}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      displayName: e.target.value.slice(0, 100),
                                    }))
                                  }
                                  disabled={!editing}
                                  maxLength={100}
                                  className="w-full rounded-2xl border border-transparent bg-gray-50/80 p-4 outline-none transition-all focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                                  Phone Number
                                </label>
                                <input
                                  type="tel"
                                  value={formData.phone}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      phone: e.target.value.replace(/\D/g, '').slice(0, 11),
                                    }))
                                  }
                                  disabled={!editing}
                                  placeholder="01XXXXXXXXX"
                                  maxLength={11}
                                  className="w-full rounded-2xl border border-transparent bg-gray-50/80 p-4 outline-none transition-all focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                                  Email Address
                                </label>
                                <input
                                  type="email"
                                  value={formData.email}
                                  disabled
                                  className="w-full rounded-2xl border border-transparent bg-gray-50/80 p-4 opacity-50 outline-none"
                                />
                              </div>

                              <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                                  Address
                                </label>
                                <input
                                  type="text"
                                  value={formData.address}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      address: e.target.value,
                                    }))
                                  }
                                  disabled={!editing}
                                  placeholder="Street address"
                                  className="w-full rounded-2xl border border-transparent bg-gray-50/80 p-4 outline-none transition-all focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                                  City
                                </label>
                                <input
                                  type="text"
                                  value={formData.city}
                                  onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                                  }
                                  disabled={!editing}
                                  placeholder="City"
                                  className="w-full rounded-2xl border border-transparent bg-gray-50/80 p-4 outline-none transition-all focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                                  Zip Code
                                </label>
                                <input
                                  type="text"
                                  value={formData.zipCode}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      zipCode: e.target.value,
                                    }))
                                  }
                                  disabled={!editing}
                                  placeholder="Zip Code"
                                  className="w-full rounded-2xl border border-transparent bg-gray-50/80 p-4 outline-none transition-all focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50"
                                />
                              </div>
                            </div>

                            {editing && (
                              <div className="flex flex-wrap gap-4">
                                <button
                                  type="submit"
                                  className="rounded-2xl bg-orange-600 px-8 py-3 font-bold text-white transition-all hover:bg-orange-700 hover:shadow-[0_18px_40px_-18px_rgba(234,88,12,0.45)]"
                                >
                                  Save Changes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditing(false);
                                    setFormData({
                                      displayName: profile?.displayName || '',
                                      email: profile?.email || '',
                                      phone: profile?.phone || '',
                                      address: profile?.address || '',
                                      city: profile?.city || '',
                                      zipCode: profile?.zipCode || '',
                                    });
                                  }}
                                  className="rounded-2xl bg-gray-100 px-8 py-3 font-bold text-gray-600 transition-all hover:bg-gray-200"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </form>
                        </div>

                        <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_18px_60px_-28px_rgba(249,115,22,0.12)]">
                          <div className="mb-8 flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
                              <p className="mt-1 text-sm text-gray-500">
                                Keep your account secure with a strong password.
                              </p>
                            </div>

                            {!showPassword && (
                              <button
                                onClick={() => setShowPassword(true)}
                                className="text-sm font-bold text-orange-600 transition-colors hover:underline"
                              >
                                Change Password
                              </button>
                            )}
                          </div>

                          {showPassword ? (
                            <form onSubmit={handleChangePassword} className="space-y-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                                  Current Password
                                </label>
                                <input
                                  type="password"
                                  value={passwordData.currentPassword}
                                  onChange={(e) =>
                                    setPasswordData((prev) => ({
                                      ...prev,
                                      currentPassword: e.target.value,
                                    }))
                                  }
                                  placeholder="Enter current password"
                                  className={cn(
                                    'w-full rounded-2xl border bg-gray-50/80 p-4 outline-none transition-all',
                                    passwordErrors.currentPassword
                                      ? 'border-red-200 focus:border-red-500/20 focus:ring-4 focus:ring-red-500/10'
                                      : 'border-transparent focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/10'
                                  )}
                                />
                                {passwordErrors.currentPassword && (
                                  <p className="text-xs text-red-500">{passwordErrors.currentPassword}</p>
                                )}
                              </div>

                              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                                    New Password
                                  </label>
                                  <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) =>
                                      setPasswordData((prev) => ({
                                        ...prev,
                                        newPassword: e.target.value,
                                      }))
                                    }
                                    placeholder="At least 6 characters"
                                    className={cn(
                                      'w-full rounded-2xl border bg-gray-50/80 p-4 outline-none transition-all',
                                      passwordErrors.newPassword
                                        ? 'border-red-200 focus:border-red-500/20 focus:ring-4 focus:ring-red-500/10'
                                        : 'border-transparent focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/10'
                                    )}
                                  />
                                  {passwordErrors.newPassword && (
                                    <p className="text-xs text-red-500">{passwordErrors.newPassword}</p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                                    Confirm New Password
                                  </label>
                                  <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) =>
                                      setPasswordData((prev) => ({
                                        ...prev,
                                        confirmPassword: e.target.value,
                                      }))
                                    }
                                    placeholder="Re-enter new password"
                                    className={cn(
                                      'w-full rounded-2xl border bg-gray-50/80 p-4 outline-none transition-all',
                                      passwordErrors.confirmPassword
                                        ? 'border-red-200 focus:border-red-500/20 focus:ring-4 focus:ring-red-500/10'
                                        : 'border-transparent focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/10'
                                    )}
                                  />
                                  {passwordErrors.confirmPassword && (
                                    <p className="text-xs text-red-500">
                                      {passwordErrors.confirmPassword}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-4">
                                <button
                                  type="submit"
                                  disabled={loading}
                                  className="rounded-2xl bg-orange-600 px-8 py-3 font-bold text-white transition-all hover:bg-orange-700 disabled:opacity-50"
                                >
                                  {loading ? 'Updating...' : 'Update Password'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowPassword(false);
                                    setPasswordData({
                                      currentPassword: '',
                                      newPassword: '',
                                      confirmPassword: '',
                                    });
                                    setPasswordErrors({
                                      currentPassword: '',
                                      newPassword: '',
                                      confirmPassword: '',
                                    });
                                  }}
                                  className="rounded-2xl bg-gray-100 px-8 py-3 font-bold text-gray-600 transition-all hover:bg-gray-200"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <p className="text-sm leading-6 text-gray-500">
                              Keep your account secure by using a strong password. Change it regularly for
                              better security.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </PremiumSurface>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}